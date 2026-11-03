export type ShowroomSectionId = "left" | "right" | "centre" | "back";

export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "enquire";

export type ProductStatus = "published" | "draft";

export type EnquiryStatus = "new" | "contacted" | "closed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface ShowroomPosition {
  x?: number;
  y?: number;
  z?: number;
  rotation?: number;
  slot?: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  model_number: string;
  description: string | null;
  specifications: Record<string, string>;
  images: string[];
  price: number | null;
  stock_status: StockStatus;
  is_featured: boolean;
  showroom_section: ShowroomSectionId | null;
  showroom_position: ShowroomPosition | null;
  status: ProductStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
}

export interface SiteSettings {
  id: number;
  whatsapp_number: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  opening_hours: string;
  map_query: string;
  instagram_url: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  product_id: string | null;
  customer_name: string;
  phone: string;
  message: string | null;
  enquiry_status: EnquiryStatus;
  created_at: string;
  product?: Pick<Product, "id" | "name" | "slug" | "model_number"> | null;
}

export interface EnquiryInput {
  product_id?: string | null;
  customer_name: string;
  phone: string;
  message?: string;
  website?: string;
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Limited stock",
  out_of_stock: "Out of stock",
  enquire: "Enquire for availability",
};

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};
