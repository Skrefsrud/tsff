import AdminLayout from "./components/admin-layout";
import { getServerSession } from "@/utils/supabase/session";
import RevalidateButton from "./revalidateButton";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col gap-4">
      <AdminLayout
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Dashboard" },
        ]}
      >
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </AdminLayout>
      <RevalidateButton userId={session.user.id}>
        Revalidate user
      </RevalidateButton>
    </div>
  );
}
