import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryGlyph } from "@/components/CategoryGlyph";
import { CATEGORY_ART, FALLBACK_ART } from "@/lib/site";
import type { Category } from "@/lib/types";

export function CategoryCard({
  category,
  count,
}: {
  category: Category & { product_count?: number };
  count?: number;
}) {
  const art = CATEGORY_ART[category.slug] || FALLBACK_ART;
  const total = count ?? category.product_count ?? 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-line p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card"
      style={{ backgroundColor: art.tint, color: art.ink }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border border-current opacity-15 transition-transform duration-500 group-hover:scale-110"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full border border-current opacity-10"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <CategoryGlyph
          name={art.glyph}
          className="h-11 w-11 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110"
        />
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current/20 bg-white/25 transition-all duration-300 group-hover:bg-white/45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative mt-8">
        <h3 className="font-display text-xl font-semibold leading-tight">
          {category.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed opacity-70">
          {category.description}
        </p>
        <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] opacity-55">
          {total === 1 ? "1 product" : `${total} products`}
        </p>
      </div>
    </Link>
  );
}
