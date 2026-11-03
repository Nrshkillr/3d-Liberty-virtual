const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const SUPABASE_URL = rawUrl;
export const SUPABASE_ANON_KEY = rawAnonKey;

/**
 * The site runs in preview mode (bundled demo catalogue) until real Supabase
 * credentials are provided. No service-role key is ever used by the browser.
 */
export const isSupabaseConfigured = Boolean(
  rawUrl.startsWith("http") && rawAnonKey.length > 20,
);

export const isDemoMode = !isSupabaseConfigured;
