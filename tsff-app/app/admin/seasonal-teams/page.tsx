import AdminLayout from "../components/admin-layout";
import { InfoPopover } from "@/components/info-popover";
import { fetchCurrentSeason } from "./actions";
import { CreateSeasonForm } from "./components/create-season-form";
import { Separator } from "@/components/ui/separator";
import { fetchTeams } from "../core-teams/actions";
import TeamDropdown from "./components/team-dropdown";

export default async function SeasonalTeamsPage() {
  const season = await fetchCurrentSeason();
  const teams = await fetchTeams();

  console.log("seasons", season);

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
            headerText="Seasonal Teams"
            infoText="Set the season, define what teams are playing this season and who each team's team leader is."
          />
          <CreateSeasonForm />
        </div>
        <h2 className="mb-4">Current season: {season.year_label}</h2>
        <Separator />

        <TeamDropdown teams={teams} />
      </main>
    </AdminLayout>
  );
}
