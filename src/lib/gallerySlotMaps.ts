import type { GallerySlot } from "@/lib/gallerySlots";

export const gallerySlotMap: Record<"desktop" | "tablet" | "mobile", GallerySlot[]> = {
  desktop: [
    ...[1, 26, 51, 76].map((x, i) => ({ id: `GT${i + 1}`, x, y: -4, w: 12, ratio: .72, rot: [-5, 3, -2, 5][i] })),
    ...[14, 39, 64, 88].map((x, i) => ({ id: `GT${i + 5}`, x, y: 6, w: 12, ratio: .72, rot: [4, -4, 5, -3][i] })),
    ...[1, 26, 51, 76].map((x, i) => ({ id: `GB${i + 1}`, x, y: 70, w: 12, ratio: .72, rot: [4, -4, 3, -5][i] })),
    ...[14, 39, 64, 88].map((x, i) => ({ id: `GB${i + 5}`, x, y: 89, w: 12, ratio: .72, rot: [-3, 5, -4, 4][i] })),
  ],
  tablet: [
    ...[3, 42, 81].map((x, i) => ({ id: `GT${i + 1}`, x, y: 2, w: 16, ratio: .68, rot: [-5, 3, 5][i] })),
    ...[3, 42, 81].map((x, i) => ({ id: `GT${i + 4}`, x, y: 16, w: 16, ratio: .68, rot: [4, -4, 3][i] })),
    ...[3, 42, 81].map((x, i) => ({ id: `GB${i + 1}`, x, y: 69, w: 16, ratio: .68, rot: [4, -4, 5][i] })),
    ...[3, 42, 81].map((x, i) => ({ id: `GB${i + 4}`, x, y: 84, w: 16, ratio: .68, rot: [-3, 5, -4][i] })),
  ],
  mobile: [
    ...[0, 25, 50, 75].map((x, i) => ({ id: `GT${i + 1}`, x, y: 3, w: 23, ratio: .62, rot: [-5, 3, -4, 5][i] })),
    ...[0, 25, 50, 75].map((x, i) => ({ id: `GB${i + 1}`, x, y: 76, w: 23, ratio: .62, rot: [4, -3, 5, -4][i] })),
  ],
};
