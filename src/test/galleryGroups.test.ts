import { describe, expect, it } from "vitest";
import groupConfig from "@/assets/gallery-source/groups.json";
import galleryManifest from "@/data/gallery.manifest.json";
import { resolveGroupForImage, resolveGroupMetadata } from "@/lib/galleryGroupUtils.js";

const validGroups = groupConfig.groups.map((group) => group.id);

describe("gallery group resolution", () => {
  it("keeps the four albums in the requested order", () => {
    expect(validGroups).toEqual(["choir-sessions", "prayer-sessions", "seminars", "media"]);
  });

  it("prefers assignments and captions over folder defaults", () => {
    expect(resolveGroupForImage({ id: "gallery-1", relativePath: "choir-sessions/gallery-1.jpg", folderGroup: "choir-sessions", captionGroup: "prayer-sessions", assignments: { "gallery-1": "choir-sessions" }, validGroups })).toBe("choir-sessions");
    expect(resolveGroupForImage({ id: "gallery-2", relativePath: "prayer-sessions/gallery-2.jpg", folderGroup: "prayer-sessions", captionGroup: "choir-sessions", validGroups })).toBe("choir-sessions");
    expect(resolveGroupForImage({ id: "gallery-3", relativePath: "choir-sessions/gallery-3.jpg", folderGroup: "choir-sessions", validGroups })).toBe("choir-sessions");
  });

  it("uses an optimized cover and falls back to a featured album photo", () => {
    const fallback = { id: "gallery-2", group: "choir-sessions", featured: true, sourceHash: "two" };
    const result = resolveGroupMetadata([{ id: "choir-sessions", title: "Choir", description: "", coverSource: "choir.jpg" }], [
      { id: "gallery-1", group: "choir-sessions", featured: false, sourceHash: "one" }, fallback,
    ] as never, { "choir-sessions": { id: "cover-choir", width: 1280, height: 720, variants: {} } });
    expect(result.groups[0].coverImage).toMatchObject({ id: "cover-choir", width: 1280 });

    const missing = resolveGroupMetadata([{ id: "choir-sessions", title: "Choir", description: "", coverSource: "missing.jpg" }], [
      { id: "gallery-1", group: "choir-sessions", featured: false, sourceHash: "one" }, fallback,
    ] as never);
    expect(missing.groups[0].coverImage).toEqual(fallback);
  });

  it("keeps every generated gallery photo assigned or explicitly unassigned", () => {
    const images = galleryManifest.filter((image) => image.id.startsWith("gallery-"));
    const { groups, unassigned } = resolveGroupMetadata(groupConfig.groups, images as never);
    expect(groups.map((group) => group.id)).toEqual(validGroups);
    expect(unassigned.map((image) => image.id)).toEqual([]);
    expect(images.every((image) => validGroups.includes(image.group ?? ""))).toBe(true);
  });

  it("returns unresolved photos separately without adding an extra album", () => {
    const result = resolveGroupMetadata(groupConfig.groups, [{ id: "gallery-unplaced", sourceHash: "unplaced" }] as never);
    expect(result.groups.map((group) => group.id)).toEqual(validGroups);
    expect(result.unassigned.map((image) => image.id)).toEqual(["gallery-unplaced"]);
  });
});
