"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, ShowroomSectionId } from "@/lib/types";
import { createProduct, updateProduct } from "../actions";

const SECTIONS: ShowroomSectionId[] = ["left", "right", "centre", "back"];

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEdit = Boolean(product);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product!.id, formData)
        : await createProduct(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        if (!isEdit) router.push("/admin/products");
        else router.refresh();
      }
    });
  };

  const specsText = product
    ? Object.entries(product.specifications)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "";

  const imagesText = product ? product.images.join("\n") : "";

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-2xl border border-line bg-shell p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-navy">
          Name *
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block text-sm font-semibold text-navy">
          Model number
          <input
            name="model_number"
            defaultValue={product?.model_number ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-navy">
          Category
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="">— None —</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-navy">
          Status
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-semibold text-navy">
        Description
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <label className="block text-sm font-semibold text-navy">
        Specifications (one per line: Key: value)
        <textarea
          name="specifications"
          defaultValue={specsText}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 font-mono text-xs outline-none focus:border-navy"
        />
      </label>

      <label className="block text-sm font-semibold text-navy">
        Image URLs (one per line)
        <textarea
          name="images"
          defaultValue={imagesText}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-xs outline-none focus:border-navy"
        />
      </label>

      <label className="block text-sm font-semibold text-navy">
        Upload images
        <input
          type="file"
          name="image_files"
          multiple
          accept="image/*"
          className="mt-1.5 block w-full text-sm text-stone file:mr-3 file:rounded-full file:border-0 file:bg-sand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-semibold text-navy">
          Price (optional)
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block text-sm font-semibold text-navy">
          Stock status
          <select
            name="stock_status"
            defaultValue={product?.stock_status ?? "enquire"}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="enquire">Enquire</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-navy">
          Showroom zone
          <select
            name="showroom_section"
            defaultValue={product?.showroom_section ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="">— Not in showroom —</option>
            {SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={product?.is_featured ?? false}
          className="h-4 w-4 rounded border-line"
        />
        Featured product
      </label>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved successfully.
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={() => {
              if (!confirm("Delete this product?")) return;
              startTransition(async () => {
                const { deleteProduct } = await import("../actions");
                const result = await deleteProduct(product!.id);
                if (result?.error) setError(result.error);
                else router.push("/admin/products");
              });
            }}
            className="btn btn-outline text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
