import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateEnquiryStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const user = await getAdminUser();
  if (!user) return <p className="text-stone">Sign in to view enquiries.</p>;

  type Enquiry = {
    id: string;
    customer_name: string;
    phone: string;
    email: string | null;
    message: string | null;
    status: string;
    created_at: string;
    product: { name: string }[] | null;
  };

  let enquiries: Enquiry[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("enquiries")
        .select("id,customer_name,phone,email,message,status,created_at,product:products(name)")
        .order("created_at", { ascending: false });
      enquiries = (data ?? []) as Enquiry[];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Enquiries</h1>
        <p className="mt-1 text-sm text-stone">{enquiries.length} enquiries received.</p>
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-2xl border border-line bg-shell p-8 text-center">
          <p className="font-display text-xl font-semibold text-navy">No enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-2xl border border-line bg-shell p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{enquiry.customer_name}</p>
                  <p className="text-sm text-stone">
                    {enquiry.phone}
                    {enquiry.email ? ` · ${enquiry.email}` : ""}
                  </p>
                  {enquiry.product && (
                    <p className="mt-1 text-xs font-semibold text-ember-dark">
                      Product: {enquiry.product?.[0]?.name}

                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sand px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy">
                    {enquiry.status}
                  </span>
                  <span className="text-xs text-stone">
                    {new Date(enquiry.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              {enquiry.message && (
                <p className="mt-3 text-sm leading-relaxed text-stone">
                  {enquiry.message}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {(["new", "contacted", "closed"] as const).map((status) => (
                  <form
                    key={status}
                    action={async () => {
                      "use server";
                      await updateEnquiryStatus(enquiry.id, status);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full border border-line px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy hover:bg-sand"
                    >
                      {status}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
