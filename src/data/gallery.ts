import manifest from "./site.manifest.json";

export interface GalleryImage {
  id: string;
  width: number;
  height: number;
  aspect: number;
  blur: string;
  color: string;
  variants: { avif: Record<string, string>; webp: Record<string, string> };
  featured?: boolean;
  alt: string;
  caption?: string;
  sourceHash: string;
}

export const galleryImages = manifest as GalleryImage[];
const galleryById = new Map(galleryImages.map((image) => [image.id, image]));
export const getGalleryImage = (id: string): GalleryImage => {
  const image = galleryById.get(id);
  if (!image) throw new Error(`Gallery image "${id}" is missing from the generated manifest.`);
  return image;
};
export const heroGalleryImages = [...galleryImages].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
let allImagesPromise: Promise<GalleryImage[]> | undefined;
export const loadGalleryImages = () => {
  allImagesPromise ??= fetch("/gallery/gallery.manifest.json")
    .then((response) => { if (!response.ok) throw new Error("Could not load the gallery catalog."); return response.json() as Promise<GalleryImage[]>; });
  return allImagesPromise;
};
