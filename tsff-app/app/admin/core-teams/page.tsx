import AdminLayout from "../components/admin-layout";
import { CreateTeamForm } from "./components/create-team-form";
import { fetchTeams } from "./actions";
import { TeamCard } from "./components/team-card";
import { InfoPopover } from "@/components/info-popover";

export default async function CoreTeamsPage() {
  const teams = await fetchTeams();
  return (
    <AdminLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Core-Teams" },
      ]}
    >
      <main>
        <div className="flex justify-between items-center gap-4">
          <InfoPopover
            headerText="Core Teams"
            infoText="Create and edit the core of the teams. These are what each seasons instance of teams are tied to. Deleting these with tied data to it will potentially cause many problems."
          />
          <CreateTeamForm />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              id={team.id}
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
