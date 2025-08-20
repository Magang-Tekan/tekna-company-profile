import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppLayout } from "@/components/layout/app-layout";
import { AppSidebarNew } from "@/components/layout/app-sidebar-new";
import { AppHeader } from "@/components/layout/app-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <AppLayout
      sidebar={<AppSidebarNew />}
      header={<AppHeader />}
    >
      {children}
    </AppLayout>
  );
}
