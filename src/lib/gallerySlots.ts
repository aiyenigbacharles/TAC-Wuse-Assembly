export interface GallerySlot { id: string; x: number; y: number; w: number; ratio: number; rot: number }
export interface RectLike { left: number; top: number; right: number; bottom: number; width: number; height: number }

export function rotatedSlotBounds(slot: GallerySlot, field: RectLike, driftX = 32, driftY = 38): RectLike {
  const width = field.width * slot.w / 100;
  const height = width * slot.ratio;
  const angle = Math.abs(slot.rot) * Math.PI / 180;
  const rotatedWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
  const rotatedHeight = Math.abs(height * Math.cos(angle)) + Math.abs(width * Math.sin(angle));
  const left = field.left + field.width * slot.x / 100 - (rotatedWidth - width) / 2 - driftX;
  const top = field.top + field.height * slot.y / 100 - (rotatedHeight - height) / 2 - driftY;
  return { left, top, right: left + rotatedWidth + driftX * 2, bottom: top + rotatedHeight + driftY * 2, width: rotatedWidth + driftX * 2, height: rotatedHeight + driftY * 2 };
}

const intersects = (a: RectLike, b: RectLike) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export function validateGallerySlots(slots: GallerySlot[], field: RectLike, exclusion: RectLike | null, header: RectLike | null, padding = 32): GallerySlot[] {
  const safeText = exclusion ? { left: exclusion.left - padding, top: exclusion.top - padding, right: exclusion.right + padding, bottom: exclusion.bottom + padding, width: exclusion.width + padding * 2, height: exclusion.height + padding * 2 } : null;
  return slots.filter((slot) => {
    const bounds = rotatedSlotBounds(slot, field);
    return !(safeText && intersects(bounds, safeText)) && !(header && intersects(bounds, header));
  });
}
