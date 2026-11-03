"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, PackageSearch, X } from "lucide-react";
import { ProductArtwork } from "@/components/ProductArtwork";
import { StockBadge } from "@/components/StockBadge";
import { WhatsAppButton } from "@/components/WhatsApp";
import type { Product, SiteSettings } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ProductPanel({
  product,
  settings,
  onClose,
  className,
}: {
  product: Product;
  settings: SiteSettings;
  onClose: () => void;
  className?: string;
}) {
  const whatsappUrl = buildWhatsAppUrl(settings, product);
  const specs = Object.entries(product.specifications).slice(0, 6);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <aside
      key={product.id}
      className={cn(
        "pointer-events-auto animate-fade-up overflow-hidden rounded-[1.4rem] border border-cream/15 bg-shell text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]",
        className,
      )}
      aria-label={`${product.name} details`}
    >
      <div className="relative h-1.5 w-full bg-navy">
        <span className="absolute inset-y-0 left-0 w-24 bg-ember" />
      </div>

      <div className="relative flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ember-dark">
            {product.category?.name ?? "Liberty Collection"}
          </p>
          <h2 className="mt-1.5 font-display text-[1.35rem] font-semibold leading-snug text-navy">
            {product.name}
          </h2>
          <p className="mt-1 text-[0.72rem] font-medium text-stone">
            Model number:{" "}
            <span className="font-semibold text-navy">
              {product.model_number || "—"}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-navy transition-colors hover:border-navy hover:bg-white"
          aria-label="Close product details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden bg-sand">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 92vw, 360px"
            className="object-cover"
          />
        ) : (
          <ProductArtwork
            categorySlug={product.category?.slug}
            categoryName={product.category?.name}
            name={product.name}
            compact
          />
        )}
        {product.is_demo && (
          <span className="absolute bottom-2 left-2 rounded-full bg-navy/80 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">
            Sample display
          </span>
        )}
      </div>

      <div className="max-h-[46vh] overflow-y-auto px-5 pb-5 pt-4 sm:max-h-[calc(100vh-26rem)]">
        <div className="flex flex-wrap items-center gap-2">
          <StockBadge status={product.stock_status} />
          <span className="rounded-full border border-line bg-cream px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone">
            {product.price !== null
              ? formatPrice(product.price)
              : "Wholesale price on enquiry"}
          </span>
        </div>

        {product.description && (
          <p className="mt-4 text-[0.8rem] leading-relaxed text-stone">
            {product.description}
          </p>
        )}

        {specs.length > 0 && (
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 rounded-xl border border-line bg-cream/70 p-3.5 sm:grid-cols-2">
            {specs.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-[0.56rem] font-bold uppercase tracking-[0.14em] text-stone/75">
                  {key}
                </dt>
                <dd className="mt-0.5 truncate text-[0.74rem] font-semibold text-navy">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-4 space-y-2 text-[0.68rem] leading-relaxed text-stone">
          <p className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
            Wholesale and retail enquiries welcome.
          </p>
          <p className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
            Colours, packs and current availability confirmed on enquiry.
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <WhatsAppButton
            href={whatsappUrl}
            label="Enquire on WhatsApp"
            fallbackHref="/#contact"
          />
          <Link
            href={`/products/${product.slug}`}
            className="btn btn-outline"
          >
            <PackageSearch className="h-4 w-4" />
            View full product details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!whatsappUrl && (
          <p className="mt-3 text-[0.62rem] leading-relaxed text-stone/80">
            WhatsApp is not configured yet. Use the enquiry form on the main
            site and our team will get back to you.
          </p>
        )}
      </div>
    </aside>
  );
}
