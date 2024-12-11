import { getTeams } from "@/actions/getTeams";
import { useState, useEffect } from "react";
import { Database } from "@/types/database.types";

// get teams type from Database
type Team = Database["public"]["Tables"]["teams"]["Row"];

export default function DisplayTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      const teams = await getTeams();
      console.log(teams);
      setTeams(teams as Team[]);
    };
    fetchTeams();
  }, []);
  console.log(teams);
  // return team names, leaders and logo for each team using shadcn ui
  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>Leader: {team.team_leader}</p>
          <img src={team.logo_url ?? ""} alt={team.name} />
        </div>
      ))}
    </div>
  );
}
