import { describe, expect, it } from "vitest";
import { validateGallerySlots, type GallerySlot } from "@/lib/gallerySlots";

const field = { left: 0, top: 0, right: 1000, bottom: 700, width: 1000, height: 700 };

describe("gallery field slot validation", () => {
  it("rejects slots whose rotated and drift-padded bounds hit the text safe area", () => {
    const slots: GallerySlot[] = [
      { id: "safe", x: 1, y: 5, w: 12, ratio: .7, rot: 4 },
      { id: "unsafe", x: 42, y: 45, w: 16, ratio: .8, rot: 8 },
    ];
    const text = { left: 400, top: 300, right: 600, bottom: 360, width: 200, height: 60 };
    expect(validateGallerySlots(slots, field, text, null).map((slot) => slot.id)).toEqual(["safe"]);
  });
});
