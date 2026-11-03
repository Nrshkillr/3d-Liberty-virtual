import { notFound } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data/catalogue";
import { normalizeProduct } from "@/lib/data/catalogue";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to manage products.</p>;

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p className="text-stone">Supabase is not configured.</p>;

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const product = normalizeProduct(data as Record<string, unknown>);
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-navy">
        Edit product
      </h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
