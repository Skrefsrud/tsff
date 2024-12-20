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
  return data;
}

// Revalidate teams cache
const teamUpdateSchema = z.object({
  id: z.string().uuid("Invalid team ID"), // UUID validation
  name: z.string().min(1, "Team name is required").optional(), // Optional name update
  logo_url: z.string().url("Invalid URL").optional(), // Optional logo URL
  social_links: z.record(z.string().url("Invalid URL")).optional(), // Optional social links
});

export async function updateTeam(formData: FormData) {
  console.log("updating team");

  const validatedFields = teamUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    logo_url: formData.get("logo_url"),
    social_links: JSON.parse((formData.get("social_links") as string) || "{}"), // Parse to an object
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { id, name, logo_url, social_links } = validatedFields.data;

  try {
    const updateData = {
      ...(name && { name }),
      ...(logo_url && { logo_url }),
      ...(social_links && { social_links }),
    };

    const { data, error } = await supabase
      .from("teams")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    revalidateTag(TEAM_CACHE_TAG);

    return { success: true, data };
  } catch (error) {
    console.error("Error updating team:", error);
    return { error: "Failed to update team" };
  }
}
