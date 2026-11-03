import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Filter, PackageSearch, Search } from "lucide-react";
import { CategoryGlyph } from "@/components/CategoryGlyph";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/data/catalogue";
import { CATEGORY_ART, FALLBACK_ART } from "@/lib/site";
import type { StockStatus } from "@/lib/types";

const VALID_STOCK: (StockStatus | "all")[] = [
  "all",
  "in_stock",
  "low_stock",
  "out_of_stock",
  "enquire",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);

  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description:
      category.description ??
      `Browse ${category.name} from Liberty Enterprises, Sowcarpet, Chennai.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; stock?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;

  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const query = (resolvedSearch.q ?? "").trim().slice(0, 100);
  const stock = VALID_STOCK.includes(resolvedSearch.stock as StockStatus | "all")
    ? (resolvedSearch.stock as StockStatus | "all")
    : "all";

  const [products, allProducts] = await Promise.all([
    getProducts({ categorySlug: slug, search: query, stock }),
    getProducts({ categorySlug: slug }),
  ]);

  const art = CATEGORY_ART[category.slug] || FALLBACK_ART;
  const hasFilters = Boolean(query) || stock !== "all";

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-line/70"
        style={{ backgroundColor: art.tint }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 88% 15%, rgba(255,255,255,0.85), transparent 38%)",
          }}
          aria-hidden="true"
        />
        <div className="container-x relative py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.7rem] font-semibold text-current/60">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/categories" className="hover:underline">
              Categories
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-current">{category.name}</span>
          </nav>

          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-5" style={{ color: art.ink }}>
              <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-white/30 sm:flex">
                <CategoryGlyph name={art.glyph} className="h-11 w-11" />
              </span>
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] opacity-60">
                  Liberty collection
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
                  {category.name}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-75">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/categories"
                className="btn border border-current/20 bg-white/30 text-current hover:bg-white/50"
              >
                <ArrowLeft className="h-4 w-4" />
                All categories
              </Link>
              <Link
                href={`/showroom?section=${
                  category.slug.includes("walker") || category.slug.includes("accessor")
                    ? "left"
                    : category.slug.includes("riding") ||
                        category.slug.includes("battery")
                      ? "right"
                      : category.slug.includes("swing") ||
                          category.slug.includes("cradle") ||
                          category.slug.includes("jhula")
                        ? "centre"
                        : "back"
                }`}
                className="btn bg-navy text-cream hover:bg-navy-700"
              >
                See in 3D
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="flex flex-col gap-5 rounded-[1.25rem] border border-line bg-shell p-4 md:flex-row md:items-end md:justify-between md:p-5">
          <form
            action={`/categories/${category.slug}`}
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label htmlFor="q" className="label">
                Search in {category.name}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  placeholder="Product name or model number"
                  className="field pl-10"
                />
              </div>
            </div>

            <div className="sm:w-52">
              <label htmlFor="stock" className="label">
                Availability
              </label>
              <select id="stock" name="stock" defaultValue={stock} className="field">
                <option value="all">All availability</option>
                <option value="in_stock">In stock</option>
                <option value="low_stock">Limited stock</option>
                <option value="enquire">Enquire for availability</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary h-[2.8rem] px-5">
              <Filter className="h-4 w-4" />
              Apply
            </button>

            {hasFilters && (
              <Link
                href={`/categories/${category.slug}`}
                className="btn btn-ghost h-[2.8rem] px-4 text-stone"
              >
                Reset
              </Link>
            )}
          </form>

          <p className="shrink-0 text-xs font-semibold text-stone">
            {products.length} of {allProducts.length}{" "}
            {allProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="surface mt-7 flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-wood">
              <PackageSearch className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-navy">
              Nothing matched those filters.
            </h2>
            <p className="mt-2 max-w-md text-sm text-stone">
              Try another keyword or reset the availability filter. You can also
              ask our team directly about products in this category.
            </p>
            <Link href={`/categories/${category.slug}`} className="btn btn-primary mt-5">
              Reset filters
            </Link>
          </div>
        )}

        <div className="mt-12 border-t border-line pt-8">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone">
            More categories
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories
              .filter((item) => item.id !== category.id)
              .slice(0, 7)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${item.slug}`}
                  className="rounded-full border border-line bg-shell px-3.5 py-2 text-xs font-semibold text-navy transition-colors hover:border-navy hover:bg-cream"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
