import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { GalleryImage } from "@/data/gallery";

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "loading"> {
  image: GalleryImage;
  sizes?: string;
  priority?: boolean;
  resolution?: "thumbnail" | "full" | "cover";
  pictureClassName?: string;
  frameClassName?: string;
  fit?: "intrinsic" | "fill";
  placeholder?: "blur" | "color" | "none";
}

const responsiveSet = (values: Record<string, string>, resolution: "thumbnail" | "full" | "cover") => Object.entries(values)
  .map(([width, src]) => [Number(width), src] as const)
  .filter(([width]) => resolution === "cover" ? true : resolution === "full" ? width >= 960 : width <= 640)
  .sort(([a], [b]) => a - b)
  .map(([width, src]) => `${src} ${width}w`)
  .join(", ");

const fallback = (values: Record<string, string>, resolution: "thumbnail" | "full" | "cover") => {
  const entries = Object.entries(values).map(([width, src]) => [Number(width), src] as const).sort(([a], [b]) => a - b);
  const filtered = entries.filter(([width]) => resolution === "cover" ? true : resolution === "full" ? width >= 960 : width <= 640);
  const selected = filtered.length ? filtered : entries;
  return selected[selected.length - 1]?.[1] ?? "";
};

export default function ResponsiveImage({ image, sizes = "100vw", priority = false, resolution = "thumbnail", pictureClassName, frameClassName, fit = "intrinsic", placeholder = "blur", className, alt, onLoad, onError, ...props }: ResponsiveImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  useEffect(() => { setStatus("loading"); if (imageRef.current?.complete) setStatus(imageRef.current.naturalWidth > 0 ? "loaded" : "error"); }, [image.id, resolution]);
  const frameStyle: CSSProperties = fit === "fill"
    ? { display: "block", width: "100%", height: "100%", overflow: "hidden" }
    : { display: "inline-block", maxWidth: "100%", verticalAlign: "middle" };
  const imageStyle: CSSProperties = { opacity: status === "loaded" ? 1 : 0, transition: "opacity .3s ease", imageRendering: "auto", ...(fit === "fill" ? { display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" } : {}), ...props.style };
  const pictureStyle: CSSProperties = { display: "block", ...(fit === "fill" ? { width: "100%", height: "100%", overflow: "hidden" } : {}) };
  const placeholderStyle: CSSProperties = { position: "absolute", inset: 0, zIndex: 0, backgroundColor: image.color, ...(placeholder === "blur" ? { backgroundImage: `url("${image.blur}")`, backgroundPosition: "center", backgroundSize: "cover" } : {}) };
  return <span className={`responsive-image-frame${frameClassName ? ` ${frameClassName}` : ""}`} style={frameStyle}>
    {placeholder !== "none" && status !== "loaded" && <span className="responsive-image-placeholder" aria-hidden="true" style={placeholderStyle} />}
    <picture className={`responsive-image-picture${pictureClassName ? ` ${pictureClassName}` : ""}`} style={pictureStyle}>
    <source type="image/avif" srcSet={responsiveSet(image.variants.avif, resolution)} sizes={sizes} />
    <source type="image/webp" srcSet={responsiveSet(image.variants.webp, resolution)} sizes={sizes} />
    <img
      {...props}
      ref={imageRef}
      src={resolution === "cover" ? image.variants.jpeg ?? fallback(image.variants.webp, resolution) : fallback(image.variants.webp, resolution)}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : "auto"}
      className={className}
      style={imageStyle}
      onLoad={(event) => { setStatus("loaded"); onLoad?.(event); }}
      onError={(event) => { setStatus("error"); onError?.(event); }}
    />
    </picture>
  </span>;
}
