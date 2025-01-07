import AdminLayout from "../components/admin-layout";
import { InfoPopover } from "@/components/info-popover";
import { Separator } from "@/components/ui/separator";
import { fetchCurrentSeason } from "../seasons/actions";
import { CreateSeasonGroupForm } from "./create-season-group";

export default async function SeasonalTeamsPage() {

  const season = await fetchCurrentSeason();

  return (
    <AdminLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Groups" },
      ]}
    >
      <main>
        <div className="flex justify-between items-center gap-4">
          <InfoPopover
            headerText="Groups"
            infoText="Here you can create the groups used for the group stage in the season. Options for automatic generation will be available in the future."
          />
          <CreateSeasonGroupForm seasonId={season.id} />
        </div>
        <h2 className="mb-4">Current season: {season.year_label}</h2>
        <Separator />

        


      </main>
    </AdminLayout>
  );
}
