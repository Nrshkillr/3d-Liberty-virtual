import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductArtwork } from "@/components/ProductArtwork";
import { StockBadge } from "@/components/StockBadge";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const href = `/products/${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-line bg-shell transition duration-300 hover:-translate-y-1 hover:border-sand-deep hover:shadow-card">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-sand"
        aria-label={`View ${product.name}`}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <ProductArtwork
            categorySlug={product.category?.slug}
            categoryName={product.category?.name}
            name={product.name}
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="rounded-full border border-white/30 bg-navy/85 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">
              Featured
            </span>
          )}
        </div>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-shell/90 text-navy opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ember-dark">
          {product.category?.name ?? "Liberty Collection"}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug text-navy">
          <Link href={href} className="hover:text-ember-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.68rem] font-medium tracking-wide text-stone">
          Model {product.model_number || "—"}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-[0.78rem] font-bold text-navy">
            {product.price !== null
              ? formatPrice(product.price)
              : "Price on enquiry"}
          </p>
          <StockBadge status={product.stock_status} />
        </div>
      </div>
    </article>
  );
}
