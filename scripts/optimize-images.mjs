import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src", "assets", "gallery-source");
const outputDir = path.join(root, "public", "gallery");
const dataDir = path.join(root, "src", "data");
const publicManifest = path.join(outputDir, "gallery.manifest.json");
const cacheFile = path.join(root, ".image-pipeline-cache.json");
const sizes = [320, 480, 640, 960, 1280, 1920];
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic"]);
const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");
const hex = ({ r, g, b }) => `#${[r, g, b].map((part) => Math.round(part).toString(16).padStart(2, "0")).join("")}`;
const readJson = async (file, fallback) => { try { return JSON.parse(await readFile(file, "utf8")); } catch { return fallback; } };

await mkdir(sourceDir, { recursive: true });
await mkdir(outputDir, { recursive: true });
await mkdir(dataDir, { recursive: true });
const captionMap = await readJson(path.join(sourceDir, "captions.json"), {});
const cache = await readJson(cacheFile, {});
const names = (await readdir(sourceDir)).filter((name) => supported.has(path.extname(name).toLowerCase())).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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
  if (prior?.variants && prior.files?.every((name) => outputNames.has(name) || fileExists(path.join(outputDir, name)))) {
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

const workers = Array.from({ length: 4 }, async () => {
  while (true) {
    const index = cursor++;
    if (index >= names.length) return;
    const name = names[index];
    const file = path.join(sourceDir, name);
    const buffer = await readFile(file);
    const sourceHash = sha(buffer);
    const caption = captionMap[name] ?? {};
    const generated = await ensureVariants(file, sourceHash, await sharp(file).metadata());
    const id = path.parse(name).name;
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
      sourceHash,
    };
  }
});

await Promise.all(workers);
const siteImageIds = new Set([
  ...manifest.filter((image) => image.id.startsWith("gallery-")).slice(0, 24).map((image) => image.id),
  "cong-1", "cong-2", "gallery-46", "hero-church", "join-online", "pastor-josiah", "pastor-lawrence", "pastor-nkopeti", "pastor-ogunrole", "tac-logo", "test-1",
  ...manifest.filter((image) => image.featured).slice(0, 12).map((image) => image.id),
]);
const siteManifest = manifest.filter((image) => siteImageIds.has(image.id));
const usedPaths = new Set([...variantsByHash.values()].flatMap((value) => value.files));
for (const filename of await readdir(outputDir)) if (!usedPaths.has(filename)) await rm(path.join(outputDir, filename), { force: true });
await writeFile(cacheFile, `${JSON.stringify(Object.fromEntries([...variantsByHash.entries()]), null, 2)}\n`);
await writeFile(path.join(dataDir, "gallery.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(path.join(dataDir, "site.manifest.json"), `${JSON.stringify(siteManifest, null, 2)}\n`);
await writeFile(publicManifest, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Optimized ${manifest.length} gallery images (${variantsByHash.size} unique sources).`);
