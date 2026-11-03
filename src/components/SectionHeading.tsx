import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow", dark && "text-ember-soft")}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl md:text-[2.7rem]",
            dark ? "text-cream" : "text-navy",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 max-w-xl text-[0.95rem] leading-relaxed",
              dark ? "text-cream/65" : "text-stone",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-bold",
            dark ? "text-cream" : "text-navy",
          )}
        >
          {action.label}
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-1",
              dark
                ? "border-cream/25 group-hover:bg-cream/10"
                : "border-line group-hover:border-navy group-hover:bg-navy group-hover:text-cream",
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  );
}
