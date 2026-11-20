import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GalleryImage } from "@/data/gallery";
import ResponsiveImage from "@/components/ResponsiveImage";
import { validateGallerySlots, type GallerySlot } from "@/lib/gallerySlots";
import { gallerySlotMap } from "@/lib/gallerySlotMaps";

const desktop: GallerySlot[] = [
  { id: "L1", x: -2, y: 15, w: 13, ratio: 1.12, rot: -3 }, { id: "L2", x: 14, y: 34, w: 12, ratio: .78, rot: 3 },
  { id: "L3", x: -2, y: 57, w: 12, ratio: .92, rot: -5 }, { id: "L4", x: 13, y: 76, w: 12, ratio: 1.08, rot: 4 },
  { id: "R1", x: 89, y: 15, w: 13, ratio: 1.12, rot: 3 }, { id: "R2", x: 74, y: 34, w: 12, ratio: .78, rot: -3 },
  { id: "R3", x: 90, y: 57, w: 12, ratio: .92, rot: -4 }, { id: "R4", x: 75, y: 76, w: 12, ratio: 1.08, rot: 4 },
];
const mobileHero: GallerySlot[] = [
  { id: "M1", x: -7, y: 12, w: 34, ratio: .72, rot: -5 }, { id: "M2", x: 72, y: 17, w: 34, ratio: .78, rot: 4 },
  { id: "M3", x: 34, y: 25, w: 31, ratio: .78, rot: -3 }, { id: "M4", x: -8, y: 34, w: 34, ratio: .72, rot: 4 },
  { id: "M5", x: 76, y: 40, w: 32, ratio: .78, rot: -5 }, { id: "M6", x: 31, y: 45, w: 34, ratio: .72, rot: 3 },
  { id: "M7", x: -7, y: 54, w: 32, ratio: .78, rot: -4 }, { id: "M8", x: 73, y: 61, w: 34, ratio: .72, rot: 5 },
  { id: "M9", x: 34, y: 65, w: 31, ratio: .78, rot: -3 }, { id: "M10", x: -6, y: 74, w: 34, ratio: .72, rot: 4 },
  { id: "M11", x: 74, y: 80, w: 33, ratio: .78, rot: -4 }, { id: "M12", x: 34, y: 86, w: 31, ratio: .78, rot: 3 },
];

interface SlotMap { desktop: GallerySlot[]; tablet: GallerySlot[]; mobile: GallerySlot[] }
interface FieldProps {
  images: GalleryImage[];
  slots: GallerySlot[] | SlotMap;
  exclusionRef?: RefObject<HTMLElement>;
  className?: string;
  debug?: boolean;
  rotatePhotos?: boolean;
}
interface FloatingImagesProps { images: GalleryImage[]; variant?: "hero" | "field" | "compact"; exclusionRef?: RefObject<HTMLElement> }

const seed = (value: string) => [...value].reduce((result, char) => Math.imul(result ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
const uniquePhotos = (images: GalleryImage[]) => {
  const seen = new Set<string>();
  return images.filter((image) => { const key = image.sourceHash || image.id; if (seen.has(key)) return false; seen.add(key); return true; })
    .sort((a, b) => seed(a.id) - seed(b.id));
};
const assignPhotos = (slots: GallerySlot[], photos: GalleryImage[]) => {
  const pool = [...photos];
  return Object.fromEntries(slots.map((slot) => {
    const targetAspect = 1 / slot.ratio;
    pool.sort((a, b) => (Math.abs(a.aspect - targetAspect) - Number(Boolean(a.featured)) * .12) - (Math.abs(b.aspect - targetAspect) - Number(Boolean(b.featured)) * .12));
    return [slot.id, pool.shift()];
  }).filter((entry): entry is [string, GalleryImage] => Boolean(entry[1])));
};
const desiredCount = (width: number) => width < 640 ? 8 : width < 1024 ? 12 : 16;
const responsiveSlots = (slots: GallerySlot[] | SlotMap, width: number) => Array.isArray(slots) ? slots : width < 640 ? slots.mobile : width < 1024 ? slots.tablet : slots.desktop;

export function FloatingField({ images, slots, exclusionRef, className = "", debug = false, rotatePhotos = true }: FieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(() => typeof window === "undefined" ? 1280 : window.innerWidth);
  const [safeSlots, setSafeSlots] = useState<GallerySlot[]>([]);
  const [rotatedPhotos, setRotatedPhotos] = useState<Record<string, GalleryImage>>({});
  const [isVisible, setIsVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || document.visibilityState === "visible");
  const [saveData, setSaveData] = useState(false);
  const [textGuide, setTextGuide] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const activeSlots = useMemo(() => responsiveSlots(slots, width), [slots, width]);
  const photoPool = useMemo(() => uniquePhotos(images), [images]);
  const expected = saveData ? Math.min(Array.isArray(slots) ? slots.length : desiredCount(width), 6) : (Array.isArray(slots) ? slots.length : desiredCount(width));
  const currentSlots = useMemo(() => safeSlots.slice(0, expected), [safeSlots, expected]);
  const initialAssignment = useMemo(() => assignPhotos(currentSlots, photoPool), [currentSlots, photoPool]);
  const currentPhotos = currentSlots.map((slot) => rotatedPhotos[slot.id] ?? initialAssignment[slot.id]).filter((image): image is GalleryImage => Boolean(image));
  const currentHash = currentPhotos.map((image) => image.sourceHash).join("|");

  const recalculate = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const field = root.getBoundingClientRect();
    const text = exclusionRef?.current?.getBoundingClientRect();
    const header = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect();
    const headerBand = header && header.bottom > 0 && header.top < innerHeight
      ? { left: 0, top: Math.max(0, header.top), right: innerWidth, bottom: header.bottom, width: innerWidth, height: header.bottom - Math.max(0, header.top) }
      : null;
    const candidates = validateGallerySlots(activeSlots, field, text ?? null, headerBand, 34);
    const limit = expected;
    setSafeSlots((previous) => previous.map((slot) => slot.id).join() === candidates.slice(0, limit).map((slot) => slot.id).join() ? previous : candidates.slice(0, limit));
    setTextGuide(text ? { left: text.left - field.left - 34, top: text.top - field.top - 34, width: text.width + 68, height: text.height + 68 } : null);
    if (import.meta.env.DEV && candidates.length < limit) console.warn(`[FloatingField] ${candidates.length}/${limit} slots are clear of text and header.`);
  }, [activeSlots, exclusionRef, expected]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    setSaveData(Boolean(connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "")));
  }, []);
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    recalculate();
    const resize = new ResizeObserver(recalculate);
    resize.observe(node);
    if (exclusionRef?.current) resize.observe(exclusionRef.current);
    window.addEventListener("resize", recalculate);
    window.addEventListener("scroll", recalculate, { passive: true });
    return () => { resize.disconnect(); window.removeEventListener("resize", recalculate); window.removeEventListener("scroll", recalculate); };
  }, [recalculate, exclusionRef]);
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    observer.observe(node);
    const visibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { setRotatedPhotos({}); }, [images]);

  const running = !reduced && !saveData && isVisible && tabVisible;
  useEffect(() => {
    if (!rotatePhotos || !running || photoPool.length <= currentSlots.length || currentSlots.length === 0) return;
    let nextSlot = 0;
    const timer = window.setInterval(() => {
      const slot = currentSlots[nextSlot++ % currentSlots.length];
      const activeHashes = new Set(currentPhotos.map((image) => image.sourceHash));
      const next = photoPool.find((image) => !activeHashes.has(image.sourceHash));
      if (!next) return;
      const source = next.variants.webp["640"] ?? next.variants.webp["480"] ?? "";
      const preload = new window.Image();
      preload.onload = () => setRotatedPhotos((previous) => ({ ...previous, [slot.id]: next }));
      preload.src = source;
    }, 7000);
    return () => window.clearInterval(timer);
  }, [rotatePhotos, running, photoPool, currentSlots, currentHash, currentPhotos]);

  useEffect(() => {
    if (!debug || !new URLSearchParams(location.search).has("debug")) return;
    const totals = { samples: 0, textOrHeader: 0, overlap: 0, outside: 0, count: 0, horizontalScroll: 0 };
    const sample = () => {
      const root = rootRef.current;
      if (!root) return;
      const cards = [...root.querySelectorAll<HTMLElement>(".floating-card")];
      const rects = cards.map((card) => card.getBoundingClientRect());
      const text = exclusionRef?.current?.getBoundingClientRect();
      const headerBottom = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const overlapArea = (a: DOMRect, b: DOMRect) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      totals.samples++;
      if (rects.some((r) => (text && r.left < text.right + 34 && r.right > text.left - 34 && r.top < text.bottom + 34 && r.bottom > text.top - 34) || r.top < headerBottom)) totals.textOrHeader++;
      if (rects.some((r, i) => rects.slice(i + 1).some((next, j) => overlapArea(r, next) > Math.min(r.width * r.height, next.width * next.height) * .15 && cards[i].dataset.slot !== cards[i + j + 1]?.dataset.slot))) totals.overlap++;
      if (rects.some((r) => { const inside = Math.max(0, Math.min(r.right, innerWidth) - Math.max(0, r.left)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(0, r.top)); return r.width * r.height - inside > r.width * r.height * .2; })) totals.outside++;
      if (cards.length < expected) totals.count++;
      if (document.documentElement.scrollWidth > innerWidth) totals.horizontalScroll++;
    };
    const interval = window.setInterval(sample, 250);
    const stop = window.setTimeout(() => { window.clearInterval(interval); console.info(`[floating field debug] ${innerWidth}x${innerHeight}`, totals, Object.values(totals).slice(1).every((value) => value === 0) ? "PASS" : "CHECK FAILURES"); }, 12000);
    return () => { window.clearInterval(interval); window.clearTimeout(stop); };
  }, [debug, expected, exclusionRef, currentSlots]);

  return <div ref={rootRef} className={`floating-images floating-field ${className}`} aria-hidden="true" data-card-count={currentSlots.length}>
    {debug && new URLSearchParams(location.search).has("debug") && <>
      <div className="floating-debug-field" />
      {textGuide && <div className="floating-debug-text-band" style={textGuide} />}
      <div className="floating-debug-count">{currentSlots.length} cards · text-safe slots</div>
    </>}
    {currentSlots.map((slot, index) => {
      const image = rotatedPhotos[slot.id] ?? initialAssignment[slot.id];
      if (!image) return null;
      return <motion.div key={slot.id} className="floating-card" data-slot={slot.id}
        style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, aspectRatio: `1 / ${slot.ratio}` }}
        initial={reduced ? false : { opacity: 0, scale: .94, y: 8 }}
        animate={!running ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: slot.rot } : { opacity: 1, scale: 1, x: [0, index % 2 ? -8 : 8, 0], y: [0, -12 - index % 4 * 2, 0], rotate: [slot.rot, slot.rot + (index % 2 ? -1.4 : 1.4), slot.rot] }}
        transition={reduced ? { duration: 0 } : { opacity: { duration: .5, delay: index * .08 }, scale: { duration: .6, delay: index * .08 }, default: { duration: 9 + index % 5 * 1.4, repeat: Infinity, ease: "easeInOut", delay: -index * 1.2 } }}>
        <div className="floating-card-drift">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={image.id} className="floating-card-image-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}>
              <ResponsiveImage image={image} priority={index < 3} sizes="(max-width: 640px) 36vw, (max-width: 1024px) 20vw, 17vw" fit="fill" className="floating-card-image" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>;
    })}
  </div>;
}

export default function FloatingImages({ images, variant = "hero", exclusionRef }: FloatingImagesProps) {
  const desktopSlots = variant === "field" ? gallerySlotMap : desktop;
  return <>
    <FloatingField images={images} slots={desktopSlots} exclusionRef={exclusionRef} className={`floating-desktop floating-${variant}`} debug />
    {variant === "hero" && <FloatingField images={images} slots={mobileHero} className="floating-mobile floating-mobile-scatter" debug />}
  </>;
}
