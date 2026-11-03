import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to manage categories.</p>;

  let categories: Array<{ id: string; name: string; slug: string; sort_order: number; description: string | null }> = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,sort_order,description")
        .order("sort_order", { ascending: true });
      categories = (data ?? []) as typeof categories;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Categories</h1>
        <p className="mt-1 text-sm text-stone">
          {categories.length} categories. Add or edit categories directly in Supabase for now;
          product assignment happens on each product.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-line bg-shell p-8 text-center">
          <p className="font-display text-xl font-semibold text-navy">No categories yet</p>
          <p className="mt-2 text-sm text-stone">
            Insert categories in Supabase (or via the SQL editor) to organise products.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-shell">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream/60 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-stone">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-navy">{category.name}</td>
                  <td className="px-4 py-3 text-stone">{category.slug}</td>
                  <td className="px-4 py-3 text-stone">{category.sort_order}</td>
                  <td className="px-4 py-3 text-stone">{category.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
