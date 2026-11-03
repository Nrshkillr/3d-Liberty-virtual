import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { getCategoriesWithCounts, getProducts } from "@/lib/data/catalogue";
import { isDemoMode } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Product Categories",
  description:
    "Browse baby walkers, ride-on toys, battery cars, swings, cradles, soft toys, tents, gift sets and accessories from Liberty Enterprises, Chennai.",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const query = typeof resolved.q === "string" ? resolved.q.trim() : "";

  const [categories, results] = await Promise.all([
    getCategoriesWithCounts(),
    query ? getProducts({ search: query }) : Promise.resolve([]),
  ]);

  const totalProducts = categories.reduce(
    (sum, category) => sum + category.product_count,
    0,
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/70 bg-sand/40">
        <div
          className="pointer-events-none absolute inset-0 hairline-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
          aria-hidden="true"
        />
        <div className="container-x relative py-14 md:py-18">
          <p className="eyebrow">The collection</p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-navy sm:text-5xl md:text-6xl">
                Everything for little ones.
              </h1>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-stone">
                Browse the Liberty Enterprises range by category. {totalProducts}{" "}
                catalogue {totalProducts === 1 ? "item" : "items"} across{" "}
                {categories.length} categories, with wholesale details available
                on enquiry.
              </p>
            </div>

            <form
              action="/categories"
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-line bg-shell p-1.5 shadow-sm md:w-auto"
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-stone" />
              <label htmlFor="category-search" className="sr-only">
                Search products
              </label>
              <input
                id="category-search"
                name="q"
                defaultValue={query}
                placeholder="Search products or model numbers"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink outline-none placeholder:text-stone/70"
              />
              <button type="submit" className="btn btn-primary px-4 py-2.5 text-xs">
                Search
              </button>
            </form>
          </div>

          {isDemoMode && (
            <p className="mt-5 inline-flex rounded-full border border-wood/20 bg-ember-soft/40 px-3 py-1 text-[0.65rem] font-semibold text-wood">
              Preview catalogue · sample products shown until Supabase is connected
            </p>
          )}
        </div>
      </section>

      <section className="container-x py-14 md:py-18">
        {query ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Search</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
                  Results for “{query}”
                </h2>
                <p className="mt-1 text-sm text-stone">
                  {results.length} {results.length === 1 ? "product" : "products"} found
                </p>
              </div>
              <Link href="/categories" className="btn btn-outline">
                <X className="h-4 w-4" />
                Clear search
              </Link>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="surface mt-8 p-10 text-center">
                <p className="font-display text-2xl font-semibold text-navy">
                  No products matched that search.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-stone">
                  Try a broader word such as “walker”, “car” or “swing”, or browse
                  the categories below.
                </p>
              </div>
            )}

            <div className="my-12 h-px bg-line" />
          </div>
        ) : null}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
              Shop by category
            </h2>
          </div>
          <Link
            href="/showroom"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-ember-dark"
          >
            Or explore in 3D
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {!query && categories.length === 0 && (
          <div className="surface mt-8 p-10 text-center">
            <p className="font-display text-2xl font-semibold text-navy">
              The catalogue is being prepared.
            </p>
            <p className="mt-2 text-sm text-stone">
              Categories added in the admin dashboard will appear here.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
