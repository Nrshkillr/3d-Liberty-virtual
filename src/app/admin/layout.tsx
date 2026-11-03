import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured;
  const user = configured ? await getAdminUser() : null;

  return (
    <div className="min-h-[100dvh] bg-cream text-ink">
      <header className="border-b border-line bg-shell">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo compact />
            <span className="text-sm font-bold text-navy">Admin</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1.5 text-sm">
            {user && (
              <>
                <Link href="/admin/dashboard" className="rounded-full px-3 py-1.5 font-semibold text-navy hover:bg-sand">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="rounded-full px-3 py-1.5 font-semibold text-navy hover:bg-sand">
                  Products
                </Link>
                <Link href="/admin/categories" className="rounded-full px-3 py-1.5 font-semibold text-navy hover:bg-sand">
                  Categories
                </Link>
                <Link href="/admin/enquiries" className="rounded-full px-3 py-1.5 font-semibold text-navy hover:bg-sand">
                  Enquiries
                </Link>
                <Link href="/admin/settings" className="rounded-full px-3 py-1.5 font-semibold text-navy hover:bg-sand">
                  Settings
                </Link>
              </>
            )}
            <Link href="/" className="rounded-full px-3 py-1.5 font-semibold text-stone hover:bg-sand">
              View site
            </Link>
          </nav>
        </div>
      </header>

      {!configured && (
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <div className="rounded-2xl border border-line bg-shell p-6">
            <h1 className="font-display text-2xl font-semibold text-navy">
              Supabase is not configured
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Copy <code className="rounded bg-sand px-1.5 py-0.5">.env.example</code> to{" "}
              <code className="rounded bg-sand px-1.5 py-0.5">.env.local</code>, add your
              project URL and anon key, run <code className="rounded bg-sand px-1.5 py-0.5">supabase/schema.sql</code>,
              then restart the dev server. The admin area needs a live Supabase project.
            </p>
          </div>
        </div>
      )}

      {configured && <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</div>}
      {!configured && <div className="hidden">{children}</div>}
    </div>
  );
}
