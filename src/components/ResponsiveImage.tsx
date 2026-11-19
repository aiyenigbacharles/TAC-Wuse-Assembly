import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { GalleryImage } from "@/data/gallery";

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "loading"> {
  image: GalleryImage;
  sizes?: string;
  priority?: boolean;
  resolution?: "thumbnail" | "full";
  pictureClassName?: string;
}

const responsiveSet = (values: Record<string, string>, resolution: "thumbnail" | "full") => Object.entries(values)
  .map(([width, src]) => [Number(width), src] as const)
  .filter(([width]) => resolution === "full" ? width >= 960 : width <= 640)
  .sort(([a], [b]) => a - b)
  .map(([width, src]) => `${src} ${width}w`)
  .join(", ");

const fallback = (values: Record<string, string>, resolution: "thumbnail" | "full") => {
  const entries = Object.entries(values).map(([width, src]) => [Number(width), src] as const).sort(([a], [b]) => a - b);
  const filtered = entries.filter(([width]) => resolution === "full" ? width >= 960 : width <= 640);
  const selected = filtered.length ? filtered : entries;
  return selected[selected.length - 1]?.[1] ?? "";
};

export default function ResponsiveImage({ image, sizes = "100vw", priority = false, resolution = "thumbnail", pictureClassName, className, alt, onLoad, onError, ...props }: ResponsiveImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setLoaded(true); }, [image.id, resolution]);
  const imageStyle: CSSProperties = { opacity: loaded ? 1 : 0, transition: "opacity .4s ease", ...props.style };
  const pictureStyle: CSSProperties = { display: "block", backgroundColor: image.color, backgroundImage: `url("${image.blur}")`, backgroundPosition: "center", backgroundSize: "cover" };
  return <picture className={pictureClassName} style={pictureStyle}>
    <source type="image/avif" srcSet={responsiveSet(image.variants.avif, resolution)} sizes={sizes} />
    <source type="image/webp" srcSet={responsiveSet(image.variants.webp, resolution)} sizes={sizes} />
    <img
      {...props}
      ref={imageRef}
      src={fallback(image.variants.webp, resolution)}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : "auto"}
      className={className}
      style={imageStyle}
      onLoad={(event) => { setLoaded(true); onLoad?.(event); }}
      onError={(event) => { setLoaded(true); onError?.(event); }}
    />
  </picture>;
}
