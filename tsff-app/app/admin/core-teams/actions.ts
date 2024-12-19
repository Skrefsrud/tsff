"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  logo_url: z.string().url("Invalid URL").optional(),
  social_links: z.record(z.string().url("Invalid URL")).optional(),
});

const TEAM_CACHE_TAG = "teams-cache";

export async function createTeam(formData: FormData) {
  const validatedFields = teamSchema.safeParse({
    name: formData.get("name"),
    logo_url: formData.get("logo_url"),
    social_links: JSON.parse((formData.get("social_links") as string) || "{}"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, logo_url, social_links } = validatedFields.data;

  try {
    const { data, error } = await supabase
      .from("teams")
      .insert([{ name, logo_url, social_links }])
      .select();

    if (error) throw error;

    revalidateTag(TEAM_CACHE_TAG);

    return { success: true, data };
  } catch (error) {
    console.error("Error creating team:", error);
    return { error: "Failed to create team" };
  }
}

// Fetch all teams from the database
export async function fetchTeams() {
  "use cache";
  cacheTag(TEAM_CACHE_TAG);
  const { data, error } = await supabase.from("teams").select("*");

  if (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }

  console.log(data);

  return data;
}

// Revalidate teams cache
