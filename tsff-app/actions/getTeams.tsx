"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";
type Team = Database["public"]["Tables"]["teams"]["Row"];

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("teams").select("*");
  return data ?? [];
}
