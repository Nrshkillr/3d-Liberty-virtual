import type { ShowroomSectionId } from "@/lib/types";

export const SITE = {
  name: "Liberty Enterprises",
  shortName: "Liberty",
  tagline: "Baby & kids wholesale showroom",
  description:
    "Wholesale baby and kids products from Sowcarpet, Chennai — walkers, ride-ons, battery vehicles, swings, cradles, soft toys, tents and gift sets.",
  area: "Sowcarpet",
  city: "Chennai",
  state: "Tamil Nadu",
  country: "India",
  mapQuery: "Sowcarpet, Chennai, Tamil Nadu, India",
  domain: "libertyenterprises.online",
} as const;

export const NAV_LINKS = [
  { href: "/showroom", label: "Virtual Showroom" },
  { href: "/categories", label: "Products" },
  { href: "/#wholesale", label: "Wholesale" },
  { href: "/#visit", label: "Visit Us" },
] as const;

export const SHOWROOM_SECTIONS: {
  id: ShowroomSectionId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "left",
    label: "Baby Walkers & Accessories",
    shortLabel: "Walkers",
    description: "Walkers, feeding sets and everyday baby essentials.",
    icon: "walker",
    color: "#d9773f",
  },
  {
    id: "right",
    label: "Ride-Ons & Battery Vehicles",
    shortLabel: "Ride-Ons",
    description: "Riding toys, battery cars and bikes for little drivers.",
    icon: "car",
    color: "#2c5578",
  },
  {
    id: "centre",
    label: "Swings, Cradles & Jhulas",
    shortLabel: "Swings",
    description: "Soothing swings, cradles and traditional jhulas.",
    icon: "swing",
    color: "#7c8b75",
  },
  {
    id: "back",
    label: "Soft Toys, Tents & Gifts",
    shortLabel: "Gifts",
    description: "Plush toys, play tents and ready-to-gift sets.",
    icon: "gift",
    color: "#b85f2b",
  },
];

export const CATEGORY_ART: Record<
  string,
  { tint: string; ink: string; glyph: string }
> = {
  "baby-walkers": { tint: "#f4ddca", ink: "#b85f2b", glyph: "walker" },
  "kids-riding-toys": { tint: "#dbe7ef", ink: "#2c5578", glyph: "car" },
  "battery-operated-cars": { tint: "#d8e4ec", ink: "#173b5c", glyph: "car" },
  "battery-bikes": { tint: "#dfe8e0", ink: "#4e6a55", glyph: "bike" },
  "baby-swings": { tint: "#e7e9dd", ink: "#6b7a63", glyph: "swing" },
  "baby-cradles": { tint: "#f3e4df", ink: "#a5695c", glyph: "cradle" },
  "baby-jhulas": { tint: "#efe7d8", ink: "#8a6244", glyph: "swing" },
  "soft-toys": { tint: "#f4e5cf", ink: "#9a6b3f", glyph: "plush" },
  "kids-tent-houses": { tint: "#e3e8d8", ink: "#5e7251", glyph: "tent" },
  "baby-gift-sets": { tint: "#f5e0dd", ink: "#a5625a", glyph: "gift" },
  "baby-accessories": { tint: "#ece4d7", ink: "#7a674c", glyph: "bottle" },
};

export const FALLBACK_ART = {
  tint: "#efe7d8",
  ink: "#173b5c",
  glyph: "star",
};
