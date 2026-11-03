"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({
  product,
  disabledReason,
  className,
  compact = false,
}: {
  product?: Pick<Product, "id" | "name" | "model_number">;
  disabledReason?: string;
  className?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      product_id: product?.id ?? null,
      customer_name: String(formData.get("customer_name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    if (payload.customer_name.trim().length < 2) {
      setStatus("error");
      setFeedback("Please enter your name.");
      return;
    }
    if (payload.phone.replace(/\D/g, "").length < 7) {
      setStatus("error");
      setFeedback("Please enter a valid phone number.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not send your enquiry.");
      }

      setStatus("success");
      setFeedback(
        "Thank you — your enquiry has been received. Our team will get back to you.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form
      id={product ? "enquire" : "contact-form"}
      onSubmit={handleSubmit}
      className={cn(
        "relative rounded-[1.25rem] border border-line bg-shell p-5 md:p-6",
        className,
      )}
    >
      <div className="mb-5">
        <h3 className="font-display text-xl font-semibold text-navy">
          {product ? "Enquire about this product" : "Send us an enquiry"}
        </h3>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-stone">
          {product
            ? "Share your contact details and we'll respond with wholesale pricing and availability."
            : "Tell us what you're looking for. We'll reply with wholesale details and availability."}
        </p>
      </div>

      {disabledReason && (
        <div className="mb-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{disabledReason}</span>
        </div>
      )}

      {product && (
        <div className="mb-4 rounded-xl border border-line bg-cream px-3.5 py-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ember-dark">
            Enquiring about
          </p>
          <p className="mt-1 text-sm font-semibold text-navy">{product.name}</p>
          <p className="text-[0.7rem] text-stone">
            Model {product.model_number || "—"}
          </p>
        </div>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`name-${product?.id ?? "general"}`} className="label">
            Your name
          </label>
          <input
            id={`name-${product?.id ?? "general"}`}
            name="customer_name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Name or shop name"
            className="field"
            disabled={Boolean(disabledReason) || status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor={`phone-${product?.id ?? "general"}`} className="label">
            Phone / WhatsApp
          </label>
          <input
            id={`phone-${product?.id ?? "general"}`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={24}
            placeholder="Your contact number"
            className="field"
            disabled={Boolean(disabledReason) || status === "submitting"}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`message-${product?.id ?? "general"}`} className="label">
          Message <span className="font-normal text-stone">(optional)</span>
        </label>
        <textarea
          id={`message-${product?.id ?? "general"}`}
          name="message"
          rows={compact ? 3 : 4}
          maxLength={2000}
          placeholder={
            product
              ? "Quantity, colours or any specific requirement…"
              : "Categories, quantities, or what you'd like to source…"
          }
          className="field resize-none"
          disabled={Boolean(disabledReason) || status === "submitting"}
        />
      </div>

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`website-${product?.id ?? "general"}`}>Website</label>
        <input
          id={`website-${product?.id ?? "general"}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary mt-5 w-full"
        disabled={Boolean(disabledReason) || status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send enquiry
          </>
        )}
      </button>

      <div aria-live="polite" className="min-h-[1px]">
        {feedback && (
          <p
            className={cn(
              "mt-4 flex gap-2 rounded-xl border px-3.5 py-3 text-xs leading-relaxed",
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{feedback}</span>
          </p>
        )}
      </div>

      <p className="mt-4 text-[0.67rem] leading-relaxed text-stone/80">
        We only use your details to respond to this enquiry. No prices or stock
        are confirmed until our team replies.
      </p>
    </form>
  );
}
