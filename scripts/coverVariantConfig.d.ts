export const coverSizes: number[];
export const coverEncodeSettings: {
  avif: { quality: number; effort: number; chromaSubsampling: string };
  webp: { quality: number; smartSubsample: boolean; effort: number };
  jpeg: { quality: number; mozjpeg: boolean };
};
export function coverWidthsForSource(sourceWidth: number): number[];
export function coverFallbackWidth(sourceWidth: number): number;
