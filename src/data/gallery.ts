import manifest from "./site.manifest.json";
import groupManifest from "./gallery.groups.json";

export interface GalleryImage {
  id: string;
  width: number;
  height: number;
  aspect: number;
  blur: string;
  color: string;
  variants: { avif: Record<string, string>; webp: Record<string, string>; jpeg?: string };
  featured?: boolean;
  alt: string;
  caption?: string;
  group?: string;
  sourceHash: string;
}

export interface GalleryGroup {
  id: string;
  title: string;
  description: string;
  count: number;
  coverImage: GalleryImage | null;
  coverPosition?: string;
  coverPositionMobile?: string;
}

export const galleryImages = manifest as GalleryImage[];
export const galleryGroups = groupManifest as GalleryGroup[];
const galleryById = new Map(galleryImages.map((image) => [image.id, image]));
export const getGalleryImage = (id: string): GalleryImage => {
  const image = galleryById.get(id);
  if (!image) throw new Error(`Gallery image "${id}" is missing from the generated manifest.`);
  return image;
};
const uniqueByHash = (items: GalleryImage[]) => {
  const hashes = new Set<string>();
  return items.filter((image) => { if (hashes.has(image.sourceHash)) return false; hashes.add(image.sourceHash); return true; });
};
export const getGroupImages = (groupId: string, images: GalleryImage[] = galleryImages) => uniqueByHash(images.filter((image) => image.id.startsWith("gallery-") && image.group === groupId));
export const getGroupCover = (groupId: string, images: GalleryImage[] = galleryImages) => {
  const group = galleryGroups.find((item) => item.id === groupId);
  if (!group) return undefined;
  return group.coverImage ?? images.find((image) => image.group === groupId && image.featured) ?? images.find((image) => image.group === groupId);
};
export const heroGalleryImages = [...galleryImages].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
let allImagesPromise: Promise<GalleryImage[]> | undefined;
export const loadGalleryImages = () => {
  allImagesPromise ??= fetch("/gallery/gallery.manifest.json")
    .then((response) => { if (!response.ok) throw new Error("Could not load the gallery catalog."); return response.json() as Promise<GalleryImage[]>; });
  return allImagesPromise;
};
