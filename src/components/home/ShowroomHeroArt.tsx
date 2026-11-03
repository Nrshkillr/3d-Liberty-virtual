import { Box, MousePointer2 } from "lucide-react";
import { CategoryGlyph } from "@/components/CategoryGlyph";

const SHELVES = [
  [
    { glyph: "walker", tint: "#f2d9c4", ink: "#a95a2a" },
    { glyph: "plush", tint: "#f0e1c8", ink: "#946537" },
    { glyph: "car", tint: "#d9e4ec", ink: "#2c5578" },
  ],
  [
    { glyph: "swing", tint: "#e5e8d9", ink: "#5f7157" },
    { glyph: "gift", tint: "#f2ded9", ink: "#a5625a" },
    { glyph: "tent", tint: "#dfe7d4", ink: "#5e7251" },
  ],
  [
    { glyph: "bike", tint: "#dfe7ea", ink: "#3f6274" },
    { glyph: "cradle", tint: "#efe1d6", ink: "#8c6245" },
    { glyph: "bottle", tint: "#eee5d7", ink: "#7a674c" },
  ],
];

export function ShowroomHeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[31rem]">
      <div className="relative overflow-hidden rounded-t-[13rem] rounded-b-[2rem] border border-navy/10 bg-[linear-gradient(160deg,#f6ecdd_0%,#efe2cf_52%,#e7d6bf_100%)] px-5 pb-5 pt-6 shadow-soft sm:px-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.9), transparent 45%), radial-gradient(circle at 85% 70%, rgba(217,119,63,0.14), transparent 45%)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="font-display text-[0.95rem] font-semibold tracking-[0.16em] text-navy">
              LIBERTY
            </p>
            <p className="mt-0.5 text-[0.48rem] font-bold uppercase tracking-[0.3em] text-stone">
              Enterprises
            </p>
          </div>
          <span className="rounded-full border border-navy/15 bg-shell/70 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-navy backdrop-blur">
            Virtual showroom
          </span>
        </div>

        <div className="relative mt-5 rounded-t-[10rem] border border-navy/15 bg-[#fbf6ed]/80 px-4 pb-5 pt-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div
            className="absolute inset-x-8 top-4 h-px bg-navy/10"
            aria-hidden="true"
          />
          <p className="text-center font-display text-[1.35rem] leading-tight text-navy">
            Little wonders,
            <br />
            <span className="italic text-ember-dark">beautifully displayed.</span>
          </p>

          <div className="mt-6 space-y-4">
            {SHELVES.map((row, rowIndex) => (
              <div key={rowIndex}>
                <div className="grid grid-cols-3 gap-2.5">
                  {row.map((item) => (
                    <div
                      key={item.glyph}
                      className="group flex aspect-square items-center justify-center rounded-xl border border-white/60 shadow-[0_6px_14px_-10px_rgba(16,42,67,0.5)] transition-transform duration-500 hover:-translate-y-1"
                      style={{ backgroundColor: item.tint, color: item.ink }}
                    >
                      <CategoryGlyph name={item.glyph} className="h-9 w-9 sm:h-10 sm:w-10" />
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 h-[3px] rounded-full bg-gradient-to-r from-wood/70 via-wood/45 to-wood/20" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-brass/35 bg-navy px-3.5 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.22em] text-cream/80">
              Walk in · Look around · Enquire
            </p>
            <Box className="h-3.5 w-3.5 text-ember-soft" />
          </div>
        </div>
      </div>

      <div className="absolute -left-3 top-[38%] hidden -rotate-2 items-center gap-2 rounded-xl border border-line bg-shell px-3 py-2 shadow-card sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember-dark">
          <MousePointer2 className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-navy">
          Tap any product
        </span>
      </div>

      <div className="absolute -right-2 bottom-[26%] hidden rotate-2 rounded-xl border border-line bg-shell px-3.5 py-2 shadow-card sm:block">
        <p className="text-[0.5rem] font-bold uppercase tracking-[0.18em] text-stone">
          Built for
        </p>
        <p className="text-[0.68rem] font-bold text-navy">Mobile & desktop</p>
      </div>
    </div>
  );
}
