"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { ProductArtwork } from "@/components/ProductArtwork";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  categorySlug,
  categoryName,
}: {
  images: string[];
  name: string;
  categorySlug?: string | null;
  categoryName?: string | null;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-line bg-sand">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <ProductArtwork
            categorySlug={categorySlug}
            categoryName={categoryName}
            name={name}
          />
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-navy/80 px-3 py-1.5 text-[0.65rem] font-bold text-cream backdrop-blur">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                index === active
                  ? "border-ember"
                  : "border-transparent opacity-65 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-[0.7rem] text-stone">
          <ImageOff className="h-3.5 w-3.5" />
          Product photography will appear here once images are uploaded.
        </p>
      )}
    </div>
  );
}
