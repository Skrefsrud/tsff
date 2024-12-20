import { createClient } from "@/utils/supabase/server"; // Supabase server client
import { User } from "@supabase/supabase-js";

/**
 * Fetches the user session on the server side.
 * Returns the authenticated user and additional user details if available.
 */
export async function getServerSession() {
  try {
    const supabase = await createClient();

    // Fetch the authenticated user
    const { data: userResponse, error: userError } =
      await supabase.auth.getUser();
    if (userError || !userResponse) {
      console.warn("Failed to fetch authenticated user:", userError?.message);
      return null; // No user session
    }

    const user: User = userResponse.user;

    // Fetch additional user details (e.g., roles, profile) if needed
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${baseUrl}/api/user/${user.id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch user details from API:", res.statusText);
      return { user }; // Return just the authenticated user if API fails
    }

    const userDetails = await res.json();

    // Combine user and additional details
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        confirmed_at: user.confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      ...userDetails,
    };
  } catch (error) {
    console.error("Error fetching server session:", error);
    return null;
  }
}
