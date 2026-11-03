import { getCategories, getSettings } from "@/lib/data/catalogue";
import { isDemoMode } from "@/lib/supabase/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PreviewBanner } from "@/components/site/PreviewBanner";

export default async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const whatsappUrl = buildWhatsAppUrl(settings);

  return (
    <div className="flex min-h-full flex-col">
      {isDemoMode && <PreviewBanner />}
      <SiteHeader whatsappUrl={whatsappUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  );
}
