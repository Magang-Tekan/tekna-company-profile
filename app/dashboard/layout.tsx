import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppLayout } from "@/components/layout/app-layout";
import { AppSidebarNew } from "@/components/layout/app-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default async function DashboardLayout({ // Renamed from dashboardLayout for convention
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <AppLayout
      sidebar={<AppSidebarNew />}
      header={<AdminHeader />}
    >
      {children}
    </AppLayout>
  );
}