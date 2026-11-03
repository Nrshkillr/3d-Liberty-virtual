import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Box, ClipboardList, Layers } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { StockBadge } from "@/components/StockBadge";
import { WhatsAppButton } from "@/components/WhatsApp";
import { getProductBySlug, getRelatedProducts, getSettings } from "@/lib/data/catalogue";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} (Model ${product.model_number}) — wholesale baby and kids product from Liberty Enterprises, Sowcarpet, Chennai.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const [related, whatsappUrl] = await Promise.all([
    getRelatedProducts(product.category_id, product.id, 3),
    Promise.resolve(buildWhatsAppUrl(settings, product)),
  ]);

  const specs = Object.entries(product.specifications);

  return (
    <>
      <section className="border-b border-line/70">
        <div className="container-x py-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold text-stone"
          >
            <Link href="/" className="hover:text-navy">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/categories" className="hover:text-navy">
              Categories
            </Link>
            {product.category && (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-navy"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span className="text-navy">{product.name}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={product.category ? `/categories/${product.category.slug}` : "/categories"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-ember-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {product.category?.name ?? "collection"}
            </Link>
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-navy"
            >
              <Box className="h-4 w-4" />
              View in virtual showroom
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <ProductGallery
            images={product.images}
            name={product.name}
            categorySlug={product.category?.slug}
            categoryName={product.category?.name}
          />

          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ember-dark">
                  {product.category?.name ?? "Liberty Collection"}
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.08] text-navy sm:text-4xl md:text-[2.7rem]">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm font-medium text-stone">
                  Model number:{" "}
                  <span className="font-semibold text-navy">
                    {product.model_number || "—"}
                  </span>
                </p>
              </div>
              <StockBadge status={product.stock_status} className="mt-1" />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-sand/40 px-4 py-3.5">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone">
                  Pricing
                </p>
                <p className="mt-0.5 text-sm font-semibold text-navy">
                  {product.price !== null ? "Shown separately" : "Wholesale price on enquiry"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <WhatsAppButton href={whatsappUrl} label="WhatsApp enquiry" />
                <a href="#enquire" className="btn btn-outline">
                  Enquiry form
                </a>
              </div>
            </div>

            {product.description && (
              <div className="mt-6">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone">
                  Description
                </p>
                <div className="prose mt-2 max-w-none text-[0.93rem] leading-relaxed text-ink/85">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone">
                <ClipboardList className="h-3.5 w-3.5" />
                Specifications
              </p>
              {specs.length > 0 ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-line">
                  <dl className="divide-y divide-line">
                    {specs.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-4 py-3 even:bg-cream/70"
                      >
                        <dt className="text-[0.78rem] font-medium text-stone">
                          {key}
                        </dt>
                        <dd className="text-[0.8rem] font-semibold text-navy">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-4 text-sm text-stone">
                  Detailed specifications are confirmed on enquiry. Reach out to
                  our team with your requirements for exact details.
                </p>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-line bg-shell p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-navy">
                <Layers className="h-4 w-4 text-ember-dark" />
                How to enquire
              </p>
              <div className="mt-3 grid gap-2.5 text-[0.8rem] text-stone">
                <p>1. Note the model number shown above.</p>
                <p>2. Use WhatsApp or the form below for wholesale pricing and availability.</p>
                <p>3. Include quantity and any preferred colour/pack details if known.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-sand/35">
        <div className="container-x py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <p className="eyebrow">Enquire</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
                Get wholesale pricing
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">
                No prices are listed online. Send your enquiry with your name,
                phone and requirement — our team will get back with current
                pricing and availability.
              </p>

              <div className="mt-6 rounded-xl border border-line bg-shell p-4">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
                  Quicker route
                </p>
                <p className="mt-1 text-sm text-ink/80">
                  Prefer WhatsApp? Tap below and your product details will be
                  included automatically.
                </p>
                <WhatsAppButton href={whatsappUrl} label="Enquire on WhatsApp" className="mt-3" />
              </div>

              <p className="mt-4 text-[0.68rem] leading-relaxed text-stone/80">
                Liberty Enterprises · Sowcarpet, Chennai, Tamil Nadu, India
              </p>
            </div>

            <EnquiryForm product={{ id: product.id, name: product.name, model_number: product.model_number }} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">You might also like</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
                Related products
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-ember-dark"
              >
                View all in {product.category.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
