import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

interface CreatedUser {
  email: string;
  password: string;
  role: "admin" | "team_leader" | "player" | "referee";
  id: string;
}

async function main() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  // -----------------------------------------------------------
  // Configuration
  // -----------------------------------------------------------
  const ADMIN_COUNT = 1;
  const REFEREE_COUNT = 2;
  const DIVISION_COUNT = 2;
  const TEAMS_PER_DIVISION = 4;
  const PLAYERS_PER_TEAM = 10;
  // Total teams = DIVISION_COUNT * TEAMS_PER_DIVISION = 8

  // -----------------------------------------------------------
  // Generate user sets
  // -----------------------------------------------------------
  // Admins
  const adminUsers = Array.from({ length: ADMIN_COUNT }, (_, i) => ({
    email: `admin${i + 1}@example.com`,
    password: "password",
    role: "admin" as const,
  }));

  // Referees
  const refereeUsers = Array.from({ length: REFEREE_COUNT }, (_, i) => ({
    email: `referee${i + 1}@example.com`,
    password: "password",
    role: "referee" as const,
  }));

  // Team leaders
  // 8 teams total, 1 leader per team
  const teamLeaderUsers = Array.from(
    { length: DIVISION_COUNT * TEAMS_PER_DIVISION },
    (_, i) => ({
      email: `leader${i + 1}@example.com`,
      password: "password",
      role: "team_leader" as const,
    })
  );

  // Players
  // 8 teams * 10 players = 80 players
  const playerUsers = Array.from(
    { length: DIVISION_COUNT * TEAMS_PER_DIVISION * PLAYERS_PER_TEAM },
    (_, i) => ({
      email: `player${i + 1}@example.com`,
      password: "password",
      role: "player" as const,
    })
  );

  // Combine all
  const allUsersToCreate = [
    ...adminUsers,
    ...refereeUsers,
    ...teamLeaderUsers,
    ...playerUsers,
  ];

  // -----------------------------------------------------------
  // Step 1: Create Users via Admin API
  // -----------------------------------------------------------
  const createdUsers: CreatedUser[] = [];
  for (const u of allUsersToCreate) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });
    if (error) {
      console.error(`Error creating user ${u.email}:`, error);
      process.exit(1);
    }
    createdUsers.push({ ...u, id: data.user.id });
  }

  // -----------------------------------------------------------
  // Fetch and assign roles
  // -----------------------------------------------------------
  const { data: rolesData, error: rolesError } = await supabaseAdmin
    .from("roles")
    .select("*");
  if (rolesError) {
    console.error("Error fetching roles:", rolesError);
    process.exit(1);
  }

  const roleMap: { [key: string]: string } = {};
  for (const r of rolesData) {
    roleMap[r.role_name] = r.id;
  }

  const userRolesToInsert = createdUsers.map((u) => ({
    user_id: u.id,
    role_id: roleMap[u.role],
  }));

  const { error: userRolesError } = await supabaseAdmin
    .from("user_roles")
    .insert(userRolesToInsert);
  if (userRolesError) {
    console.error("Error inserting user_roles:", userRolesError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Categorize created users by role for convenience
  // -----------------------------------------------------------
  const admins = createdUsers.filter((u) => u.role === "admin");
  const referees = createdUsers.filter((u) => u.role === "referee");
  const teamLeadersArr = createdUsers.filter((u) => u.role === "team_leader");
  const playersArr = createdUsers.filter((u) => u.role === "player");

  // -----------------------------------------------------------
  // Step 2: Create a Season
  // -----------------------------------------------------------
  const { data: seasonData, error: seasonError } = await supabaseAdmin
    .from("seasons")
    .insert([
      {
        year_label: "2024/2025",
        start_date: "2024-09-01",
        end_date: "2025-05-31",
      },
    ])
    .select();

  if (seasonError) {
    console.error("Error creating season:", seasonError);
    process.exit(1);
  }
  const season = seasonData[0];

  // -----------------------------------------------------------
  // Step 3: Create Divisions
  // -----------------------------------------------------------
  const divisionInserts = Array.from({ length: DIVISION_COUNT }, (_, i) => ({
    season_id: season.id,
    division_name: `Division ${String.fromCharCode(65 + i)}`, // Division A, B, etc.
    phase: "autumn",
  }));

  const { data: divisionsData, error: divisionsError } = await supabaseAdmin
    .from("season_divisions")
    .insert(divisionInserts)
    .select();

  if (divisionsError) {
    console.error("Error creating divisions:", divisionsError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 4: Create Teams
  // -----------------------------------------------------------
  // Name the teams systematically
  // For Division A: Alpha, Beta, Gamma, Delta
  // For Division B: Epsilon, Zeta, Eta, Theta
  // You can pick any naming scheme you want
  const teamNames = [
    ["Alpha", "Beta", "Gamma", "Delta"],
    ["Epsilon", "Zeta", "Eta", "Theta"],
  ];

  // We'll have (DIVISION_COUNT * TEAMS_PER_DIVISION) teams total
  // Each team leader corresponds to one team
  const teamsToInsert = [];
  let leaderIndex = 0;
  for (let d = 0; d < DIVISION_COUNT; d++) {
    for (let t = 0; t < TEAMS_PER_DIVISION; t++) {
      const leader = teamLeadersArr[leaderIndex++];
      teamsToInsert.push({
        name: `Team ${teamNames[d][t]}`,
        logo_url: `http://example.com/logo_${teamNames[d][
          t
        ].toLowerCase()}.png`,
        team_leader: leader.id,
        social_links: {
          instagram: `https://instagram.com/team${teamNames[d][
            t
          ].toLowerCase()}`,
        },
      });
    }
  }

  const { data: teamsData, error: teamsError } = await supabaseAdmin
    .from("teams")
    .insert(teamsToInsert)
    .select();
  if (teamsError) {
    console.error("Error creating teams:", teamsError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 5: Link Teams to season_teams
  // -----------------------------------------------------------
  const seasonTeamsToInsert = [];
  let teamIndex = 0;
  for (let d = 0; d < DIVISION_COUNT; d++) {
    const division = divisionsData[d];
    for (let t = 0; t < TEAMS_PER_DIVISION; t++) {
      const team = teamsData[teamIndex++];
      seasonTeamsToInsert.push({
        season_division_id: division.id,
        team_id: team.id,
      });
    }
  }

  const { data: seasonTeamsData, error: seasonTeamsError } = await supabaseAdmin
    .from("season_teams")
    .insert(seasonTeamsToInsert)
    .select();

  if (seasonTeamsError) {
    console.error("Error creating season_teams:", seasonTeamsError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 6: Assign Players to Teams
  // -----------------------------------------------------------
  // Distribute players evenly across the teams
  // For each team, we assign PLAYERS_PER_TEAM players
  let playerStartIndex = 0;
  const playerInserts = [];
  for (const seasonTeam of seasonTeamsData) {
    const teamPlayers = playersArr.slice(
      playerStartIndex,
      playerStartIndex + PLAYERS_PER_TEAM
    );
    playerStartIndex += PLAYERS_PER_TEAM;
    for (const p of teamPlayers) {
      playerInserts.push({
        season_team_id: seasonTeam.id,
        user_id: p.id,
      });
    }
  }

  const { error: playersInsertError } = await supabaseAdmin
    .from("players")
    .insert(playerInserts);
  if (playersInsertError) {
    console.error("Error inserting players into teams:", playersInsertError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 7: Create Referees
  // -----------------------------------------------------------
  const refereeInserts = referees.map((r) => ({ user_id: r.id }));
  const { error: refereesInsertError, data: refereeRows } = await supabaseAdmin
    .from("referees")
    .insert(refereeInserts)
    .select();
  if (refereesInsertError) {
    console.error("Error creating referees:", refereesInsertError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 8: Create a few Matches for testing
  // We'll pick the first two teams from Division A and have them play each other
  // and the first two teams from Division B do the same.
  // In a real scenario, you'd generate a full schedule.
  const teamsInDivisionA = seasonTeamsData.slice(0, TEAMS_PER_DIVISION);
  const teamsInDivisionB = seasonTeamsData.slice(
    TEAMS_PER_DIVISION,
    TEAMS_PER_DIVISION * 2
  );

  const matchesToInsert = [
    {
      home_season_team_id: teamsInDivisionA[0].id,
      away_season_team_id: teamsInDivisionA[1].id,
    },
    {
      home_season_team_id: teamsInDivisionB[0].id,
      away_season_team_id: teamsInDivisionB[1].id,
    },
  ];

  const { data: matchesData, error: matchesError } = await supabaseAdmin
    .from("matches")
    .insert(matchesToInsert)
    .select();

  if (matchesError) {
    console.error("Error creating matches:", matchesError);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // Step 9: Create a Field and Schedule one of the matches
  const { data: fieldsData, error: fieldError } = await supabaseAdmin
    .from("fields")
    .insert([{ name: "Main Field", location: "Central Campus" }])
    .select();

  if (fieldError) {
    console.error("Error creating field:", fieldError);
    process.exit(1);
  }

  const mainField = fieldsData[0];

  const { error: scheduleError } = await supabaseAdmin
    .from("match_schedule")
    .insert({
      match_id: matchesData[0].id,
      field_id: mainField.id,
      start_time: "2024-09-15T14:00:00Z",
    });

  if (scheduleError) {
    console.error("Error scheduling match:", scheduleError);
    process.exit(1);
  }

  console.log("Seeding completed successfully with more users and TypeScript!");
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
