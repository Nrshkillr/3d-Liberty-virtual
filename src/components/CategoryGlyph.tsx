import { cn } from "@/lib/utils";

export type GlyphName =
  | "walker"
  | "car"
  | "bike"
  | "swing"
  | "cradle"
  | "plush"
  | "tent"
  | "gift"
  | "bottle"
  | "star";

const PATHS: Record<GlyphName, React.ReactNode> = {
  walker: (
    <>
      <path d="M14 27h36v7a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4v-7Z" />
      <path d="M22 27v-6a10 10 0 0 1 20 0v6" />
      <path d="M31 27v11" />
      <circle cx="20" cy="45" r="3.5" />
      <circle cx="44" cy="45" r="3.5" />
      <path d="M14 34h36" />
    </>
  ),
  car: (
    <>
      <path d="M9 38v-7l5-2 5-9h21l7 9 8 2v7a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3Z" />
      <path d="M20 20h23l5 9H14l6-9Z" />
      <path d="M25 20v9M38 20v9" />
      <circle cx="20" cy="41" r="5" />
      <circle cx="45" cy="41" r="5" />
      <path d="M19 32h5M40 32h5" />
    </>
  ),
  bike: (
    <>
      <circle cx="15" cy="42" r="7" />
      <circle cx="49" cy="42" r="7" />
      <path d="M15 42l9-18h13l7 18M24 24h16M34 18h8M36 24l-3 9" />
      <path d="M25 33h13" />
      <path d="M10 31h8" />
    </>
  ),
  swing: (
    <>
      <path d="M9 15h46" />
      <path d="M17 15 9 52M47 15l8 37M17 15l30 37M47 15 17 52" />
      <path d="M22 15v18M42 15v18" />
      <path d="M20 33h24v6a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4v-6Z" />
    </>
  ),
  cradle: (
    <>
      <path d="M14 28h36v6a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10v-6Z" />
      <path d="M18 28v-8a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v8" />
      <path d="M10 51c4-5 8-5 12 0M42 51c4-5 8-5 12 0" />
      <path d="M32 14V6" />
      <circle cx="32" cy="5" r="2" />
    </>
  ),
  plush: (
    <>
      <circle cx="20" cy="19" r="6" />
      <circle cx="44" cy="19" r="6" />
      <circle cx="32" cy="34" r="15" />
      <circle cx="27" cy="32" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="37" cy="32" r="1.6" fill="currentColor" stroke="none" />
      <path d="M29 39c2 2 4 2 6 0" />
      <path d="M25 48c-3 5 0 9 7 9s10-4 7-9" />
    </>
  ),
  tent: (
    <>
      <path d="M8 51 32 12l24 39H8Z" />
      <path d="M32 12v39" />
      <path d="M23 51l9-16 9 16" />
      <path d="M32 12v-5h6l-2 5" />
    </>
  ),
  gift: (
    <>
      <rect x="11" y="26" width="42" height="25" rx="2" />
      <path d="M8 19h48v7H8zM32 19v32" />
      <path d="M32 19c-8 0-13-2-13-7 0-4 5-5 8-2 3 4 5 9 5 9ZM32 19c8 0 13-2 13-7 0-4-5-5-8-2-3 4-5 9-5 9Z" />
    </>
  ),
  bottle: (
    <>
      <path d="M25 8h14v7H25z" />
      <path d="M23 15h18l2 7v28a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5V22l2-7Z" />
      <path d="M21 29h22M21 45h22" />
      <path d="M30 8V4h4v4" />
    </>
  ),
  star: (
    <>
      <path d="m32 8 6 16 17 1-13 11 4 17-14-9-14 9 4-17L9 25l17-1 6-16Z" />
      <path d="M32 24v18" />
    </>
  ),
};

export function CategoryGlyph({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const glyph = (PATHS[name as GlyphName] ? name : "star") as GlyphName;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-12 w-12", className)}
      aria-hidden="true"
    >
      {PATHS[glyph]}
    </svg>
  );
}
