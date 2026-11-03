import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { normalizeProduct } from "@/lib/data/catalogue";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to manage products.</p>;

  let products: Product[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(id,name,slug)")
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("[admin] products:", error.message);
      } else {
        products = (data ?? []).map((row) =>
          normalizeProduct(row as Record<string, unknown>),
        );
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">Products</h1>
          <p className="mt-1 text-sm text-stone">
            {products.length} products in the catalogue.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-line bg-shell p-8 text-center">
          <p className="font-display text-xl font-semibold text-navy">No products yet</p>
          <p className="mt-2 text-sm text-stone">
            Create your first product to populate the catalogue and showroom.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-shell">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream/60 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-navy">{product.name}</td>
                  <td className="px-4 py-3 text-stone">{product.model_number || "—"}</td>
                  <td className="px-4 py-3 text-stone">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.status === "published"
                          ? "rounded-full bg-emerald-50 px-2 py-1 text-[0.62rem] font-bold uppercase text-emerald-700"
                          : "rounded-full bg-stone-100 px-2 py-1 text-[0.62rem] font-bold uppercase text-stone-600"
                      }
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone">{product.stock_status}</td>
                  <td className="px-4 py-3 text-stone">{product.showroom_section ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-ember-dark hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
