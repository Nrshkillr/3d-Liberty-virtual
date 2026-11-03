import { demoCategories, demoProducts, defaultSettings } from "@/data/demo-catalogue";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  Category,
  Product,
  ShowroomSectionId,
  SiteSettings,
  StockStatus,
} from "@/lib/types";

type CategoryWithCount = Category & { product_count: number };

export interface ProductQuery {
  categorySlug?: string;
  search?: string;
  stock?: StockStatus | "all";
  featured?: boolean;
  section?: ShowroomSectionId;
  limit?: number;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

function asSpecifications(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([key, v]) => [key, String(v)]),
    );
  }
  return {};
}

export function normalizeProduct(row: Record<string, unknown>): Product {
  const rawCategory = row.category;
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

  return {
    id: String(row.id),
    category_id: row.category_id ? String(row.category_id) : null,
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    model_number: String(row.model_number ?? ""),
    description: row.description ? String(row.description) : null,
    specifications: asSpecifications(row.specifications),
    images: asStringArray(row.images),
    price:
      row.price === null || row.price === undefined ? null : Number(row.price),
    stock_status: (row.stock_status as StockStatus) ?? "enquire",
    is_featured: Boolean(row.is_featured),
    showroom_section: (row.showroom_section as ShowroomSectionId) ?? null,
    showroom_position:
      row.showroom_position && typeof row.showroom_position === "object"
        ? (row.showroom_position as Product["showroom_position"])
        : null,
    status: (row.status as Product["status"]) ?? "published",
    is_demo: Boolean(row.is_demo),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
    category: category
      ? {
          id: String((category as Record<string, unknown>).id),
          name: String((category as Record<string, unknown>).name),
          slug: String((category as Record<string, unknown>).slug),
        }
      : null,
  };
}

function normalizeCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: row.description ? String(row.description) : null,
    image_url: row.image_url ? String(row.image_url) : null,
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function filterDemoProducts(query: ProductQuery): Product[] {
  const category = query.categorySlug
    ? demoCategories.find((item) => item.slug === query.categorySlug)
    : null;

  let products = [...demoProducts];

  if (query.categorySlug) {
    products = products.filter((p) => p.category_id === category?.id);
  }
  if (query.section) {
    products = products.filter((p) => p.showroom_section === query.section);
  }
  if (query.featured) {
    products = products.filter((p) => p.is_featured);
  }
  if (query.stock && query.stock !== "all") {
    products = products.filter((p) => p.stock_status === query.stock);
  }
  if (query.search) {
    const search = query.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.model_number.toLowerCase().includes(search) ||
        (p.description ?? "").toLowerCase().includes(search),
    );
  }

  products.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return query.limit ? products.slice(0, query.limit) : products;
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return [...demoCategories].sort((a, b) => a.sort_order - b.sort_order);
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[catalogue] categories:", error.message);
    throw new Error("Unable to load categories right now.");
  }

  return (data ?? []).map(normalizeCategory);
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return categories.map((category) => ({
    ...category,
    product_count: products.filter((p) => p.category_id === category.id).length,
  }));
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return filterDemoProducts(query);
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  let categoryId: string | null = null;
  if (query.categorySlug) {
    const categories = await getCategories();
    categoryId =
      categories.find((category) => category.slug === query.categorySlug)?.id ??
      null;
    if (!categoryId) return [];
  }

  let request = supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("status", "published");

  if (categoryId) request = request.eq("category_id", categoryId);
  if (query.section) request = request.eq("showroom_section", query.section);
  if (query.featured) request = request.eq("is_featured", true);
  if (query.stock && query.stock !== "all") {
    request = request.eq("stock_status", query.stock);
  }
  if (query.search) {
    const safeSearch = query.search.replace(/[%,()]/g, " ").trim();
    if (safeSearch) {
      request = request.or(
        `name.ilike.%${safeSearch}%,model_number.ilike.%${safeSearch}%`,
      );
    }
  }

  request = request
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (query.limit) request = request.limit(query.limit);

  const { data, error } = await request;

  if (error) {
    console.error("[catalogue] products:", error.message);
    throw new Error("Unable to load products right now.");
  }

  return (data ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[catalogue] product:", error.message);
    throw new Error("Unable to load this product right now.");
  }

  return data ? normalizeProduct(data as Record<string, unknown>) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[catalogue] product by id:", error.message);
    return null;
  }

  return data ? normalizeProduct(data as Record<string, unknown>) : null;
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  limit = 3,
): Promise<Product[]> {
  if (!categoryId) return [];
  const products = await getProducts();
  return products
    .filter((product) => product.category_id === categoryId && product.id !== excludeId)
    .slice(0, limit);
}

export async function getShowroomProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.showroom_section !== null);
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return { ...defaultSettings };

  const supabase = getSupabasePublicClient();
  if (!supabase) return { ...defaultSettings };

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[settings] read:", error.message);
    return { ...defaultSettings };
  }

  if (!data) return { ...defaultSettings };

  return {
    ...defaultSettings,
    ...Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        value ?? "",
      ]),
    ),
    id: 1,
    updated_at: String(data.updated_at ?? defaultSettings.updated_at),
    whatsapp_number:
      String(data.whatsapp_number ?? "").trim() ||
      defaultSettings.whatsapp_number,
  };
}
