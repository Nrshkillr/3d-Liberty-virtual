import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const user = await getAdminUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginForm />;
}
