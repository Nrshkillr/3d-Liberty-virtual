import type { Category, Product, SiteSettings } from "@/lib/types";

/**
 * Preview catalogue.
 *
 * These records are only used when Supabase is not configured. They are clearly
 * marked as demo data (`is_demo: true`) and contain no prices, stock guarantees
 * or specifications. Replace them with real catalogue entries in /admin.
 */
const CREATED = "2026-01-01T00:00:00.000Z";

export const demoCategories: Category[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    name: "Baby Walkers",
    slug: "baby-walkers",
    description:
      "Activity walkers and foldable walkers for growing babies. Ask us about current wholesale packs and colours.",
    image_url: null,
    sort_order: 1,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    name: "Kids Riding Toys",
    slug: "kids-riding-toys",
    description:
      "Push-along cars, scooters and ride-on toys for toddlers and young children.",
    image_url: null,
    sort_order: 2,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    name: "Battery-Operated Cars",
    slug: "battery-operated-cars",
    description:
      "Rechargeable ride-on cars for kids. Enquire for models currently available in the showroom.",
    image_url: null,
    sort_order: 3,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    name: "Battery Bikes",
    slug: "battery-bikes",
    description:
      "Battery-operated bikes and ride-on two-wheelers for kids.",
    image_url: null,
    sort_order: 4,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    name: "Baby Swings",
    slug: "baby-swings",
    description:
      "Indoor and wooden baby swings designed to soothe and entertain little ones.",
    image_url: null,
    sort_order: 5,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    name: "Baby Cradles",
    slug: "baby-cradles",
    description:
      "Rocking cradles and compact baby sleep solutions.",
    image_url: null,
    sort_order: 6,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000007",
    name: "Baby Jhulas",
    slug: "baby-jhulas",
    description:
      "Traditional hanging jhulas for babies, available in a range of styles.",
    image_url: null,
    sort_order: 7,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000008",
    name: "Soft Toys",
    slug: "soft-toys",
    description:
      "Plush bears, companions and soft toy sets for gifting and retail.",
    image_url: null,
    sort_order: 8,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000009",
    name: "Kids Tent Houses",
    slug: "kids-tent-houses",
    description:
      "Play tents and indoor play houses for imaginative play.",
    image_url: null,
    sort_order: 9,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000010",
    name: "Baby Gift Sets",
    slug: "baby-gift-sets",
    description:
      "Ready-to-gift newborn and baby sets for retail and family gifting.",
    image_url: null,
    sort_order: 10,
    created_at: CREATED,
  },
  {
    id: "a0000000-0000-4000-8000-000000000011",
    name: "Baby Accessories",
    slug: "baby-accessories",
    description:
      "Feeding, care and everyday baby accessories for your store shelf.",
    image_url: null,
    sort_order: 11,
    created_at: CREATED,
  },
];

function demoProduct(
  index: number,
  data: Pick<
    Product,
    "name" | "slug" | "category_id" | "showroom_section" | "is_featured"
  > & { description: string; model: string },
): Product {
  return {
    id: `b0000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    category_id: data.category_id,
    name: data.name,
    slug: data.slug,
    model_number: data.model,
    description: data.description,
    specifications: {},
    images: [],
    price: null,
    stock_status: "enquire",
    is_featured: data.is_featured,
    showroom_section: data.showroom_section,
    showroom_position: null,
    status: "published",
    is_demo: true,
    created_at: CREATED,
    updated_at: CREATED,
  };
}

export const demoProducts: Product[] = [
  demoProduct(1, {
    name: "Foldable Activity Baby Walker",
    slug: "foldable-activity-baby-walker",
    category_id: "a0000000-0000-4000-8000-000000000001",
    showroom_section: "left",
    is_featured: false,
    model: "SAMPLE-WLK-01",
    description:
      "An activity walker for everyday home use. Ask our team about the colours and wholesale packs currently available.",
  }),
  demoProduct(2, {
    name: "Musical Baby Walker with Tray",
    slug: "musical-baby-walker-with-tray",
    category_id: "a0000000-0000-4000-8000-000000000001",
    showroom_section: "left",
    is_featured: false,
    model: "SAMPLE-WLK-02",
    description:
      "A walker with a play tray for little hands. Contact us for current models and bulk pricing.",
  }),
  demoProduct(3, {
    name: "Adjustable Height Baby Walker",
    slug: "adjustable-height-baby-walker",
    category_id: "a0000000-0000-4000-8000-000000000001",
    showroom_section: "left",
    is_featured: false,
    model: "SAMPLE-WLK-03",
    description:
      "Height-adjustable walker designed to grow with your child. Availability on enquiry.",
  }),
  demoProduct(4, {
    name: "Baby Feeding Accessory Set",
    slug: "baby-feeding-accessory-set",
    category_id: "a0000000-0000-4000-8000-000000000011",
    showroom_section: "left",
    is_featured: false,
    model: "SAMPLE-ACC-01",
    description:
      "A coordinated feeding set for baby retailers. Ask us about pack sizes and colours.",
  }),
  demoProduct(5, {
    name: "Baby Care Essentials Kit",
    slug: "baby-care-essentials-kit",
    category_id: "a0000000-0000-4000-8000-000000000011",
    showroom_section: "left",
    is_featured: false,
    model: "SAMPLE-ACC-02",
    description:
      "Everyday baby care accessories for your store shelf. Wholesale details on request.",
  }),
  demoProduct(6, {
    name: "Push-Along Ride-On Car",
    slug: "push-along-ride-on-car",
    category_id: "a0000000-0000-4000-8000-000000000002",
    showroom_section: "right",
    is_featured: false,
    model: "SAMPLE-RID-01",
    description:
      "A push-along ride-on for toddlers. Ask our team about the ride-on range available this season.",
  }),
  demoProduct(7, {
    name: "Toddler Ride-On Scooter",
    slug: "toddler-ride-on-scooter",
    category_id: "a0000000-0000-4000-8000-000000000002",
    showroom_section: "right",
    is_featured: false,
    model: "SAMPLE-RID-02",
    description:
      "A compact ride-on scooter for young children. Colours and wholesale packs on enquiry.",
  }),
  demoProduct(8, {
    name: "Ride-On Jeep for Kids",
    slug: "ride-on-jeep-for-kids",
    category_id: "a0000000-0000-4000-8000-000000000002",
    showroom_section: "right",
    is_featured: false,
    model: "SAMPLE-RID-03",
    description:
      "A sturdy ride-on jeep for outdoor play. Reach out for the latest models in stock.",
  }),
  demoProduct(9, {
    name: "Battery-Operated Kids Car",
    slug: "battery-operated-kids-car",
    category_id: "a0000000-0000-4000-8000-000000000003",
    showroom_section: "right",
    is_featured: true,
    model: "SAMPLE-CAR-01",
    description:
      "A rechargeable ride-on car for kids. Contact our wholesale desk for current models, colours and availability.",
  }),
  demoProduct(10, {
    name: "Rechargeable Ride-On Car",
    slug: "rechargeable-ride-on-car",
    category_id: "a0000000-0000-4000-8000-000000000003",
    showroom_section: "right",
    is_featured: false,
    model: "SAMPLE-CAR-02",
    description:
      "A rechargeable car for little drivers. Prices and pack options on enquiry.",
  }),
  demoProduct(11, {
    name: "Battery-Operated Kids Bike",
    slug: "battery-operated-kids-bike",
    category_id: "a0000000-0000-4000-8000-000000000004",
    showroom_section: "right",
    is_featured: false,
    model: "SAMPLE-BIK-01",
    description:
      "A battery-operated bike for young riders. Ask us about the models currently on display.",
  }),
  demoProduct(12, {
    name: "Indoor Baby Swing",
    slug: "indoor-baby-swing",
    category_id: "a0000000-0000-4000-8000-000000000005",
    showroom_section: "centre",
    is_featured: false,
    model: "SAMPLE-SWG-01",
    description:
      "A gentle indoor swing for babies. Enquire about the swings available in our showroom.",
  }),
  demoProduct(13, {
    name: "Wooden Baby Swing Set",
    slug: "wooden-baby-swing-set",
    category_id: "a0000000-0000-4000-8000-000000000005",
    showroom_section: "centre",
    is_featured: false,
    model: "SAMPLE-SWG-02",
    description:
      "A wooden swing set with a traditional feel. Wholesale details available on request.",
  }),
  demoProduct(14, {
    name: "Rocking Baby Cradle",
    slug: "rocking-baby-cradle",
    category_id: "a0000000-0000-4000-8000-000000000006",
    showroom_section: "centre",
    is_featured: false,
    model: "SAMPLE-CRD-01",
    description:
      "A compact rocking cradle for the nursery. Ask our team about styles and finishes.",
  }),
  demoProduct(15, {
    name: "Hanging Baby Jhula",
    slug: "hanging-baby-jhula",
    category_id: "a0000000-0000-4000-8000-000000000007",
    showroom_section: "centre",
    is_featured: false,
    model: "SAMPLE-JHL-01",
    description:
      "A traditional hanging jhula for babies. Contact us for the sizes and fabric options available.",
  }),
  demoProduct(16, {
    name: "Plush Bear Soft Toy",
    slug: "plush-bear-soft-toy",
    category_id: "a0000000-0000-4000-8000-000000000008",
    showroom_section: "back",
    is_featured: false,
    model: "SAMPLE-STY-01",
    description:
      "A cuddly plush bear for gifting and retail. Ask about assorted sizes and carton quantities.",
  }),
  demoProduct(17, {
    name: "Soft Toy Gift Pair",
    slug: "soft-toy-gift-pair",
    category_id: "a0000000-0000-4000-8000-000000000008",
    showroom_section: "back",
    is_featured: false,
    model: "SAMPLE-STY-02",
    description:
      "A pair of soft toys ready for gifting. Wholesale availability on enquiry.",
  }),
  demoProduct(18, {
    name: "Kids Play Tent House",
    slug: "kids-play-tent-house",
    category_id: "a0000000-0000-4000-8000-000000000009",
    showroom_section: "back",
    is_featured: false,
    model: "SAMPLE-TNT-01",
    description:
      "A pop-up play tent for indoor adventures. Reach out for current prints and pack sizes.",
  }),
  demoProduct(19, {
    name: "Newborn Baby Gift Set",
    slug: "newborn-baby-gift-set",
    category_id: "a0000000-0000-4000-8000-000000000010",
    showroom_section: "back",
    is_featured: false,
    model: "SAMPLE-GFT-01",
    description:
      "A ready-to-gift newborn set for retail shelves. Ask us about the gift range on offer.",
  }),
];

export const defaultSettings: SiteSettings = {
  id: 1,
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: "",
  email: "",
  address_line1: "Sowcarpet",
  address_line2: "Chennai",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "",
  opening_hours: "",
  map_query: "Sowcarpet, Chennai, Tamil Nadu, India",
  instagram_url: "",
  updated_at: CREATED,
};
