"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.message };
  }

  const user = await getAdminUser();
  if (!user) {
    await supabase.auth.signOut();
    return { error: "This account is not an admin." };
  }

  return { redirect: "/admin/dashboard" };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin");
}

const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  model_number: z.string().trim().max(120).default(""),
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().trim().max(4000).optional().default(""),
  specifications: z.string().optional().default(""),
  images: z.string().optional().default(""),
  price: z.string().optional().default(""),
  stock_status: z.enum(["in_stock", "low_stock", "out_of_stock", "enquire"]),
  is_featured: z.boolean().optional().default(false),
  showroom_section: z
    .enum(["left", "right", "centre", "back"])
    .nullable()
    .optional(),
  status: z.enum(["published", "draft"]),
});

function parseSpecifications(value: string) {
  const result: Record<string, string> = {};
  for (const line of value.split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.includes(":") ? ":" : trimmed.includes("=") ? "=" : null;
    if (!separator) continue;
    const [key, ...rest] = trimmed.split(separator);
    const cleanKey = key.trim();
    const cleanValue = rest.join(separator).trim();
    if (cleanKey && cleanValue) result[cleanKey] = cleanValue;
  }
  return result;
}

function parseImages(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function requireAdmin() {
  if (!isSupabaseConfigured) return null;
  const user = await getAdminUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  return { user, supabase };
}

export async function createProduct(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Not authorized." };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    model_number: formData.get("model_number") ?? "",
    category_id: formData.get("category_id") || null,
    description: formData.get("description") ?? "",
    specifications: formData.get("specifications") ?? "",
    images: formData.get("images") ?? "",
    price: formData.get("price") ?? "",
    stock_status: formData.get("stock_status"),
    is_featured: formData.get("is_featured") === "on",
    showroom_section: formData.get("showroom_section") || null,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.name);
  const images = parseImages(data.images);
  const uploaded = await uploadProductImages(ctx.supabase, formData);
  const allImages = [...images, ...uploaded];

  let slug = baseSlug;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const { data: existing } = await ctx.supabase
      .from("products")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!existing) {
      slug = candidate;
      break;
    }
  }

  const { error } = await ctx.supabase.from("products").insert({
    name: data.name,
    slug,
    model_number: data.model_number,
    category_id: data.category_id || null,
    description: data.description || null,
    specifications: parseSpecifications(data.specifications),
    images: allImages,
    price: data.price ? Number(data.price) : null,
    stock_status: data.stock_status,
    is_featured: data.is_featured,
    showroom_section: data.showroom_section || null,
    showroom_position: null,
    status: data.status,
  });

  if (error) {
    console.error("[admin] create product:", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/categories");
  revalidatePath("/showroom");
  return { ok: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Not authorized." };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    model_number: formData.get("model_number") ?? "",
    category_id: formData.get("category_id") || null,
    description: formData.get("description") ?? "",
    specifications: formData.get("specifications") ?? "",
    images: formData.get("images") ?? "",
    price: formData.get("price") ?? "",
    stock_status: formData.get("stock_status"),
    is_featured: formData.get("is_featured") === "on",
    showroom_section: formData.get("showroom_section") || null,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const data = parsed.data;
  const images = parseImages(data.images);
  const uploaded = await uploadProductImages(ctx.supabase, formData);
  const allImages = [...images, ...uploaded];

  const update: Record<string, unknown> = {
    name: data.name,
    slug: slugify(data.name),
    model_number: data.model_number,
    category_id: data.category_id || null,
    description: data.description || null,
    specifications: parseSpecifications(data.specifications),
    stock_status: data.stock_status,
    is_featured: data.is_featured,
    showroom_section: data.showroom_section || null,
    status: data.status,
  };

  if (allImages.length > 0) update.images = allImages;
  if (data.price) update.price = Number(data.price);
  else update.price = null;

  const { error } = await ctx.supabase.from("products").update(update).eq("id", id);
  if (error) {
    console.error("[admin] update product:", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products`);
  revalidatePath("/showroom");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Not authorized." };

  const { error } = await ctx.supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/showroom");
  return { ok: true };
}

export async function updateSettings(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Not authorized." };

  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim();
  const { error } = await ctx.supabase
    .from("site_settings")
    .update({
      business_name: String(formData.get("business_name") ?? "").trim() || "Liberty Enterprises",
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      whatsapp_number: whatsappNumber,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || "Chennai",
      state: String(formData.get("state") ?? "").trim() || "Tamil Nadu",
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function updateEnquiryStatus(id: string, status: string) {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Not authorized." };

  const { error } = await ctx.supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

async function uploadProductImages(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> & {},
  formData: FormData,
) {
  if (!supabase) return [];
  const files = formData.getAll("image_files").filter(
    (item): item is File => item instanceof File && item.size > 0,
  );
  if (files.length === 0) return [];

  const urls: string[] = [];
  for (const file of files) {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("[admin] upload:", error.message);
      continue;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    if (data?.publicUrl) urls.push(data.publicUrl);
  }
  return urls;
}
