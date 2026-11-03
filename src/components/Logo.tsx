import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  compact = false,
  className,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      aria-label="Liberty Enterprises home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-rotate-3"
        aria-hidden="true"
      >
        <rect
          width="48"
          height="48"
          rx="14"
          fill={light ? "#FAF6EE" : "#102A43"}
        />
        <path
          d="M18 13v18.5h13.5"
          stroke={light ? "#102A43" : "#FAF6EE"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="33.5" cy="14.5" r="3" fill="#D9773F" />
      </svg>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] font-semibold tracking-[0.11em]",
              light ? "text-cream" : "text-navy",
            )}
          >
            LIBERTY
          </span>
          <span
            className={cn(
              "mt-1 text-[0.56rem] font-bold uppercase tracking-[0.32em]",
              light ? "text-cream/60" : "text-stone",
            )}
          >
            Enterprises
          </span>
        </span>
      )}
    </Link>
  );
}
