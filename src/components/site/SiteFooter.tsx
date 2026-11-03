import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppButton, WhatsAppIcon } from "@/components/WhatsApp";
import type { Category, SiteSettings } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const whatsappUrl = buildWhatsAppUrl(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-cream">
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-cream/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-cream/10"
        aria-hidden="true"
      />

      <div className="container-x relative py-14 md:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
              A wholesale house for baby and kids&apos; products in the heart of
              Sowcarpet, Chennai. Come in, explore, and find what your shelves
              need next.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <WhatsAppButton href={whatsappUrl} label="WhatsApp us" />
              <Link
                href="/showroom"
                className="btn border border-cream/20 bg-transparent text-cream hover:bg-cream/10"
              >
                Virtual showroom
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/45">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/showroom" className="hover:text-ember-soft">
                  Virtual showroom
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-ember-soft">
                  All categories
                </Link>
              </li>
              <li>
                <Link href="/#wholesale" className="hover:text-ember-soft">
                  Wholesale & retail
                </Link>
              </li>
              <li>
                <Link href="/#visit" className="hover:text-ember-soft">
                  Visit the showroom
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-ember-soft">
                  Send an enquiry
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/45">
              Categories
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-ember-soft"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length > 6 && (
                <li>
                  <Link
                    href="/categories"
                    className="text-cream/50 hover:text-ember-soft"
                  >
                    View all {categories.length} categories
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/45">
              Visit & contact
            </p>
            <address className="mt-5 space-y-3 text-sm not-italic text-cream/75">
              <p className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-soft" />
                <span>
                  {[
                    settings.address_line1,
                    settings.address_line2,
                    settings.city,
                    settings.state,
                    settings.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>

              {settings.phone ? (
                <p className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ember-soft" />
                  <a href={`tel:${settings.phone}`} className="hover:text-ember-soft">
                    {settings.phone}
                  </a>
                </p>
              ) : null}

              {whatsappUrl ? (
                <p className="flex gap-2.5">
                  <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-ember-soft" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ember-soft"
                  >
                    Enquire on WhatsApp
                  </a>
                </p>
              ) : null}

              {settings.email ? (
                <p className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember-soft" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-ember-soft"
                  >
                    {settings.email}
                  </a>
                </p>
              ) : null}

              <p className="text-cream/45">
                {settings.opening_hours ||
                  "Showroom hours: contact us for current timings."}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/12 pt-6 text-xs text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Liberty Enterprises, Sowcarpet, Chennai. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              Prices, stock and specifications are confirmed on enquiry.
            </span>
            <Link href="/admin" className="hover:text-cream/80">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
