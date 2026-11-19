import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "@/components/FontAwesomeIcons";
import PageHeader from "@/components/PageHeader";
import FloatingImages from "@/components/FloatingImages";
import { Reveal } from "@/components/motion";
import ResponsiveImage from "@/components/ResponsiveImage";
import { galleryImages as initialGalleryImages, loadGalleryImages } from "@/data/gallery";

const PAGE_SIZE = 24;
const uniqueGalleryPhotos = (items: typeof initialGalleryImages) => {
  const seen = new Set<string>();
  return items.filter((image) => {
    if (!image.id.startsWith("gallery-") || seen.has(image.sourceHash)) return false;
    seen.add(image.sourceHash); return true;
  });
};
const GalleryPage = () => {
  const [images, setImages] = useState(() => uniqueGalleryPhotos(initialGalleryImages).slice(0, PAGE_SIZE));
  const [selected, setSelected] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinel = useRef<HTMLDivElement>(null);
  const fieldText = useRef<HTMLParagraphElement>(null);
  const touchStartX = useRef<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const move = useCallback((delta: number) => setSelected((current) => current === null ? null : (current + delta + images.length) % images.length), [images.length]);
  useEffect(() => { let mounted = true; loadGalleryImages().then((all) => { if (mounted) setImages(uniqueGalleryPhotos(all)); }).catch((error: unknown) => console.warn("Gallery image catalog could not be loaded.", error)); return () => { mounted = false; }; }, []);
  useEffect(() => {
    const node = sentinel.current;
    if (!node || visibleCount >= images.length) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + PAGE_SIZE, images.length)); }, { rootMargin: "600px" });
    observer.observe(node); return () => observer.disconnect();
  }, [visibleCount, images.length]);
  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [selected, close, move]);
  useEffect(() => {
    if (selected === null) return;
    [selected - 1, selected + 1].forEach((index) => {
      const image = images[(index + images.length) % images.length];
      const preload = new Image(); preload.src = image.variants.webp["1280"] ?? image.variants.webp["960"] ?? "";
    });
  }, [selected, images]);
  return <>
    <PageHeader label="Gallery" title="Moments from our gatherings."><p>Photos from our services and events.</p></PageHeader>
    <section className="gallery-field relative mb-16 overflow-hidden bg-primary" aria-label="Floating moments from our gallery">
      <FloatingImages images={images} variant="field" exclusionRef={fieldText} />
      <div className="pointer-events-none relative z-20 flex min-h-[80svh] items-center justify-center"><p ref={fieldText} className="rounded-full bg-primary/65 px-6 py-3 text-sm font-semibold uppercase tracking-[.1em] text-primary-foreground backdrop-blur-sm">Our community · Our moments</p></div>
    </section>
    <section className="container pb-24" aria-label="Photo gallery">
      <div className="masonry-grid">
        {images.slice(0, visibleCount).map((image, index) => <Reveal key={image.id} delay={(index % 8) * .025}>
          <button type="button" onClick={() => setSelected(index)} aria-label={`Open photo ${index + 1}`} className="gallery-thumb group mb-4 block min-h-11 w-full overflow-hidden rounded-xl bg-card text-left focus-visible:ring-2 focus-visible:ring-ring">
            <ResponsiveImage image={image} alt={image.alt} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]" />
          </button>
        </Reveal>)}
      </div>
      <div ref={sentinel} className="h-2" aria-hidden="true" />
      {selected !== null && <p className="sr-only" aria-live="polite">Showing {selected + 1} of {images.length}</p>}
    </section>
    <AnimatePresence>
      {selected !== null && <motion.div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; if (start !== null && end !== undefined && Math.abs(end - start) > 48) move(end < start ? 1 : -1); touchStartX.current = null; }}>
        <button className="lightbox-close" onClick={close} aria-label="Close photo viewer"><X /></button>
        <button className="lightbox-arrow lightbox-left" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous photo"><ArrowLeft /></button>
        <ResponsiveImage key={images[selected].id} image={images[selected]} resolution="full" sizes="100vw" alt={images[selected].alt} className="lightbox-image" onClick={(event) => event.stopPropagation()} />
        <button className="lightbox-arrow lightbox-right" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next photo"><ArrowRight /></button>
        <p className="lightbox-caption">{selected + 1} / {images.length}{images[selected].caption ? ` · ${images[selected].caption}` : ""}</p>
      </motion.div>}
    </AnimatePresence>
  </>;
};
export default GalleryPage;
