import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Building2,
  Compass,
  MapPin,
  MessageCircle,
  MousePointer2,
  Package,
  Search,
  Store,
} from "lucide-react";
import { ShowroomHeroArt } from "@/components/home/ShowroomHeroArt";
import { ShowroomTourCard } from "@/components/home/ShowroomTourCard";
import { CategoryCard } from "@/components/CategoryCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsApp";
import { getCategoriesWithCounts, getProducts, getSettings } from "@/lib/data/catalogue";
import { SITE } from "@/lib/site";
import { isDemoMode } from "@/lib/supabase/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts({ limit: 4 }),
    getCategoriesWithCounts(),
    getSettings(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(settings);
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div
          className="pointer-events-none absolute inset-0 hairline-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-ember/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-sage/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-x relative grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16 lg:py-20">
          <div className="animate-fade-up">
            <p className="eyebrow">Sowcarpet, Chennai · Est. wholesale house</p>

            <h1 className="mt-5 max-w-[15ch] font-display text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.03em] text-navy sm:max-w-none sm:text-6xl lg:text-[4.35rem]">
              Step into a world of{" "}
              <span className="relative whitespace-nowrap italic text-ember-dark">
                little wonders
                <svg
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 w-full text-ember/35"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8c60-5 130-7 296-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-stone md:text-[1.05rem]">
              Explore the Liberty Enterprises showroom from wherever you are.
              Walk through our 3D store, discover baby walkers, ride-ons,
              battery vehicles, swings, soft toys and gift sets — then send a
              wholesale enquiry in a tap.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/showroom" className="btn btn-ember px-6 py-3.5 text-[0.95rem]">
                <Box className="h-4.5 w-4.5" />
                Enter the 3D showroom
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/categories" className="btn btn-outline px-6 py-3.5 text-[0.95rem]">
                Browse the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-line pt-6">
              {[
                { icon: Package, value: `${categories.length}`, label: "Categories" },
                { icon: Store, value: "Wholesale", label: "& retail welcome" },
                { icon: MapPin, value: SITE.area, label: "Chennai" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <item.icon className="h-4 w-4 text-ember-dark" />
                  <dt className="font-display text-lg font-semibold leading-none text-navy">
                    {item.value}
                  </dt>
                  <dd className="text-[0.68rem] font-medium text-stone">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-in lg:pl-4" style={{ animationDelay: "120ms" }}>
            <ShowroomHeroArt />
          </div>
        </div>
      </section>

      {/* Category ribbon */}
      <div className="border-b border-line/70 bg-shell/70">
        <div className="container-x flex gap-6 overflow-x-auto py-4 no-scrollbar">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex shrink-0 items-center gap-2 text-[0.72rem] font-semibold tracking-wide text-stone transition-colors hover:text-navy"
            >
              <span className="text-ember/70">{String(index + 1).padStart(2, "0")}</span>
              {category.name}
              {index < categories.length - 1 && (
                <span className="ml-4 h-3 w-px bg-line" aria-hidden="true" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="container-x py-16 md:py-20">
        <SectionHeading
          eyebrow="From the showroom floor"
          title="A few favourites, ready to explore."
          description="Every item below is a real catalogue listing once your products are connected. Click through for details or enquire with our wholesale team."
          action={{ href: "/categories", label: "View all products" }}
        />

        {featured.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="surface mt-9 flex flex-col items-start gap-4 p-8">
            <Package className="h-6 w-6 text-ember-dark" />
            <div>
              <p className="font-display text-xl font-semibold text-navy">
                The catalogue is being prepared.
              </p>
              <p className="mt-1.5 max-w-md text-sm text-stone">
                Products added in the admin dashboard will appear here and inside
                the virtual showroom automatically.
              </p>
            </div>
            <Link href="/admin" className="btn btn-primary">
              Open admin dashboard
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="border-y border-line/70 bg-sand/45 py-16 md:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Browse by category"
            title="Everything for little ones, under one roof."
            description="From first steps to first rides — our collection is arranged the way a shop floor should be. Clear, complete and easy to source."
            action={{ href: "/categories", label: "All categories" }}
          />

          <div className="mt-9 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.35rem] border border-line bg-shell px-5 py-4">
            <p className="text-sm text-stone">
              Looking for something specific?{" "}
              <span className="font-semibold text-navy">
                {categories.length} categories
              </span>{" "}
              are available to browse.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-ember-dark"
            >
              Explore the full collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="relative overflow-hidden bg-navy py-16 text-cream md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(217,119,63,0.5), transparent 35%), radial-gradient(circle at 85% 80%, rgba(196,154,90,0.35), transparent 40%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-cream/10"
          aria-hidden="true"
        />

        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow text-ember-soft">The main event</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-[2.9rem]">
              Your showroom visit,
              <br />
              without the traffic.
            </h2>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-cream/65">
              Walk the aisle, look around the displays and open any product for
              details. It is a first-person shopping experience built for
              phones, tablets and desktops.
            </p>

            <ul className="mt-7 grid max-w-lg gap-3 sm:grid-cols-2">
              {[
                { icon: MousePointer2, text: "Walk with keys or joystick" },
                { icon: Compass, text: "Drag to look around" },
                { icon: Search, text: "Category shortcuts & mini-map" },
                { icon: MessageCircle, text: "Enquire from inside the showroom" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-[0.8rem] text-cream/75">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-cream/5">
                    <item.icon className="h-3.5 w-3.5 text-ember-soft" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/showroom" className="btn btn-ember px-6 py-3.5">
                <Box className="h-4.5 w-4.5" />
                Enter showroom
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="text-sm font-semibold text-cream/70 underline decoration-cream/25 underline-offset-4 hover:text-cream"
              >
                Browse without 3D
              </Link>
            </div>

            <p className="mt-5 max-w-md text-[0.68rem] leading-relaxed text-cream/40">
              On a low-end device? The showroom automatically reduces visual
              detail, and the full catalogue is always available as a standard
              product listing.
            </p>
          </div>

          <ShowroomTourCard />
        </div>
      </section>

      {/* Wholesale */}
      <section id="wholesale" className="container-x scroll-mt-24 py-16 md:py-20">
        <SectionHeading
          eyebrow="The Liberty way"
          title="Built for shops. Open to families."
          description="Whether you stock a store, resell online or are shopping for your own little one, start with the collection and talk to us about what you need."
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[1.5rem] border border-line bg-shell p-7 md:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember/8 transition-transform duration-700 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/12 text-ember-dark">
              <Building2 className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
              For retailers & resellers
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Browse the range, shortlist the models you like and send us your
              requirement. We will come back with wholesale pricing and current
              availability.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Wholesale pricing shared on enquiry",
                "Baby and kids products in one place",
                "Showroom support in Sowcarpet, Chennai",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.82rem] text-ink/80">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-ember-dark"
            >
              Send a wholesale enquiry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="group relative overflow-hidden rounded-[1.5rem] border border-line bg-[#f6ede0] p-7 md:p-8">
            <div
              className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-white/50 transition-transform duration-700 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/8 text-navy">
              <Store className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
              For parents & families
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Shopping for your home? Explore the same showroom collection and
              ask us about individual purchases, colours and what is currently
              available.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Browse before you visit the store",
                "Ask about single-piece availability",
                "Find the right gift for a little one",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.82rem] text-ink/80">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-ember-dark"
            >
              Ask about a product
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-line bg-shell p-6 sm:grid-cols-3 md:p-7">
          {[
            {
              step: "01",
              title: "Explore",
              text: "Walk the 3D showroom or browse the category pages at your own pace.",
            },
            {
              step: "02",
              title: "Shortlist",
              text: "Open a product to check its model number, description and details.",
            },
            {
              step: "03",
              title: "Enquire",
              text: "Send your requirement through WhatsApp or the enquiry form.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span className="font-display text-2xl font-semibold text-ember/50">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{item.title}</p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-stone">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="scroll-mt-24 border-y border-line/70 bg-sand/40 py-16 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-navy sm:text-4xl">
              In the heart of Sowcarpet,
              <br className="hidden sm:block" /> Chennai.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
              Liberty Enterprises is a wholesale baby and kids&apos; products
              house in Sowcarpet. Use the map link for directions, or get in
              touch before your visit so we can guide you to what you need.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3 rounded-xl border border-line bg-shell px-4 py-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-dark" />
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
                    Showroom
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">
                    {[settings.address_line1, settings.address_line2, settings.city, settings.state, settings.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    settings.map_query || SITE.mapQuery,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <MapPin className="h-4 w-4" />
                  Get directions
                </a>
                <WhatsAppButton href={whatsappUrl} label="Ask before you visit" />
              </div>

              <p className="pt-1 text-[0.7rem] leading-relaxed text-stone/80">
                {settings.opening_hours
                  ? `Showroom hours: ${settings.opening_hours}`
                  : "Showroom timings are confirmed on enquiry. Please reach out before travelling."}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.6rem] border border-line bg-[#eee5d6] shadow-card">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(16,42,67,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,42,67,0.07) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
              aria-hidden="true"
            />
            <svg viewBox="0 0 620 420" className="relative w-full" aria-hidden="true">
              <path d="M-20 300C100 250 180 290 280 250s180-120 380-70" fill="none" stroke="#d8c9b3" strokeWidth="22" />
              <path d="M-20 300C100 250 180 290 280 250s180-120 380-70" fill="none" stroke="#f8f1e5" strokeWidth="7" strokeDasharray="14 12" />
              <path d="M180 -20c30 120 90 180 60 300s30 100 60 160" fill="none" stroke="#ddd0bb" strokeWidth="15" />
              <path d="M470 -20c-20 110-60 170-20 260s40 110 20 200" fill="none" stroke="#ddd0bb" strokeWidth="15" />
              <rect x="70" y="70" width="96" height="70" rx="7" fill="#e6dbc9" />
              <rect x="200" y="110" width="70" height="110" rx="7" fill="#e9dfcf" />
              <rect x="390" y="70" width="110" height="76" rx="7" fill="#e6dbc9" />
              <rect x="420" y="250" width="90" height="60" rx="7" fill="#e9dfcf" />
              <rect x="70" y="250" width="80" height="80" rx="7" fill="#e9dfcf" />
              <path d="M300 30v360" stroke="#cbbda7" strokeWidth="1.5" strokeDasharray="6 8" />
              <g transform="translate(310 205)">
                <circle r="48" fill="#d9773f" opacity="0.12" />
                <circle r="30" fill="#d9773f" opacity="0.2" />
                <path d="M0-32c-16 0-28 12-28 27 0 20 28 45 28 45s28-25 28-45C28-20 16-32 0-32Z" fill="#102A43" />
                <circle cx="0" cy="-6" r="9" fill="#faf6ee" />
              </g>
              <text x="310" y="290" textAnchor="middle" fill="#102A43" fontSize="17" fontWeight="700" fontFamily="Georgia, serif">
                Sowcarpet
              </text>
              <text x="310" y="312" textAnchor="middle" fill="#6c675f" fontSize="10.5" letterSpacing="3">
                CHENNAI · TAMIL NADU
              </text>
            </svg>
            <div className="absolute left-4 top-4 rounded-lg border border-line bg-shell/90 px-3 py-2 backdrop-blur">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-stone">
                Liberty Enterprises
              </p>
              <p className="text-xs font-bold text-navy">Sowcarpet · Chennai</p>
            </div>
            <div className="absolute bottom-4 right-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings.map_query || SITE.mapQuery,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-2 text-[0.68rem] font-bold text-cream shadow-lg"
              >
                Open in Maps
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container-x scroll-mt-24 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow">Let&apos;s talk</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-navy sm:text-4xl">
              Tell us what
              <br />
              you&apos;re looking for.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
              Share the categories or products you have in mind, along with your
              location and quantity. Our team will reply with wholesale details
              and availability.
            </p>

            <div className="mt-7 space-y-4">
              {whatsappUrl ? (
                <div className="rounded-xl border border-line bg-shell p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
                    Fastest response
                  </p>
                  <p className="mt-1 text-sm text-ink/80">
                    Message us on WhatsApp with the product and quantity you
                    need.
                  </p>
                  <WhatsAppButton
                    href={whatsappUrl}
                    label="Start a WhatsApp enquiry"
                    className="mt-3 w-full sm:w-auto"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-line bg-shell/60 p-4 text-xs leading-relaxed text-stone">
                  WhatsApp contact will appear here once the business number is
                  added in the admin settings. Until then, use the enquiry form.
                </div>
              )}

              <div className="rounded-xl border border-line bg-shell p-4">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
                  Wholesale desk
                </p>
                <p className="mt-1 text-sm text-ink/80">
                  For bulk requirements, include your shop name, city and the
                  models you are interested in.
                </p>
              </div>

              {settings.phone || settings.email ? (
                <div className="space-y-2 text-sm text-stone">
                  {settings.phone && (
                    <p>
                      Phone:{" "}
                      <a href={`tel:${settings.phone}`} className="font-semibold text-navy">
                        {settings.phone}
                      </a>
                    </p>
                  )}
                  {settings.email && (
                    <p>
                      Email:{" "}
                      <a href={`mailto:${settings.email}`} className="font-semibold text-navy">
                        {settings.email}
                      </a>
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <EnquiryForm
            disabledReason={
              isDemoMode
                ? "This is a preview installation. Online enquiries will start working as soon as the Supabase database is connected and your contact details are added."
                : undefined
            }
          />
        </div>
      </section>
    </>
  );
}
