import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryImage } from "@/data/gallery";
import ResponsiveImage from "@/components/ResponsiveImage";

type Slot = { id: string; x: number; y: number; w: number; ratio: number; rot: number };
const desktop: Slot[] = [
  { id: "L1", x: -2, y: 15, w: 13, ratio: 1.12, rot: -3 }, { id: "L2", x: 14, y: 34, w: 12, ratio: .78, rot: 3 },
  { id: "L3", x: -2, y: 57, w: 12, ratio: .92, rot: -5 }, { id: "L4", x: 13, y: 76, w: 12, ratio: 1.08, rot: 4 },
  { id: "R1", x: 89, y: 15, w: 13, ratio: 1.12, rot: 3 }, { id: "R2", x: 74, y: 34, w: 12, ratio: .78, rot: -3 },
  { id: "R3", x: 90, y: 57, w: 12, ratio: .92, rot: -4 }, { id: "R4", x: 75, y: 76, w: 12, ratio: 1.08, rot: 4 },
];
const tablet: Slot[] = [
  { id: "L1", x: -2, y: 16, w: 16, ratio: 1.05, rot: -3 }, { id: "L2", x: 5, y: 46, w: 15, ratio: .8, rot: 3 }, { id: "L3", x: -2, y: 74, w: 15, ratio: 1, rot: -4 },
  { id: "R1", x: 86, y: 16, w: 16, ratio: 1.05, rot: 3 }, { id: "R2", x: 80, y: 46, w: 15, ratio: .8, rot: -3 }, { id: "R3", x: 87, y: 74, w: 15, ratio: 1, rot: 4 },
];
const mobileTop: Slot[] = [
  { id: "T1", x: -5, y: 8, w: 34, ratio: .72, rot: -5 }, { id: "T2", x: 33, y: 20, w: 30, ratio: .72, rot: 3 }, { id: "T3", x: 71, y: 8, w: 34, ratio: .72, rot: -3 },
];
const mobileBottom: Slot[] = mobileTop.map((s) => ({ ...s, id: s.id.replace("T", "B"), y: 8 }));

interface Props { images: GalleryImage[]; variant?: "hero" | "field" | "compact"; exclusionRef?: React.RefObject<HTMLElement>; slots?: Slot[]; }

export function FloatingField({ images, slots = desktop, className = "", debug = false }: { images: GalleryImage[]; slots?: Slot[]; className?: string; debug?: boolean }) {
  const reduced = useReducedMotion();
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>();
    return [...images].filter((image) => { const key = image.sourceHash || image.id; if (seen.has(key)) return false; seen.add(key); return true; });
  }, [images]);
  const cards = slots.slice(0, uniqueImages.length);
  useEffect(() => {
    if (!debug || !className.includes("floating-desktop") || !new URLSearchParams(location.search).has("debug")) return;
    document.documentElement.classList.add("floating-debug-mode");
    const totals = { samples: 0, textHeader: 0, pairwise: 0, outside: 0, count: 0, horizontalScroll: 0 };
    const sample = () => {
      const els = [...document.querySelectorAll<HTMLElement>(".floating-card")].filter((el) => el.getBoundingClientRect().width > 0);
      const headerBottom = Math.max(96, document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 96);
      const copy = document.querySelector(".hero-copy")?.getBoundingClientRect();
      const rects = els.map((el) => el.getBoundingClientRect());
      const intersects = (a: DOMRect, b: DOMRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      totals.samples++;
      if (rects.some((r) => r.top < headerBottom || (copy && intersects(r, copy)))) totals.textHeader++;
      if (rects.some((r, i) => rects.slice(i + 1).some((b) => { const area = Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left)) * Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top)); return area > Math.min(r.width * r.height, b.width * b.height) * .15; }))) totals.pairwise++;
      if (rects.some((r) => { const inside = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)); return r.width * r.height - inside > r.width * r.height * .2; })) totals.outside++;
      const expected = innerWidth < 640 ? 5 : innerWidth < 1024 ? 6 : 8;
      if (els.length < expected) totals.count++;
      if (document.documentElement.scrollWidth > innerWidth) totals.horizontalScroll++;
    };
    sample(); const id = window.setInterval(sample, 250); const stop = window.setTimeout(() => { window.clearInterval(id); console.info(`[floating debug] ${innerWidth}x${innerHeight}`, totals, totals.textHeader + totals.pairwise + totals.outside + totals.count + totals.horizontalScroll === 0 ? "PASS" : "CHECK FAILURES"); }, 12000);
    return () => { window.clearInterval(id); window.clearTimeout(stop); document.documentElement.classList.remove("floating-debug-mode"); };
  }, [debug, className]);
  return <div className={`floating-images ${className}`} aria-hidden="true" data-card-count={cards.length}>
    {cards.map((slot, i) => {
      const image = uniqueImages[i];
      return <motion.div key={`${slot.id}-${image.id}`} className="floating-card" data-slot={slot.id}
        style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, aspectRatio: `1 / ${slot.ratio}`, zIndex: i % 2 }}
        initial={reduced ? false : { opacity: 0, scale: .94, y: 8 }} animate={reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -11, 0], x: [0, 7, 0], rotate: [slot.rot, slot.rot + 1.2, slot.rot] }}
        transition={reduced ? { duration: 0 } : { opacity: { duration: .5, delay: i * .08 }, scale: { duration: .6, delay: i * .08 }, default: { duration: 9 + (i % 5) * 1.3, repeat: Infinity, ease: "easeInOut", delay: -i * 1.7 } }}>
        <div className="floating-card-drift" style={{ transform: `rotate(${slot.rot}deg)` }}><ResponsiveImage image={image} priority={i < 3} sizes="(max-width: 640px) 36vw, (max-width: 1024px) 20vw, 17vw" className="floating-card-image" /></div>
      </motion.div>;
    })}
    {debug && new URLSearchParams(location.search).has("debug") && <div className="floating-debug-count">{cards.length} cards · fields are responsive</div>}
  </div>;
}

export default function FloatingImages({ images, variant = "hero" }: Props) {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => { setSaveData(Boolean((navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection?.saveData)); }, []);
  const slots = variant === "field" ? tablet : desktop;
  return <>
    <FloatingField images={images.slice(0, saveData ? 4 : images.length)} slots={slots} className={`floating-desktop floating-${variant}`} debug />
    {variant === "hero" && <>
      <FloatingField images={images.slice(0, saveData ? 2 : 3)} slots={mobileTop} className="floating-mobile floating-mobile-top" debug />
      <FloatingField images={images.slice(3, saveData ? 5 : 6)} slots={mobileBottom} className="floating-mobile floating-mobile-bottom" debug />
    </>}
  </>;
}
