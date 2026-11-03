import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to edit settings.</p>;

  type Settings = {
    business_name: string | null;
    tagline: string | null;
    whatsapp_number: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
  };

  let settings: Settings | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("site_settings")
        .select("business_name,tagline,whatsapp_number,phone,email,address,city,state")
        .eq("id", 1)
        .maybeSingle();
      settings = (data as Settings) ?? null;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Site settings</h1>
        <p className="mt-1 text-sm text-stone">
          Configure the WhatsApp number and contact details used across the site.
        </p>
      </div>

      <form
        action={async (formData) => {
          await updateSettings(formData);
        }}
        className="space-y-4 rounded-2xl border border-line bg-shell p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-navy">
            Business name
            <input
              name="business_name"
              defaultValue={settings?.business_name ?? "Liberty Enterprises"}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Tagline
            <input
              name="tagline"
              defaultValue={settings?.tagline ?? ""}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-navy">
          WhatsApp number (with country code, e.g. 919876543210)
          <input
            name="whatsapp_number"
            defaultValue={settings?.whatsapp_number ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-navy">
            Phone
            <input
              name="phone"
              defaultValue={settings?.phone ?? ""}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Email
            <input
              name="email"
              type="email"
              defaultValue={settings?.email ?? ""}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-navy">
          Address
          <input
            name="address"
            defaultValue={settings?.address ?? ""}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-navy">
            City
            <input
              name="city"
              defaultValue={settings?.city ?? "Chennai"}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            State
            <input
              name="state"
              defaultValue={settings?.state ?? "Tamil Nadu"}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Save settings
        </button>
      </form>
    </div>
  );
}
