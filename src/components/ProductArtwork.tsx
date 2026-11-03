import { CategoryGlyph } from "@/components/CategoryGlyph";
import { CATEGORY_ART, FALLBACK_ART } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProductArtwork({
  categorySlug,
  name,
  categoryName,
  className,
  compact = false,
}: {
  categorySlug?: string | null;
  name: string;
  categoryName?: string | null;
  className?: string;
  compact?: boolean;
}) {
  const art = (categorySlug && CATEGORY_ART[categorySlug]) || FALLBACK_ART;

  return (
    <div
      className={cn(
        "relative isolate flex h-full w-full flex-col overflow-hidden",
        className,
      )}
      style={{ backgroundColor: art.tint, color: art.ink }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle at 82% 18%, rgba(255,255,255,0.75), transparent 42%), linear-gradient(135deg, transparent 58%, rgba(255,255,255,0.28) 58%, rgba(255,255,255,0.28) 58.6%, transparent 58.6%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-current opacity-[0.15]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-2 -top-4 h-32 w-32 rounded-full border border-current opacity-[0.12]"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative flex flex-1 items-center justify-center",
          compact ? "pt-4" : "pt-8",
        )}
      >
        <CategoryGlyph
          name={art.glyph}
          className={cn(
            "drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.06]",
            compact ? "h-20 w-20" : "h-28 w-28 md:h-32 md:w-32",
          )}
        />
      </div>

      <div className="relative flex items-end justify-between gap-3 px-4 pb-3.5 pt-2">
        <div className="min-w-0">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] opacity-60">
            {categoryName || "Liberty Collection"}
          </p>
          <p className="mt-1 line-clamp-2 font-display text-[0.98rem] font-semibold leading-snug">
            {name}
          </p>
        </div>
        <span className="shrink-0 text-[0.56rem] font-bold uppercase tracking-[0.18em] opacity-45">
          Liberty
        </span>
      </div>
    </div>
  );
}
