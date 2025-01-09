import AdminLayout from "./components/admin-layout";
import { getServerSession } from "@/utils/supabase/session";
import RevalidateButton from "./revalidateButton";

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
        <h1>{session?.user.email}</h1>
        <h1>{session?.roles}</h1>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </AdminLayout>
    </div>
  );
}
