import { getCategories } from "@/lib/data/catalogue";
import { getAdminUser } from "@/lib/auth";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to manage products.</p>;

  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-navy">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
