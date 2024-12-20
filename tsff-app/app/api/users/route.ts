// pages/api/users.ts
import { createClient } from "@/utils/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch all users from the `profiles` table
    const { data, error } = await supabase.from("profiles").select("id, name");

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    return res.status(200).json({ users: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
