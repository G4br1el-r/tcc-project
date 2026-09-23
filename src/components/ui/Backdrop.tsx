import Image from "next/image";
import type { Photo } from "@/content/media";

const FULL_BLEED_SIZES = "100vw";

type BackdropProps = {
  photo: Photo;
  eager?: boolean;
  decorative?: boolean;
};

export function Backdrop({
  photo,
  eager = false,
  decorative = false,
}: BackdropProps) {
  return (
    <div className="backdrop" aria-hidden={decorative ? "true" : undefined}>
      <div className="backdrop__media" data-backdrop-media>
        <Image
          src={photo.src}
          alt={decorative ? "" : photo.alt}
          fill
          sizes={FULL_BLEED_SIZES}
          {...(eager ? { loading: "eager" } : { fetchPriority: "low" })}
        />
      </div>
    </div>
  );
}
