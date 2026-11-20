import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { coverEncodeSettings, coverFallbackWidth, coverWidthsForSource } from "./coverVariantConfig.mjs";
import { resolveGroupForImage, resolveGroupMetadata } from "../src/lib/galleryGroupUtils.js";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src", "assets", "gallery-source");
const coverSourceDir = path.join(root, "src", "assets", "gallery-covers");
const outputDir = path.join(root, "public", "gallery");
const dataDir = path.join(root, "src", "data");
const publicManifest = path.join(outputDir, "gallery.manifest.json");
const cacheFile = path.join(root, ".image-pipeline-cache.json");
const coverCacheFile = path.join(root, ".cover-pipeline-cache.json");
const groupsFile = path.join(sourceDir, "groups.json");
const sizes = [320, 480, 640, 960, 1280, 1920];
const coverPipelineVersion = "cover-v2";
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic"]);
const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");
const hex = ({ r, g, b }) => `#${[r, g, b].map((part) => Math.round(part).toString(16).padStart(2, "0")).join("")}`;
const readJson = async (file, fallback) => { try { return JSON.parse(await readFile(file, "utf8")); } catch { return fallback; } };

await mkdir(sourceDir, { recursive: true });
await mkdir(outputDir, { recursive: true });
await mkdir(dataDir, { recursive: true });
const captionMap = await readJson(path.join(sourceDir, "captions.json"), {});
const groupConfig = await readJson(groupsFile, { groups: [], assignments: {} });
const cache = await readJson(cacheFile, {});
const coverCache = await readJson(coverCacheFile, {});
const configuredGroups = new Set(groupConfig.groups.map((group) => group.id));
const sources = [];
for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
  if (entry.isFile() && supported.has(path.extname(entry.name).toLowerCase())) sources.push({ name: entry.name, file: path.join(sourceDir, entry.name), relative: entry.name, folderGroup: undefined });
  if (entry.isDirectory() && configuredGroups.has(entry.name)) {
    for (const child of await readdir(path.join(sourceDir, entry.name), { withFileTypes: true })) {
      if (child.isFile() && supported.has(path.extname(child.name).toLowerCase())) sources.push({ name: child.name, file: path.join(sourceDir, entry.name, child.name), relative: `${entry.name}/${child.name}`, folderGroup: entry.name });
    }
  }
}
sources.sort((a, b) => a.relative.localeCompare(b.relative, undefined, { numeric: true }));
const usedIds = new Set();
for (const source of sources) {
  const baseId = path.parse(source.name).name;
  const candidateId = source.folderGroup && !baseId.startsWith("gallery-") ? `gallery-${baseId}` : baseId;
  source.id = usedIds.has(candidateId) ? `gallery-${source.folderGroup ?? "gallery"}-${baseId.replace(/^gallery-/, "")}` : candidateId;
  usedIds.add(source.id);
}
const manifest = [];
const outputNames = new Set();
const variantsByHash = new Map();
const inFlight = new Map();
let cursor = 0;

async function ensureVariants(file, sourceHash, metadata) {
  if (variantsByHash.has(sourceHash)) return variantsByHash.get(sourceHash);
  if (inFlight.has(sourceHash)) return inFlight.get(sourceHash);
  const job = buildVariants(file, sourceHash, metadata).finally(() => inFlight.delete(sourceHash));
  inFlight.set(sourceHash, job);
  return job;
}

async function buildVariants(file, sourceHash, metadata) {
  const prior = cache[sourceHash];
  if (prior?.variants && prior.files?.length && (await Promise.all(prior.files.map((name) => fileExists(path.join(outputDir, name))))).every(Boolean)) {
    prior.files.forEach((name) => outputNames.add(name));
    variantsByHash.set(sourceHash, prior);
    return prior;
  }
  const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
  const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
  const widths = sizes.filter((size) => size < width);
  if (width > 0 && !widths.includes(width)) widths.push(width);
  const variants = { avif: {}, webp: {} };
  const files = [];
  for (const targetWidth of widths) {
    for (const format of ["avif", "webp"]) {
      const filename = `${sourceHash.slice(0, 16)}-${targetWidth}.${format}`;
      const destination = path.join(outputDir, filename);
      if (!outputNames.has(filename) && !(await fileExists(destination))) {
        const pipeline = sharp(file).rotate().resize({ width: targetWidth, withoutEnlargement: true });
        if (format === "avif") await pipeline.avif({ quality: 53, effort: 4 }).toFile(destination);
        else await pipeline.webp({ quality: 76, effort: 4 }).toFile(destination);
      }
      variants[format][targetWidth] = `/gallery/${filename}`;
      files.push(filename);
      outputNames.add(filename);
    }
  }
  const blurName = `${sourceHash.slice(0, 16)}-blur.webp`;
  const blurPath = path.join(outputDir, blurName);
  if (!(await fileExists(blurPath))) await sharp(file).rotate().resize({ width: 24, withoutEnlargement: true }).webp({ quality: 38, effort: 4 }).toFile(blurPath);
  const blur = `data:image/webp;base64,${(await readFile(blurPath)).toString("base64")}`;
  files.push(blurName);
  outputNames.add(blurName);
  const colors = await sharp(file).rotate().stats();
  const value = { width, height, aspect: width / height, blur, color: hex(colors.dominant), variants, files };
  variantsByHash.set(sourceHash, value);
  cache[sourceHash] = value;
  return value;
}

async function fileExists(file) { try { await stat(file); return true; } catch { return false; } }

async function buildCoverVariants(group, file) {
  const buffer = await readFile(file);
  const sourceHash = sha(buffer);
  const pipelineHash = sha(`${sourceHash}:${coverPipelineVersion}`);
  const cacheKey = `${coverPipelineVersion}:${sourceHash}`;
  const prior = coverCache[cacheKey];
  if (prior?.variants && prior.files?.length && (await Promise.all(prior.files.map((name) => fileExists(path.join(outputDir, name))))).every(Boolean)) {
    prior.files.forEach((name) => outputNames.add(name));
    return { ...prior, id: `cover-${group.id}`, alt: `${group.title} album cover` };
  }
  const metadata = await sharp(file).metadata();
  const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
  const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
  const variants = { avif: {}, webp: {}, jpeg: "" };
  const files = [];
  const widths = coverWidthsForSource(width);
  for (const targetWidth of widths) {
    for (const format of ["avif", "webp"]) {
      const filename = `${pipelineHash.slice(0, 16)}-cover-${targetWidth}.${format}`;
      const destination = path.join(outputDir, filename);
      if (!outputNames.has(filename) && !(await fileExists(destination))) {
        let pipeline = sharp(file).rotate().resize({ width: targetWidth, fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 }).toColourspace("srgb");
        if (targetWidth < width) pipeline = pipeline.sharpen({ sigma: 0.5, m1: 0.6, m2: 1.2 });
        if (format === "avif") await pipeline.avif(coverEncodeSettings.avif).toFile(destination);
        else await pipeline.webp(coverEncodeSettings.webp).toFile(destination);
      }
      variants[format][targetWidth] = `/gallery/${filename}`;
      files.push(filename);
      outputNames.add(filename);
    }
  }
  const jpegWidth = coverFallbackWidth(width);
  const jpegName = `${pipelineHash.slice(0, 16)}-cover-${jpegWidth}.jpg`;
  const jpegPath = path.join(outputDir, jpegName);
  if (!outputNames.has(jpegName) && !(await fileExists(jpegPath))) {
    let jpegPipeline = sharp(file).rotate().resize({ width: jpegWidth, fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 }).toColourspace("srgb");
    if (jpegWidth < width) jpegPipeline = jpegPipeline.sharpen({ sigma: 0.5, m1: 0.6, m2: 1.2 });
    await jpegPipeline.jpeg(coverEncodeSettings.jpeg).toFile(jpegPath);
  }
  variants.jpeg = `/gallery/${jpegName}`;
  files.push(jpegName);
  outputNames.add(jpegName);
  const colors = await sharp(file).rotate().stats();
  const resolved = {
    id: `cover-${group.id}`,
    width,
    height,
    aspect: width / height,
    blur: "",
    color: hex(colors.dominant),
    variants,
    alt: `${group.title} album cover`,
    sourceHash,
    files,
  };
  coverCache[cacheKey] = resolved;
  return resolved;
}

const workers = Array.from({ length: 4 }, async () => {
  while (true) {
    const index = cursor++;
    if (index >= sources.length) return;
    const source = sources[index];
    const { name, file } = source;
    const buffer = await readFile(file);
    const sourceHash = sha(buffer);
    const caption = captionMap[source.relative] ?? captionMap[name] ?? captionMap[source.id] ?? {};
    const generated = await ensureVariants(file, sourceHash, await sharp(file).metadata());
    const id = source.id;
    const group = resolveGroupForImage({ id, relativePath: source.relative, folderGroup: source.folderGroup, captionGroup: caption.group, assignments: groupConfig.assignments, validGroups: [...configuredGroups] });
    manifest[index] = {
      id,
      width: generated.width,
      height: generated.height,
      aspect: generated.aspect,
      blur: generated.blur,
      color: generated.color,
      variants: generated.variants,
      ...(caption.featured ? { featured: true } : {}),
      alt: caption.alt ?? `Wuse Assembly gallery photo ${id.replace(/^gallery-/, "")}`,
      ...(caption.caption ? { caption: caption.caption } : {}),
      ...(group ? { group } : {}),
      sourceHash,
    };
  }
});

await Promise.all(workers);
const coverAssets = {};
for (const group of groupConfig.groups) {
  const sourceName = group.coverSource;
  if (!sourceName) {
    console.warn(`WARNING: no cover source configured for ${group.title}; using a featured or first album photo.`);
    continue;
  }
  if (path.basename(sourceName) !== sourceName || !supported.has(path.extname(sourceName).toLowerCase())) {
    throw new Error(`Invalid cover source path for ${group.title}: ${sourceName}`);
  }
  const coverPath = path.join(coverSourceDir, sourceName);
  if (!(await fileExists(coverPath))) {
    console.warn(`WARNING: cover source ${sourceName} is missing for ${group.title}; using a featured or first album photo.`);
    continue;
  }
  const cover = await buildCoverVariants(group, coverPath);
  coverAssets[group.id] = cover;
  if (cover.width < 960) console.warn(`WARNING: ${group.title} cover source is only ${cover.width}px wide; it cannot render sharply at large banner sizes.`);
}
const { groups: resolvedGroups, unassigned } = resolveGroupMetadata(groupConfig.groups, manifest, coverAssets);
const siteImageIds = new Set([
  ...manifest.filter((image) => image.id.startsWith("gallery-")).slice(0, 24).map((image) => image.id),
  "cong-1", "cong-2", "gallery-46", "hero-church", "join-online", "pastor-josiah", "pastor-lawrence", "pastor-nkopeti", "pastor-ogunrole", "tac-logo", "test-1",
  ...manifest.filter((image) => image.featured).slice(0, 12).map((image) => image.id),
]);
const siteManifest = manifest.filter((image) => siteImageIds.has(image.id));
const usedPaths = new Set([...variantsByHash.values()].flatMap((value) => value.files));
for (const cover of Object.values(coverAssets)) cover.files?.forEach((name) => usedPaths.add(name));
for (const filename of await readdir(outputDir)) if (!usedPaths.has(filename)) await rm(path.join(outputDir, filename), { force: true });
await writeFile(cacheFile, `${JSON.stringify(Object.fromEntries([...variantsByHash.entries()]), null, 2)}\n`);
await writeFile(coverCacheFile, `${JSON.stringify(coverCache, null, 2)}\n`);
await writeFile(path.join(dataDir, "gallery.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(path.join(dataDir, "site.manifest.json"), `${JSON.stringify(siteManifest, null, 2)}\n`);
await writeFile(publicManifest, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(path.join(dataDir, "gallery.groups.json"), `${JSON.stringify(resolvedGroups, null, 2)}\n`);
console.log(`Optimized ${manifest.length} gallery images (${variantsByHash.size} unique sources).`);
console.log("Gallery album counts:");
for (const group of resolvedGroups) console.log(`  ${group.title}: ${group.count}`);
if (unassigned.length) console.warn(`WARNING: unassigned gallery photo ids (${unassigned.length}) will not appear in an album: ${unassigned.map((image) => image.id).join(", ")}`);
else console.log("All gallery photos are assigned to an album.");
