import type { Metadata } from "next";
import { ShowroomExperience } from "@/components/showroom/ShowroomExperience";
import { getSettings, getShowroomProducts } from "@/lib/data/catalogue";
import { isDemoMode } from "@/lib/supabase/config";
import type { ShowroomSectionId } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Virtual 3D Showroom",
  description:
    "Walk through the Liberty Enterprises 3D showroom in Sowcarpet, Chennai. Explore baby walkers, ride-ons, battery vehicles, swings, cradles, soft toys and gift sets, then enquire on WhatsApp.",
  alternates: {
    canonical: "/showroom",
  },
  openGraph: {
    title: "Liberty Enterprises Virtual 3D Showroom",
    description:
      "Step inside our 3D baby and kids wholesale showroom from anywhere. Explore the collection and send a wholesale enquiry.",
    url: "/showroom",
  },
};

const SECTION_IDS = new Set<ShowroomSectionId>(["left", "right", "centre", "back"]);

export default async function ShowroomPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string | string[] }>;
}) {
  const [params, products, settings] = await Promise.all([
    searchParams,
    getShowroomProducts(),
    getSettings(),
  ]);

  const rawSection = Array.isArray(params.section)
    ? params.section[0]
    : params.section;
  const initialSection =
    rawSection && SECTION_IDS.has(rawSection as ShowroomSectionId)
      ? (rawSection as ShowroomSectionId)
      : null;

  const heroProduct =
    products.find((product) => product.is_featured) ?? products[0] ?? null;

  return (
    <ShowroomExperience
      products={products}
      heroProduct={heroProduct}
      settings={settings}
      initialSection={initialSection}
      demoMode={isDemoMode}
    />
  );
}
