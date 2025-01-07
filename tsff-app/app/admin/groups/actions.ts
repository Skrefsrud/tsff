"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CreateSeasonGroupResult {
  error?: string | Record<string, string>;
  success?: boolean;
}

/**
 * Server action: create a new season group
 * @param formData - The FormData from the client
 */
export async function createSeasonGroup(formData: FormData): Promise<CreateSeasonGroupResult> {
  try {
    const seasonId = formData.get("season_id");
    const groupName = formData.get("group_name");

    // Basic validation
    if (!seasonId) {
      return { error: "Season ID is required." };
    }
    if (!groupName) {
      return { error: "Group name is required." };
    }

    // Insert into the `season_groups` table
    // Make sure you've set up a Prisma model for season_groups
    await supabase.from("season_groups").insert({ season_id: seasonId, group_name: groupName });

    return { success: true };
  } catch (error) {
    console.error("Error creating season group:", error);
    return { error: "An unexpected error occurred while creating the group." };
  }
}
