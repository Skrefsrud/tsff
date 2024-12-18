import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { unstable_cacheTag as cacheTag } from "next/cache";

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
        },
      }
    );

    // Fetch user
    const { data: userResponse, error: userError } =
      await supabase.auth.getUser();
    if (userError || !userResponse) return null;

    const user = userResponse.user;

    // Call the user API route to get profile and roles
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(`called from session: ${baseUrl}/api/user/${user.id}`);

    const res = await fetch(`${baseUrl}/api/user/${user.id}`, {
      cache: "force-cache", // Caching behavior
      next: { tags: [`user-${user.id}`], revalidate: 604800 }, // User-specific tag for revalidation
    });

    if (!res.ok) {
      console.error("Failed to fetch user details from API:", res.statusText);
      return null;
    }

    const userDetails = await res.json();

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
    console.error("Error fetching user session:", error);
    return null;
  }
}
