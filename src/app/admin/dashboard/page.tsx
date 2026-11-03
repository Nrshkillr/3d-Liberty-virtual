import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "../actions";
import { getCategories, getProducts } from "@/lib/data/catalogue";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAdminUser();
  if (!user) {
    return <p className="text-stone">Sign in to view the dashboard.</p>;
  }

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const supabase = await createSupabaseServerClient();
  let enquiryCount = 0;
  let draftCount = 0;
  if (supabase) {
    const [enquiries, drafts] = await Promise.all([
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
    ]);
    enquiryCount = enquiries.count ?? 0;
    draftCount = drafts.count ?? 0;
  }

  const cards = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/categories" },
    { label: "Draft products", value: draftCount, href: "/admin/products" },
    { label: "Enquiries", value: enquiryCount, href: "/admin/enquiries" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-stone">
          Signed in as {user.email}. Manage the catalogue, enquiries and showroom settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-line bg-shell p-5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-navy">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
        <Link href="/admin/settings" className="btn btn-outline">
          Edit settings
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="btn btn-outline">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
