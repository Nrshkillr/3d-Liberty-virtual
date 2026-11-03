import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const enquirySchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^[+]?[\d\s().-]+$/, "Please enter a valid phone number."),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(200).optional().default(""),
});

// Best-effort protection for serverless deployments. Pair with a WAF or
// platform rate limit in production if spam becomes a problem.
const attempts = new Map<string, { count: number; startedAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function isRateLimited(identifier: string) {
  const now = Date.now();
  const entry = attempts.get(identifier);

  if (!entry || now - entry.startedAt > WINDOW_MS) {
    attempts.set(identifier, { count: 1, startedAt: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        message:
          "Online enquiries are not connected yet. Please contact us on WhatsApp or visit the showroom.",
      },
      { status: 503 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const identifier = forwardedFor?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(identifier)) {
    return NextResponse.json(
      { message: "Too many enquiries. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ??
          "Please check the details you entered.",
      },
      { status: 400 },
    );
  }

  // Honeypot: silently accept bot submissions.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json(
      { message: "Online enquiries are unavailable right now." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("enquiries").insert({
    product_id: parsed.data.product_id || null,
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    message: parsed.data.message || null,
  });

  if (error) {
    console.error("[enquiries] insert:", error.message);
    return NextResponse.json(
      {
        message:
          "We could not send your enquiry. Please try again or reach us on WhatsApp.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, message: "Enquiry received." },
    { status: 201 },
  );
}
