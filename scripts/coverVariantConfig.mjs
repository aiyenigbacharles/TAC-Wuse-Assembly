export const coverSizes = [960, 1280, 1600, 1920, 2560];
export const coverEncodeSettings = {
  avif: { quality: 72, effort: 6, chromaSubsampling: "4:4:4" },
  webp: { quality: 90, smartSubsample: true, effort: 5 },
  jpeg: { quality: 88, mozjpeg: true },
};

export function coverWidthsForSource(sourceWidth) {
  return [...new Set([...coverSizes.filter((size) => size <= sourceWidth), sourceWidth])].sort((a, b) => a - b);
}

export function coverFallbackWidth(sourceWidth) {
  return Math.min(1600, sourceWidth);
}
