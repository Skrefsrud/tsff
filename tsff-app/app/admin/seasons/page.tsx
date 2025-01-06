import AdminLayout from "../components/admin-layout";
import { InfoPopover } from "@/components/info-popover";
import { fetchCurrentSeason, fetchAllSeasons } from "./actions";
import { CreateSeasonForm } from "./components/create-season-form";
import { Separator } from "@/components/ui/separator";
import { fetchTeams } from "../core-teams/actions";
import  DropdownSelector  from "@/components/dropdown-selector";
import ArrayTable from "./components/array-table";

export default async function SeasonalTeamsPage() {
  const season = await fetchCurrentSeason();
  const seasons = await fetchAllSeasons();

    console.log(seasons)


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
            headerText="Seasons"
            infoText="Here you can create a new seasons. This should always be done with care as it will affect the existing current season, if not compleeted. Deletion of seasons with tied data to it will potentially cause many problems."
          />
          <CreateSeasonForm />
        </div>
        <h2 className="mb-4">Current season: {season.year_label}</h2>
        <Separator />

        <ArrayTable items={seasons} />


      </main>
    </AdminLayout>
  );
}
