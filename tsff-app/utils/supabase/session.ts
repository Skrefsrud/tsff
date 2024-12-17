import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getServerSession() {
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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user session:", userError?.message);
    return null;
  }

  // Fetch roles from the 'user_with_roles' view
  const { data: roles, error: roleError } = await supabase
    .from("user_with_roles")
    .select("role_name") // Directly fetch the role_name column
    .eq("user_id", user.id);

  if (roleError) {
    console.error("Error fetching user roles:", roleError.message);
    return null;
  }

  // Attach roles to user session
  return {
    ...user,
    roles: roles?.map((role) => role.role_name) || [], // Extract role names
  };
}
