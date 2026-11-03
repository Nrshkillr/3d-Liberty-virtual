import type { Product, SiteSettings } from "@/lib/types";

export function normalizePhone(value: string | null | undefined) {
  return (value ?? "").replace(/[^\d]/g, "");
}

export function isValidWhatsAppNumber(value: string | null | undefined) {
  const digits = normalizePhone(value);
  return digits.length >= 10 && digits.length <= 15;
}

export function buildWhatsAppUrl(
  settings: Pick<SiteSettings, "whatsapp_number">,
  product?: Pick<Product, "name" | "model_number"> | null,
) {
  const number = normalizePhone(settings.whatsapp_number);
  if (!isValidWhatsAppNumber(number)) return null;

  const message = product
    ? [
        "Hello Liberty Enterprises,",
        "",
        "I am interested in the following product:",
        "",
        `Product: ${product.name}`,
        `Model Number: ${product.model_number || "Not specified"}`,
        "",
        "Please share the wholesale price and availability.",
        "",
        "Thank you.",
      ].join("\n")
    : [
        "Hello Liberty Enterprises,",
        "",
        "I would like to know more about your baby and kids wholesale collection.",
        "",
        "Please share your catalogue and wholesale details.",
        "",
        "Thank you.",
      ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
