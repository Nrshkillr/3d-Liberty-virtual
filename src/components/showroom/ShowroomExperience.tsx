"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronRight,
  Compass,
  Grid2X2,
  HelpCircle,
  LocateFixed,
  MapPin,
  MessageCircle,
  MousePointer2,
  Move3D,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { Joystick } from "@/components/showroom/Joystick";
import { MiniMap } from "@/components/showroom/MiniMap";
import { ProductPanel } from "@/components/showroom/ProductPanel";
import {
  createPlayerState,
  resetPlayer,
  teleportPlayer,
  type PlayerState,
} from "@/components/showroom/player";
import {
  SECTION_ANCHORS,
  sectionForPosition,
  SPAWN,
  type SectionAnchor,
} from "@/components/showroom/showroom-config";
import {
  useDeviceQuality,
  useIsTouchDevice,
  useWebGLSupport,
} from "@/components/showroom/hooks";
import { Logo } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsApp";
import { SHOWROOM_SECTIONS, SITE } from "@/lib/site";
import type { Product, ShowroomSectionId, SiteSettings } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ShowroomScene = dynamic(() => import("@/components/showroom/ShowroomScene"), {
  ssr: false,
  loading: () => <SceneLoading />,
});

function SceneLoading() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0c2135] px-6 text-center text-cream">
      <span className="h-11 w-11 animate-spin rounded-full border-2 border-cream/20 border-t-ember" />
      <div>
        <p className="font-display text-xl font-semibold">Preparing the showroom</p>
        <p className="mt-1 text-sm text-cream/60">
          Arranging shelves, lighting and product displays.
        </p>
      </div>
    </div>
  );
}

type ViewMode = "3d" | "list";

function locationFor(x: number, z: number): SectionAnchor["id"] {
  if (Math.hypot(x - SPAWN.x, z - SPAWN.z) < 2.2) return "entrance";
  const counter = SECTION_ANCHORS.find((item) => item.id === "counter");
  if (counter && Math.hypot(x - counter.x, z - counter.z) < 2.5) return "counter";
  return sectionForPosition(x, z);
}

const LOCATION_LABELS: Record<SectionAnchor["id"], string> = {
  entrance: "Entrance",
  left: "Walkers & accessories",
  right: "Ride-ons & battery",
  centre: "Swings & cradles",
  back: "Toys, tents & gifts",
  counter: "Enquiries counter",
};

function SectionNav({
  active,
  onGo,
  vertical = false,
}: {
  active: SectionAnchor["id"];
  onGo: (id: SectionAnchor["id"]) => void;
  vertical?: boolean;
}) {
  const items = [
    ...SHOWROOM_SECTIONS.map((section) => ({
      id: section.id as SectionAnchor["id"],
      label: section.shortLabel,
    })),
    { id: "counter" as const, label: "Enquiries" },
    { id: "entrance" as const, label: "Entrance" },
  ];

  return (
    <div
      className={cn(
        "no-scrollbar flex gap-1.5 overflow-x-auto",
        vertical ? "flex-col" : "items-center",
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onGo(item.id)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.1em] transition-colors",
            active === item.id
              ? "border-ember bg-ember text-white shadow-[0_8px_20px_-10px_rgba(217,119,63,0.9)]"
              : "border-cream/20 bg-navy/60 text-cream/75 backdrop-blur hover:border-cream/50 hover:text-cream",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function HelpPanel({ touch, onClose }: { touch: boolean; onClose: () => void }) {
  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[1.6rem] border border-cream/15 bg-shell text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ember-dark">
              Showroom guide
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-navy">
              How to explore
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream text-navy hover:border-navy"
            aria-label="Close help"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {(touch
            ? [
                {
                  icon: Move3D,
                  title: "Walk",
                  body: "Drag the joystick at the bottom-left to move through the showroom.",
                },
                {
                  icon: Compass,
                  title: "Look around",
                  body: "Drag anywhere on the room itself to turn and look up or down.",
                },
                {
                  icon: MousePointer2,
                  title: "View a product",
                  body: "Tap any product display to open its details and enquiry options.",
                },
              ]
            : [
                {
                  icon: Move3D,
                  title: "Walk",
                  body: "Use W A S D or the arrow keys. Hold Shift to walk faster.",
                },
                {
                  icon: Compass,
                  title: "Look around",
                  body: "Click and drag on the room to turn. Scroll to step forward or back.",
                },
                {
                  icon: MousePointer2,
                  title: "View a product",
                  body: "Click any product display to open its details and enquiry options.",
                },
              ]
          ).map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-ember-dark">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{item.title}</p>
                <p className="mt-0.5 text-[0.78rem] leading-relaxed text-stone">
                  {item.body}
                </p>
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-line bg-cream px-4 py-3 text-[0.72rem] leading-relaxed text-stone">
            <span className="font-bold text-navy">Shortcuts:</span> use the
            location pills to jump to a zone, the map to see where you are, and
            <span className="font-semibold text-navy"> R</span> to return to the
            entrance. Press <span className="font-semibold text-navy">Esc</span>{" "}
            to close any panel.
          </div>

          <button type="button" onClick={onClose} className="btn btn-primary w-full">
            Back to the showroom
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EntranceScreen({
  productCount,
  demoMode,
  touch,
  onStart,
  onBrowse,
  onJump,
}: {
  productCount: number;
  demoMode: boolean;
  touch: boolean;
  onStart: () => void;
  onBrowse: () => void;
  onJump: (id: SectionAnchor["id"]) => void;
}) {
  return (
    <div className="absolute inset-0 z-30 overflow-y-auto bg-[#0c2135]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(217,119,63,0.28), transparent 38%), radial-gradient(circle at 84% 78%, rgba(196,154,90,0.2), transparent 40%), linear-gradient(115deg, #0c2135 0%, #12304a 52%, #0c2135 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #faf6ee 1px, transparent 1px), linear-gradient(to bottom, #faf6ee 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl items-center px-4 py-8 sm:px-6 md:py-12">
        <div className="w-full overflow-hidden rounded-[1.8rem] border border-cream/15 bg-cream shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative p-6 sm:p-9 lg:p-11">
              <Logo />

              <p className="eyebrow mt-8">Virtual showroom · {SITE.area}</p>

              <h1 className="mt-4 max-w-[17ch] font-display text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.025em] text-navy sm:text-[3.25rem]">
                Step inside our{" "}
                <span className="italic text-ember-dark">little world</span>.
              </h1>

              <p className="mt-5 max-w-lg text-[0.94rem] leading-relaxed text-stone">
                Walk through the Liberty Enterprises showroom from wherever you
                are. Browse walkers, ride-ons, battery vehicles, swings, soft
                toys and gift sets — then send a wholesale enquiry in a tap.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] font-semibold text-stone">
                <span className="inline-flex items-center gap-1.5">
                  <Box className="h-4 w-4 text-ember-dark" />
                  {productCount} products on display
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-ember-dark" />
                  {SITE.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-ember-dark" />
                  No download needed
                </span>
              </div>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={onStart}
                  className="btn btn-ember px-6 py-3.5 text-[0.92rem]"
                >
                  <Box className="h-4.5 w-4.5" />
                  Enter the 3D showroom
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onBrowse}
                  className="btn btn-outline px-6 py-3.5 text-[0.92rem]"
                >
                  <Grid2X2 className="h-4 w-4" />
                  Browse without 3D
                </button>
              </div>

              {demoMode && (
                <p className="mt-5 rounded-xl border border-line bg-sand/50 px-3.5 py-2.5 text-[0.68rem] leading-relaxed text-stone">
                  Preview catalogue: sample displays are shown until the live
                  Supabase catalogue is connected. No prices or stock are
                  implied.
                </p>
              )}
            </div>

            <div className="relative flex flex-col justify-between bg-navy p-6 text-cream sm:p-9 lg:p-11">
              <div
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-cream/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-cream/10"
                aria-hidden="true"
              />

              <div className="relative">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ember-soft">
                  How it works
                </p>
                <ul className="mt-5 space-y-4">
                  {(touch
                    ? [
                        {
                          icon: Move3D,
                          title: "Joystick to walk",
                          body: "Drag the control at the bottom-left to move around.",
                        },
                        {
                          icon: Compass,
                          title: "Drag to look",
                          body: "Swipe on the room to turn and take in the displays.",
                        },
                        {
                          icon: MousePointer2,
                          title: "Tap to explore",
                          body: "Tap a product to see details and enquire.",
                        },
                      ]
                    : [
                        {
                          icon: Move3D,
                          title: "WASD or arrows",
                          body: "Walk the aisles at your own pace.",
                        },
                        {
                          icon: Compass,
                          title: "Drag to look",
                          body: "Click, hold and move the mouse to look around.",
                        },
                        {
                          icon: MousePointer2,
                          title: "Click to explore",
                          body: "Click a product to see details and enquire.",
                        },
                      ]
                  ).map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-cream/5 text-ember-soft">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[0.82rem] font-bold">{item.title}</p>
                        <p className="mt-0.5 text-[0.72rem] leading-relaxed text-cream/55">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-8 border-t border-cream/12 pt-5">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-cream/45">
                  Jump straight to a zone
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {SHOWROOM_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onJump(section.id)}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-cream/12 bg-cream/[0.04] px-3 py-2.5 text-left transition-colors hover:border-ember/60 hover:bg-ember/10"
                    >
                      <span className="text-[0.7rem] font-semibold text-cream/80 group-hover:text-cream">
                        {section.shortLabel}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-cream/35 group-hover:text-ember-soft" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogueView({
  products,
  settings,
  reason,
  onEnter3D,
}: {
  products: Product[];
  settings: SiteSettings;
  reason: "chosen" | "unsupported";
  onEnter3D: (() => void) | null;
}) {
  const whatsappUrl = buildWhatsAppUrl(settings);

  return (
    <div className="min-h-[100dvh] bg-cream">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur-xl">
        <div className="container-x flex h-[4.4rem] items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            {onEnter3D && (
              <button
                type="button"
                onClick={onEnter3D}
                className="btn btn-primary hidden sm:inline-flex"
              >
                <Box className="h-4 w-4" />
                Enter 3D showroom
              </button>
            )}
            <WhatsAppButton href={whatsappUrl} label="WhatsApp" className="hidden sm:inline-flex" />
            <Link href="/" className="btn btn-outline px-4">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Main site</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-x py-9 md:py-12">
        <p className="eyebrow">Catalogue view</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="max-w-2xl font-display text-[2rem] font-semibold leading-[1.08] text-navy sm:text-4xl">
              Explore the showroom collection
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone">
              {reason === "unsupported"
                ? "3D is not available in this browser, so here is the full showroom catalogue instead. You can still view every product and send an enquiry."
                : "Prefer a simpler view? Browse every product from the 3D showroom as a catalogue. You can return to the walkthrough at any time."}
            </p>
          </div>
          {onEnter3D && (
            <button
              type="button"
              onClick={onEnter3D}
              className="btn btn-ember sm:hidden"
            >
              <Box className="h-4 w-4" />
              Enter 3D showroom
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-shell px-6 py-14 text-center">
            <p className="font-display text-xl font-semibold text-navy">
              No showroom products yet
            </p>
            <p className="mt-2 text-sm text-stone">
              Products marked for the showroom will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {SHOWROOM_SECTIONS.map((section) => {
              const sectionProducts = products.filter(
                (product) => product.showroom_section === section.id,
              );
              if (sectionProducts.length === 0) return null;

              return (
                <section key={section.id} aria-labelledby={`section-${section.id}`}>
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ember-dark">
                        Zone · {section.shortLabel}
                      </p>
                      <h2
                        id={`section-${section.id}`}
                        className="mt-1 font-display text-2xl font-semibold text-navy"
                      >
                        {section.label}
                      </h2>
                      <p className="mt-1 text-sm text-stone">{section.description}</p>
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone/70">
                      {sectionProducts.length}{" "}
                      {sectionProducts.length === 1 ? "product" : "products"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {sectionProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-shell px-5 py-5">
          <div>
            <p className="font-display text-lg font-semibold text-navy">
              Need wholesale pricing or a sample?
            </p>
            <p className="mt-1 text-sm text-stone">
              Send us the product names and models you are interested in.
            </p>
          </div>
          <WhatsAppButton href={whatsappUrl} label="WhatsApp enquiry" />
        </div>
      </main>
    </div>
  );
}

export interface ShowroomExperienceProps {
  products: Product[];
  heroProduct: Product | null;
  settings: SiteSettings;
  initialSection?: ShowroomSectionId | null;
  demoMode: boolean;
}

export function ShowroomExperience({
  products,
  heroProduct,
  settings,
  initialSection = null,
  demoMode,
}: ShowroomExperienceProps) {
  const [player] = useState<PlayerState>(() => createPlayerState());
  const [entered, setEntered] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("3d");
  const [activeAnchor, setActiveAnchor] = useState<SectionAnchor["id"]>(
    initialSection ?? "entrance",
  );

  const quality = useDeviceQuality();
  const isTouch = useIsTouchDevice();
  const webgl = useWebGLSupport();

  useEffect(() => {
    if (view !== "3d" || !entered) return;

    const update = () => setActiveAnchor(locationFor(player.x, player.z));
    update();
    const interval = window.setInterval(update, 400);
    return () => window.clearInterval(interval);
  }, [entered, player, view]);

  const startShowroom = useCallback(() => {
    if (initialSection) {
      const anchor = SECTION_ANCHORS.find((item) => item.id === initialSection);
      if (anchor) teleportPlayer(player, anchor.x, anchor.z, anchor.yaw);
    }
    setEntered(true);
    setHelpOpen(false);
  }, [initialSection, player]);

  const goTo = useCallback(
    (id: SectionAnchor["id"]) => {
      const anchor = SECTION_ANCHORS.find((item) => item.id === id);
      if (!anchor) return;

      setSelected(null);
      setHoveredId(null);
      setHelpOpen(false);
      setEntered(true);
      setView("3d");
      teleportPlayer(player, anchor.x, anchor.z, anchor.yaw);
      setActiveAnchor(id);
    },
    [player],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.code === "Escape") {
        if (selected) setSelected(null);
        else if (helpOpen) setHelpOpen(false);
        return;
      }

      if (
        event.code === "KeyR" &&
        entered &&
        view === "3d" &&
        !selected &&
        !helpOpen
      ) {
        resetPlayer(player);
        setActiveAnchor("entrance");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered, helpOpen, player, selected, view]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(settings), [settings]);
  const showControls = entered && view === "3d" && !selected && !helpOpen;
  const activeLabel = LOCATION_LABELS[activeAnchor];

  if (view === "list" || webgl === "unsupported") {
    return (
      <CatalogueView
        products={products}
        settings={settings}
        reason={webgl === "unsupported" ? "unsupported" : "chosen"}
        onEnter3D={
          webgl === "unsupported"
            ? null
            : () => {
                setView("3d");
              }
        }
      />
    );
  }

  return (
    <div className="relative h-[100dvh] w-full touch-none overflow-hidden bg-[#0c2135]">
      {entered ? (
        <div className="absolute inset-0">
          <ShowroomScene
            products={products}
            heroProduct={heroProduct}
            player={player}
            quality={quality}
            selectedId={selected?.id ?? null}
            hoveredId={hoveredId}
            controlsEnabled={showControls}
            onSelect={(product) => {
              setSelected(product);
              setHoveredId(null);
            }}
            onHover={setHoveredId}
            onReady={() => setSceneReady(true)}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 24% 18%, rgba(217,119,63,0.24), transparent 42%), radial-gradient(circle at 78% 82%, rgba(196,154,90,0.18), transparent 44%), linear-gradient(120deg, #0c2135, #173b5c 55%, #0c2135)",
          }}
          aria-hidden="true"
        />
      )}

      {entered && !sceneReady && <SceneLoading />}

      {!entered && (
        <EntranceScreen
          productCount={products.length}
          demoMode={demoMode}
          touch={isTouch}
          onStart={startShowroom}
          onBrowse={() => setView("list")}
          onJump={goTo}
        />
      )}

      {entered && (
        <>
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 bg-gradient-to-b from-black/45 to-transparent p-2.5 pb-8 sm:p-4 sm:pb-10">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-cream/12 bg-navy/70 py-1.5 pl-2 pr-3.5 backdrop-blur-md">
              <Logo variant="light" compact />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-[0.56rem] font-bold uppercase tracking-[0.2em] text-cream/45">
                  You are in
                </span>
                <span className="max-w-[11rem] truncate text-[0.72rem] font-semibold text-cream">
                  {activeLabel}
                </span>
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/15 bg-navy/70 px-3 text-[0.68rem] font-bold text-cream backdrop-blur-md transition-colors hover:border-cream/40 sm:px-4"
                aria-label="Open showroom help"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setView("list");
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/15 bg-navy/70 px-3 text-[0.68rem] font-bold text-cream backdrop-blur-md transition-colors hover:border-cream/40 sm:px-4"
                aria-label="Browse showroom as a catalogue"
              >
                <Grid2X2 className="h-4 w-4" />
                <span className="hidden sm:inline">Catalogue</span>
              </button>
              <Link
                href="/"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/15 bg-navy/70 px-3 text-[0.68rem] font-bold text-cream backdrop-blur-md transition-colors hover:border-cream/40 sm:px-4"
                aria-label="Exit the showroom to the main site"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </Link>
            </div>
          </header>

          <nav
            aria-label="Jump to a showroom zone"
            className="absolute inset-x-0 top-[4.4rem] z-20 px-3 sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:top-auto sm:max-w-[calc(100vw-24rem)] sm:-translate-x-1/2 sm:px-0"
          >
            <div className="rounded-full border border-cream/10 bg-navy/55 p-1 backdrop-blur-md">
              <SectionNav active={activeAnchor} onGo={goTo} />
            </div>
          </nav>

          {isTouch && (
            <div className="absolute bottom-5 left-4 z-20">
              <Joystick player={player} disabled={!showControls} />
            </div>
          )}

          <div className="absolute bottom-4 right-3 z-20 w-[8.8rem] sm:bottom-5 sm:right-5 sm:w-[12.5rem]">
            <div className="overflow-hidden rounded-2xl border border-cream/15 bg-navy/70 p-1.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between px-1.5 pb-1.5 pt-0.5">
                <span className="text-[0.54rem] font-bold uppercase tracking-[0.16em] text-cream/55">
                  Showroom map
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              </div>
              <MiniMap
                player={player}
                className="h-[6.4rem] w-full overflow-hidden rounded-xl bg-[#f6eddf] sm:h-[8.6rem]"
              />
              <button
                type="button"
                onClick={() => goTo("entrance")}
                className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cream/12 bg-cream/5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-cream/75 transition-colors hover:border-ember/60 hover:text-cream"
              >
                <RotateCcw className="h-3 w-3" />
                Entrance
              </button>
            </div>
          </div>

          {!isTouch && (
            <div className="pointer-events-none absolute bottom-5 left-5 z-20 hidden max-w-[15rem] items-center gap-2 rounded-full border border-cream/10 bg-navy/55 px-3.5 py-2 text-[0.64rem] font-medium text-cream/70 backdrop-blur-md md:flex">
              <LocateFixed className="h-3.5 w-3.5 text-ember-soft" />
              <span>
                <span className="font-bold text-cream">WASD</span> walk · drag
                to look · click a product
              </span>
            </div>
          )}

          <span className="sr-only" aria-live="polite">
            Current location: {activeLabel}
          </span>

          {selected && (
            <ProductPanel
              product={selected}
              settings={settings}
              onClose={() => setSelected(null)}
              className="fixed inset-x-3 bottom-3 z-40 max-h-[74dvh] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-[4.6rem] sm:max-h-[calc(100dvh-6rem)] sm:w-[22.5rem]"
            />
          )}

          {helpOpen && (
            <HelpPanel touch={isTouch} onClose={() => setHelpOpen(false)} />
          )}
        </>
      )}

      {!entered && view === "3d" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-cream/10 bg-navy/55 px-4 py-2 text-[0.62rem] font-semibold text-cream/60 backdrop-blur-md">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-ember-soft" />
              {demoMode
                ? "Preview showroom · sample displays"
                : "Step inside and explore at your own pace"}
            </span>
            <a
              href={whatsappUrl ?? "/#contact"}
              {...(whatsappUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center gap-1 rounded-full bg-ember px-3 py-1.5 text-[0.62rem] font-bold text-white transition-colors hover:bg-ember-dark"
            >
              Enquire
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
