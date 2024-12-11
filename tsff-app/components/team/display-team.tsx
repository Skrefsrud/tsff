import { Database } from "@/database.types";

type Team = Database["public"]["Tables"]["teams"]["Row"];

import { Card } from "../ui/card";

export default function DisplayTeam(team: Team) {
  return (
    <div>
      <h1>Display Team</h1>
    </div>
  );
}
