import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { coverEncodeSettings, coverFallbackWidth, coverSizes, coverWidthsForSource } from "../../scripts/coverVariantConfig.mjs";
import groups from "../data/gallery.groups.json";

describe("album cover variant configuration", () => {
  it("emits only configured widths at or below source size, plus the exact source width", () => {
    expect(coverSizes).toEqual([960, 1280, 1600, 1920, 2560]);
    expect(coverWidthsForSource(206)).toEqual([206]);
    expect(coverWidthsForSource(1279)).toEqual([960, 1279]);
    expect(coverWidthsForSource(2560)).toEqual(coverSizes);
  });

  it("keeps the JPEG fallback at 1600px or below source width", () => {
    expect(coverFallbackWidth(206)).toBe(206);
    expect(coverFallbackWidth(1920)).toBe(1600);
    for (const group of groups) {
      expect(group.coverImage?.variants.jpeg).toBeTruthy();
      expect(existsSync(resolve(process.cwd(), "public", group.coverImage!.variants.jpeg!.slice(1)))).toBe(true);
    }
  });

  it("uses the requested high quality cover encoders", () => {
    expect(coverEncodeSettings).toEqual({
      avif: { quality: 72, effort: 6, chromaSubsampling: "4:4:4" },
      webp: { quality: 90, smartSubsample: true, effort: 5 },
      jpeg: { quality: 88, mozjpeg: true },
    });
  });
});
