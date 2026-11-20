import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, X } from "@/components/FontAwesomeIcons";
import PageHeader from "@/components/PageHeader";
import { FloatingField } from "@/components/FloatingImages";
import { gallerySlotMap } from "@/lib/gallerySlotMaps";
import ResponsiveImage from "@/components/ResponsiveImage";
import { galleryGroups, galleryImages as initialGalleryImages, getGroupCover, getGroupImages, loadGalleryImages, type GalleryImage } from "@/data/gallery";
import { ease } from "@/components/motion";

const PAGE_SIZE = 24;
interface CoverSample { group: string; currentSrc: string; naturalWidth: number; sourceWidth: number; sourceHeight: number; renderedWidth: number; renderedHeight: number; dpr: number; fitScale: number; srcsetWidths: string; sizes: string; srcsetPass: boolean; sizesPass: boolean; fallbackPass: boolean; pixelWidthPass: boolean; fitScalePass: boolean; transformPass: boolean; placeholderPass: boolean; opacityPass: boolean }

const GalleryCoverDebug = () => {
  const [samples, setSamples] = useState<CoverSample[]>([]);
  const lastLogged = useRef("");
  const enabled = import.meta.env.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const dpr = window.devicePixelRatio || 1;
      const next = [...document.querySelectorAll<HTMLImageElement>("img[data-cover-group]")].map((image) => {
        const sourceWidth = Number(image.currentSrc.match(/-cover-(\d+)\.(?:avif|webp|jpg)(?:\?|$)/i)?.[1] ?? image.naturalWidth);
        const sourceHeight = sourceWidth / Number(image.dataset.coverAspect ?? 1);
        const rect = image.getBoundingClientRect();
        const sourceWidths = [...(image.closest("picture")?.querySelector<HTMLSourceElement>('source[type="image/avif"]')?.srcset.matchAll(/(?:^|\s)(\d+)w(?:,|$)/g) ?? [])].map((match) => Number(match[1])).sort((a, b) => a - b);
        const sizes = image.closest("picture")?.querySelector<HTMLSourceElement>('source[type="image/avif"]')?.sizes ?? "";
        const sourceImageWidth = Number(image.getAttribute("width"));
        const expectedWidths = [...new Set([960, 1280, 1600, 1920, 2560].filter((width) => width <= sourceImageWidth).concat(sourceImageWidth))].sort((a, b) => a - b);
        const fallbackWidth = Math.min(1600, sourceImageWidth);
        const coverFrame = image.closest<HTMLElement>(".gallery-album-cover");
        const ancestors = [image, ...Array.from((function* () { let node = image.parentElement; while (node && node !== coverFrame?.parentElement) { yield node; if (node === coverFrame) break; node = node.parentElement; } })())];
        const transformPass = ancestors.every((node) => {
          const style = getComputedStyle(node);
          return style.transform === "none" && style.filter === "none" && style.backdropFilter === "none" && style.willChange === "auto" && Number(style.opacity) === 1 && (style.zoom === "normal" || style.zoom === "1") && style.backfaceVisibility === "visible";
        }) && getComputedStyle(image).imageRendering === "auto";
        const placeholderPass = !image.closest(".responsive-image-frame")?.querySelector(".responsive-image-placeholder") && !getComputedStyle(image.closest("picture") as Element).backgroundImage.startsWith("url(");
        const fitScale = Math.max(rect.width / sourceWidth, rect.height / sourceHeight);
        return {
          group: image.dataset.coverGroup ?? "unknown",
          currentSrc: image.currentSrc,
          naturalWidth: image.naturalWidth,
          sourceWidth,
          sourceHeight: Math.round(sourceHeight),
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
          dpr,
          fitScale: Number((fitScale * dpr).toFixed(2)),
          srcsetWidths: sourceWidths.join(", "),
          sizes,
          srcsetPass: JSON.stringify(sourceWidths) === JSON.stringify(expectedWidths),
          sizesPass: sizes === "(max-width: 640px) 100vw, (max-width: 1100px) 92vw, 1100px",
          fallbackPass: /-cover-\d+\.jpg(?:\?|$)/i.test(image.getAttribute("src") ?? "") && image.getAttribute("src")?.includes(`-cover-${fallbackWidth}.jpg`) === true,
          pixelWidthPass: sourceWidth >= rect.width * dpr,
          fitScalePass: fitScale * dpr <= 1,
          transformPass,
          placeholderPass,
          opacityPass: getComputedStyle(image).opacity === "1",
        };
      });
      setSamples(next);
      const signature = JSON.stringify(next);
      if (signature !== lastLogged.current && next.length) {
        lastLogged.current = signature;
        console.table(next.map(({ currentSrc, ...sample }) => ({ ...sample, currentSrc: currentSrc.split("/").pop() })));
      }
    };
    update();
    const timer = window.setInterval(update, 500);
    window.addEventListener("resize", update);
    document.addEventListener("load", update, true);
    return () => { window.clearInterval(timer); window.removeEventListener("resize", update); document.removeEventListener("load", update, true); };
  }, [enabled]);
  if (!enabled) return null;
  return <aside className="gallery-cover-debug" aria-label="Gallery cover sharpness checks">
    <strong>Cover sharpness and rendering checks · DPR {window.devicePixelRatio || 1}</strong>
    <div className="gallery-cover-debug-scroll"><table><thead><tr><th>Album</th><th>Current source</th><th>Browser naturalWidth</th><th>File px</th><th>Rendered px</th><th>scale × DPR</th><th>AVIF srcset widths</th><th>Sizes / checks</th></tr></thead>
      <tbody>{samples.map((sample) => <tr key={sample.group}><td>{sample.group}</td><td>{sample.currentSrc.split("/").pop() || "waiting"}</td><td>{sample.naturalWidth}px</td><td>{sample.sourceWidth} × {sample.sourceHeight}</td><td>{sample.renderedWidth} × {sample.renderedHeight} @ {sample.dpr}x</td><td>{sample.fitScale}</td><td>{sample.srcsetWidths}</td><td>{sample.sizes}<br />{[sample.pixelWidthPass, sample.fitScalePass, sample.transformPass, sample.placeholderPass, sample.opacityPass, sample.srcsetPass, sample.sizesPass, sample.fallbackPass].every(Boolean) ? "PASS" : `FAIL${!sample.pixelWidthPass || !sample.fitScalePass ? " pixels" : ""}${!sample.transformPass ? " transform" : ""}${!sample.placeholderPass ? " placeholder" : ""}${!sample.opacityPass ? " opacity" : ""}${!sample.srcsetPass ? " srcset" : ""}${!sample.sizesPass ? " sizes" : ""}${!sample.fallbackPass ? " jpeg" : ""}`}</td></tr>)}</tbody>
    </table></div>
  </aside>;
};

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>(initialGalleryImages.filter((image) => image.id.startsWith("gallery-")));
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const fieldText = useRef<HTMLHeadingElement>(null);
  const albumRefs = useRef<Record<string, HTMLElement | null>>({});
  const touchStartX = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    loadGalleryImages().then((all) => { if (mounted) setImages(all.filter((image) => image.id.startsWith("gallery-"))); })
      .catch((error: unknown) => console.warn("Gallery image catalog could not be loaded.", error));
    return () => { mounted = false; };
  }, []);

  const visibleGroups = useMemo(() => galleryGroups.filter((group) => getGroupImages(group.id, images).length > 0), [images]);
  const openGroup = visibleGroups.find((group) => group.id === openId);
  const openImages = useMemo(() => openId ? getGroupImages(openId, images) : [], [openId, images]);
  const totalPhotos = useMemo(() => new Set(images.map((image) => image.sourceHash)).size, [images]);
  const closeLightbox = useCallback(() => setSelected(null), []);
  const moveLightbox = useCallback((delta: number) => setSelected((index) => index === null || !openImages.length ? null : (index + delta + openImages.length) % openImages.length), [openImages.length]);

  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1));
    setOpenId(visibleGroups.some((group) => group.id === hash) ? hash : null);
  }, [location.hash, visibleGroups]);

  useEffect(() => {
    if (!openId) return;
    const target = albumRefs.current[openId];
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      const headerBottom = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerBottom - 16;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [openId, reduced]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !openId || (visibleCounts[openId] ?? PAGE_SIZE) >= openImages.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCounts((current) => ({ ...current, [openId]: Math.min((current[openId] ?? PAGE_SIZE) + PAGE_SIZE, openImages.length) }));
    }, { rootMargin: "600px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [openId, visibleCounts, openImages.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeLightbox(); if (event.key === "ArrowRight") moveLightbox(1); if (event.key === "ArrowLeft") moveLightbox(-1); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [selected, closeLightbox, moveLightbox]);

  useEffect(() => {
    if (selected === null || !openImages.length) return;
    [-1, 1].forEach((offset) => {
      const photo = openImages[(selected + offset + openImages.length) % openImages.length];
      const preload = new Image();
      preload.src = photo.variants.webp["1280"] ?? photo.variants.webp["960"] ?? "";
    });
  }, [selected, openImages]);

  const toggleGroup = (groupId: string) => {
    const next = groupId === openId ? null : groupId;
    setSelected(null);
    setVisibleCounts((current) => ({ ...current, [groupId]: current[groupId] ?? PAGE_SIZE }));
    setOpenId(next);
    navigate({ pathname: "/gallery", hash: next ? `#${next}` : "" });
  };

  return <>
    <PageHeader label="Gallery" title="Moments from our gatherings."><p>Photos from our services and events.</p></PageHeader>
    <section className="gallery-field relative mb-16 overflow-hidden bg-primary" aria-label="Floating moments from our gallery">
      <FloatingField images={images} slots={gallerySlotMap} exclusionRef={fieldText} className="floating-gallery-field" debug rotatePhotos />
      <div className="gallery-field-copy relative z-20 grid min-h-[88svh] place-items-center px-5 text-center">
        <h2 ref={fieldText} className="gallery-field-title text-balance">Our community · Our moments</h2>
      </div>
    </section>

    <section className="container gallery-albums-section pb-24" aria-label="Photo albums">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div><p className="editorial-label mb-3">Browse our albums.</p><h2 className="sr-only">Browse our albums</h2></div>
        <p className="text-sm font-semibold text-muted-foreground">{totalPhotos.toLocaleString()} photos</p>
      </div>
      <div className="space-y-5">
        {visibleGroups.map((group, groupIndex) => {
          const photos = getGroupImages(group.id, images);
          const expanded = openId === group.id;
          const count = visibleCounts[group.id] ?? PAGE_SIZE;
          const cover = getGroupCover(group.id, images);
          const panelId = `album-panel-${group.id}`;
          const buttonId = `album-button-${group.id}`;
          return <article key={group.id} ref={(node) => { albumRefs.current[group.id] = node; }} className="gallery-album">
            <h2 className="gallery-album-heading">
              <button id={buttonId} type="button" className={`gallery-album-cover ${expanded ? "is-open" : ""}`} aria-expanded={expanded} aria-controls={panelId} onClick={() => toggleGroup(group.id)}>
                {cover && <ResponsiveImage image={cover} alt="" aria-hidden data-cover-group={group.id} data-cover-aspect={cover.aspect} fit="fill" placeholder="color" priority={groupIndex < 2} resolution="cover" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 92vw, 1100px" frameClassName="gallery-album-cover-frame" className="gallery-album-cover-image" style={{ objectPosition: "var(--cover-position, 50% 30%)", "--cover-position": group.coverPosition ?? "50% 30%", "--cover-position-mobile": group.coverPositionMobile ?? group.coverPosition ?? "50% 30%" } as CSSProperties} />}
                <span className="gallery-album-cover-overlay" aria-hidden="true" />
                <span className="gallery-album-cover-copy">
                  <span className="gallery-album-title">{group.title}</span>
                  <span className="gallery-album-description">{group.description}</span>
                  <span className="gallery-album-count">{photos.length} {photos.length === 1 ? "photo" : "photos"}</span>
                </span>
                <span className="gallery-album-action">{expanded ? "Hide photos" : "View photos"}<ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} /></span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {expanded && <motion.div id={panelId} role="region" aria-labelledby={buttonId} className="gallery-album-panel" initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduced ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .5, ease }}>
                <div className="gallery-album-grid">
                  {photos.slice(0, count).map((image, index) => <motion.button key={image.id} type="button" onClick={() => setSelected(index)} aria-label={`Open photo ${index + 1} from ${group.title}`} className="gallery-thumb group" style={{ aspectRatio: String(image.aspect) }} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .35, delay: reduced ? 0 : Math.min(index * .025, .25), ease }}>
                    <ResponsiveImage image={image} alt={image.alt} fit="fill" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="gallery-album-thumb-image transition-transform duration-700 group-hover:scale-[1.035]" />
                  </motion.button>)}
                </div>
                {count < photos.length && <div ref={sentinel} className="gallery-album-sentinel" aria-hidden="true" />}
              </motion.div>}
            </AnimatePresence>
          </article>;
        })}
      </div>
    </section>

    <AnimatePresence>
      {selected !== null && openGroup && openImages[selected] && <motion.div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${openGroup.title} photo viewer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; if (start !== null && end !== undefined && Math.abs(end - start) > 48) moveLightbox(end < start ? 1 : -1); touchStartX.current = null; }}>
        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close photo viewer"><X /></button>
        <button className="lightbox-arrow lightbox-left" onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }} aria-label="Previous photo"><ArrowLeft /></button>
        <ResponsiveImage key={openImages[selected].id} image={openImages[selected]} resolution="full" sizes="100vw" alt={openImages[selected].alt} className="lightbox-image" onClick={(event) => event.stopPropagation()} />
        <button className="lightbox-arrow lightbox-right" onClick={(event) => { event.stopPropagation(); moveLightbox(1); }} aria-label="Next photo"><ArrowRight /></button>
        <p className="lightbox-caption">{openGroup.title} · {selected + 1} / {openImages.length}{openImages[selected].caption ? ` · ${openImages[selected].caption}` : ""}</p>
      </motion.div>}
    </AnimatePresence>
    <GalleryCoverDebug />
  </>;
};
export default GalleryPage;
