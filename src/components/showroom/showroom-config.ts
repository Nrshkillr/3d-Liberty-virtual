import type { Product, ShowroomSectionId } from "@/lib/types";

export const ROOM = {
  width: 26,
  depth: 20,
  height: 4.4,
  halfWidth: 13,
  halfDepth: 10,
} as const;

export const WALK_BOUNDS = {
  minX: -11.85,
  maxX: 11.85,
  minZ: -8.9,
  maxZ: 9.35,
} as const;

export const SPAWN = { x: 0, z: 8.55, yaw: 0 } as const;
export const EYE_HEIGHT = 1.64;
export const PLAYER_RADIUS = 0.3;

export type SlotMount = "shelf" | "floor" | "table" | "hero";

export interface DisplaySlot {
  id: string;
  section: ShowroomSectionId;
  position: [number, number, number];
  rotationY: number;
  mount: SlotMount;
  scale: number;
}

export interface AssignedDisplay extends DisplaySlot {
  product: Product;
}

export const DISPLAY_SLOTS: Record<ShowroomSectionId, DisplaySlot[]> = {
  left: [
    {
      id: "left-wall-1",
      section: "left",
      position: [-12.72, 1.56, -4.25],
      rotationY: Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "left-wall-2",
      section: "left",
      position: [-12.72, 1.56, -2.75],
      rotationY: Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "left-wall-3",
      section: "left",
      position: [-12.72, 0.84, -4.25],
      rotationY: Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "left-wall-4",
      section: "left",
      position: [-12.72, 0.84, -2.75],
      rotationY: Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "left-gondola-1",
      section: "left",
      position: [-8.15, 1.12, -2.35],
      rotationY: Math.PI / 2,
      mount: "shelf",
      scale: 0.66,
    },
    {
      id: "left-table-1",
      section: "left",
      position: [-8.85, 0.92, 4.4],
      rotationY: 0.35,
      mount: "table",
      scale: 0.8,
    },
  ],
  right: [
    {
      id: "right-wall-1",
      section: "right",
      position: [12.72, 1.56, -1.6],
      rotationY: -Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "right-wall-2",
      section: "right",
      position: [12.72, 1.56, -0.1],
      rotationY: -Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "right-wall-3",
      section: "right",
      position: [12.72, 0.84, -1.6],
      rotationY: -Math.PI / 2,
      mount: "shelf",
      scale: 0.6,
    },
    {
      id: "right-plinth-1",
      section: "right",
      position: [8.4, 0.42, 3.1],
      rotationY: -0.45,
      mount: "floor",
      scale: 0.95,
    },
    {
      id: "right-plinth-2",
      section: "right",
      position: [10.15, 0.42, 0.55],
      rotationY: 0.35,
      mount: "floor",
      scale: 0.95,
    },
    {
      id: "right-plinth-3",
      section: "right",
      position: [8.4, 0.42, 6.25],
      rotationY: 0.1,
      mount: "floor",
      scale: 0.95,
    },
  ],
  centre: [
    {
      id: "centre-swing",
      section: "centre",
      position: [-1.9, 0.02, -2.75],
      rotationY: 0.2,
      mount: "floor",
      scale: 0.92,
    },
    {
      id: "centre-cradle",
      section: "centre",
      position: [2.05, 0.46, -1.0],
      rotationY: -0.4,
      mount: "floor",
      scale: 0.9,
    },
    {
      id: "centre-jhula",
      section: "centre",
      position: [0.4, 0.02, -4.65],
      rotationY: -0.15,
      mount: "floor",
      scale: 0.86,
    },
    {
      id: "centre-table",
      section: "centre",
      position: [2.7, 0.92, 2.45],
      rotationY: -0.55,
      mount: "table",
      scale: 0.7,
    },
  ],
  back: [
    {
      id: "back-cubby-1",
      section: "back",
      position: [-2.1, 1.58, -9.36],
      rotationY: 0,
      mount: "shelf",
      scale: 0.62,
    },
    {
      id: "back-cubby-2",
      section: "back",
      position: [0.6, 1.58, -9.36],
      rotationY: 0,
      mount: "shelf",
      scale: 0.62,
    },
    {
      id: "back-tent",
      section: "back",
      position: [-7.2, 0.02, -7.15],
      rotationY: 0.15,
      mount: "floor",
      scale: 1,
    },
    {
      id: "back-gift-table",
      section: "back",
      position: [7.1, 0.92, -7.15],
      rotationY: 0.1,
      mount: "table",
      scale: 0.78,
    },
  ],
};

export const HERO_SLOT: DisplaySlot = {
  id: "hero",
  section: "centre",
  position: [3.35, 0.98, 6.0],
  rotationY: -0.55,
  mount: "hero",
  scale: 1.05,
};

export interface Collider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export const COLLIDERS: Collider[] = [
  // Left wall shelving
  { minX: -13, maxX: -11.55, minZ: -5.5, maxZ: 0.9 },
  // Left gondola
  { minX: -9.6, maxX: -8.2, minZ: -4.0, maxZ: 0.7 },
  // Left display table
  { minX: -10.4, maxX: -7.3, minZ: 3.6, maxZ: 5.2 },
  // Right wall shelving
  { minX: 11.55, maxX: 13, minZ: -2.5, maxZ: 2.1 },
  // Right pedestals
  { minX: 7.3, maxX: 9.5, minZ: 2.1, maxZ: 4.1 },
  { minX: 9.1, maxX: 11.2, minZ: -0.4, maxZ: 1.5 },
  { minX: 7.3, maxX: 9.5, minZ: 5.3, maxZ: 7.2 },
  // Central swing
  { minX: -2.9, maxX: -0.9, minZ: -3.5, maxZ: -2.0 },
  // Cradle pedestal
  { minX: 1.35, maxX: 2.75, minZ: -1.7, maxZ: -0.3 },
  // Jhula
  { minX: -0.4, maxX: 1.2, minZ: -5.4, maxZ: -3.9 },
  // Central table
  { minX: 1.95, maxX: 3.45, minZ: 1.75, maxZ: 3.15 },
  // Hero plinth
  { minX: 2.15, maxX: 4.55, minZ: 4.85, maxZ: 7.15 },
  // Back cubbies
  { minX: -4.3, maxX: 4.3, minZ: -10, maxZ: -8.85 },
  // Tent
  { minX: -8.25, maxX: -6.15, minZ: -8.15, maxZ: -6.15 },
  // Gift table
  { minX: 5.7, maxX: 8.5, minZ: -7.9, maxZ: -6.4 },
  // Counter
  { minX: -10.65, maxX: -7.15, minZ: 6.55, maxZ: 7.95 },
  // Bench
  { minX: 9.4, maxX: 11.7, minZ: 7.95, maxZ: 9.0 },
  // Plants
  { minX: -12.7, maxX: -11.7, minZ: 8.2, maxZ: 9.2 },
  { minX: 11.4, maxX: 12.6, minZ: 3.2, maxZ: 4.3 },
];

export interface SectionAnchor {
  id: ShowroomSectionId | "entrance" | "counter";
  label: string;
  x: number;
  z: number;
  yaw: number;
}

export const SECTION_ANCHORS: SectionAnchor[] = [
  { id: "entrance", label: "Entrance", x: 0, z: 8.55, yaw: 0 },
  { id: "left", label: "Walkers", x: -4.7, z: 3.3, yaw: Math.PI / 2 },
  { id: "centre", label: "Swings", x: 0, z: 3.4, yaw: 0 },
  { id: "right", label: "Ride-ons", x: 5.1, z: 2.6, yaw: -Math.PI / 2 },
  { id: "back", label: "Gifts", x: 0, z: -5.5, yaw: 0 },
  { id: "counter", label: "Enquiries", x: -5.0, z: 6.0, yaw: Math.PI / 2 },
];

export function sectionForPosition(x: number, z: number): ShowroomSectionId {
  if (z < -5.4) return "back";
  if (x < -4.4) return "left";
  if (x > 4.4) return "right";
  return "centre";
}

export function assignProducts(
  products: Product[],
  heroProduct: Product | null,
): AssignedDisplay[] {
  const bySection = new Map<ShowroomSectionId, Product[]>([
    ["left", []],
    ["right", []],
    ["centre", []],
    ["back", []],
  ]);

  for (const product of products) {
    if (!product.showroom_section) continue;
    if (heroProduct && product.id === heroProduct.id) continue;
    bySection.get(product.showroom_section)?.push(product);
  }

  const displays: AssignedDisplay[] = [];

  (Object.keys(DISPLAY_SLOTS) as ShowroomSectionId[]).forEach((section) => {
    const slots = DISPLAY_SLOTS[section];
    const sectionProducts = bySection.get(section) ?? [];

    sectionProducts.slice(0, slots.length).forEach((product, index) => {
      let slot = slots[index];
      const position = product.showroom_position;

      if (position && typeof position.slot === "number" && slots[position.slot]) {
        slot = slots[position.slot];
      }

      const hasOverride =
        position &&
        typeof position.x === "number" &&
        typeof position.z === "number";

      displays.push({
        ...slot,
        id: `${slot.id}-${product.id.slice(0, 8)}`,
        position: hasOverride
          ? [
              position.x as number,
              typeof position.y === "number" ? position.y : slot.position[1],
              position.z as number,
            ]
          : slot.position,
        rotationY:
          hasOverride && typeof position.rotation === "number"
            ? position.rotation
            : slot.rotationY,
        product,
      });
    });
  });

  if (heroProduct) {
    displays.push({ ...HERO_SLOT, product: heroProduct });
  }

  return displays;
}

export const MAP_FURNITURE = [
  { x: -12.9, z: -2.3, w: 1.3, d: 6.4, fill: "#c8a57f", opacity: 0.9 },
  { x: -8.9, z: -1.65, w: 1.4, d: 4.7, fill: "#c8a57f", opacity: 0.9 },
  { x: -8.85, z: 4.4, w: 3, d: 1.5, fill: "#c8a57f", opacity: 0.9 },
  { x: 12.6, z: -0.2, w: 0.9, d: 4.6, fill: "#c8a57f", opacity: 0.9 },
  { x: 8.4, z: 3.1, w: 1.9, d: 1.7, fill: "#d6b48f", opacity: 0.9 },
  { x: 10.15, z: 0.55, w: 1.9, d: 1.7, fill: "#d6b48f", opacity: 0.9 },
  { x: 8.4, z: 6.25, w: 1.9, d: 1.7, fill: "#d6b48f", opacity: 0.9 },
  { x: -1.9, z: -2.75, w: 2, d: 1.4, fill: "#b9b7a4", opacity: 0.9 },
  { x: 2.05, z: -1.0, w: 1.4, d: 1.2, fill: "#d6b48f", opacity: 0.9 },
  { x: 0.4, z: -4.65, w: 1.4, d: 1.3, fill: "#b9b7a4", opacity: 0.9 },
  { x: 2.7, z: 2.45, w: 1.5, d: 1.3, fill: "#c8a57f", opacity: 0.9 },
  { x: 3.35, z: 6.0, w: 2.1, d: 2.1, fill: "#e8c9a8", opacity: 0.95 },
  { x: 0, z: -9.5, w: 8.6, d: 0.9, fill: "#c8a57f", opacity: 0.9 },
  { x: -7.2, z: -7.15, w: 2, d: 2, fill: "#c6cbb4", opacity: 0.9 },
  { x: 7.1, z: -7.15, w: 2.6, d: 1.4, fill: "#c8a57f", opacity: 0.9 },
  { x: -8.9, z: 7.25, w: 3.4, d: 1.3, fill: "#1d3f5e", opacity: 0.95 },
  { x: 10.55, z: 8.5, w: 2.2, d: 0.8, fill: "#b9b7a4", opacity: 0.9 },
] as const;
