import AdminLayout from "../components/admin-layout";

export default function CoreTeamsPage() {
  return (
    <AdminLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Core-Teams" },
      ]}
    >
      <h1 className="text-2xl font-bold">Teams Management</h1>
      <p>Here you can manage your teams.</p>
    </AdminLayout>
  );
}
