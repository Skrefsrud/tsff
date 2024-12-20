"use server";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function fetchCurrentSeason() {
  try {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .order("end_date", { ascending: false }) // Sort by most recent end_date first
      .order("created_at", { ascending: false }) // Secondary sort by created_at
      .limit(1); // Get the latest season

    if (error) {
      console.error("Error fetching the current season:", error);
      throw new Error("Failed to fetch the current season");
    }

    if (!data || data.length === 0) {
      throw new Error("No season data found");
    }

    return data[0];
  } catch (err) {
    console.error("Unexpected error fetching the current season:", err);
    throw err;
  }
}

import { z } from "zod";

const seasonSchema = z.object({
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  year_label: z.string().min(1, "Year label is required"),
});

export async function createSeason(formData: FormData) {
  const validatedFields = seasonSchema.safeParse({
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    year_label: formData.get("year_label"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { start_date, end_date, year_label } = validatedFields.data;

  try {
    const { data, error } = await supabase
      .from("seasons")
      .insert([{ start_date, end_date, year_label }])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error creating season:", error);
    return { error: "Failed to create season" };
  }
}
