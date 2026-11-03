"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsApp";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ whatsappUrl }: { whatsappUrl: string | null }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line/80 bg-cream/90 backdrop-blur-xl"
          : "border-b border-transparent bg-cream/60 backdrop-blur-sm",
      )}
    >
      <div className="container-x flex h-[4.75rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors",
                pathname === link.href
                  ? "bg-navy/6 text-navy"
                  : "text-stone hover:bg-navy/5 hover:text-navy",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton
            href={whatsappUrl}
            className="hidden sm:inline-flex"
            label="WhatsApp"
          />
          <Link
            href="/showroom"
            className="btn btn-primary hidden px-5 sm:inline-flex"
          >
            Enter Showroom
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpenPath(open ? null : pathname)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-shell text-navy lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenPath(null)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-navy hover:bg-navy/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <WhatsAppButton href={whatsappUrl} />
              <Link
                href="/showroom"
                onClick={() => setOpenPath(null)}
                className="btn btn-primary"
              >
                Enter Showroom
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
