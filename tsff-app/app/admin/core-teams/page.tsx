import AdminLayout from "../components/admin-layout";
import { CreateTeamForm } from "./components/create-team-form";
import { fetchTeams } from "./actions";
import { TeamCard } from "./components/team-card";

export default async function CoreTeamsPage() {
  const teams = await fetchTeams();
  console.log("teams", teams);
  return (
    <AdminLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Core-Teams" },
      ]}
    >
      <main>
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Core Teams Management</h1>
          <CreateTeamForm />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              name={team.name}
              logo_url={team.logo_url}
              social_links={team.social_links}
            />
          ))}
        </div>
      </main>
    </AdminLayout>
  );
}
