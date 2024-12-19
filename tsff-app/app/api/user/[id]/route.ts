// app/api/user/route.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: userId } = await params;

  try {
    console.log("user[id] called");
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

    // Fetch roles with cache tagging
    const { data: roles, error: roleError } = await supabase
      .from("user_with_roles")
      .select("role_name")
      .eq("user_id", userId)
      .then((res) => ({
        ...res,
        next: {
          tags: [`user-${userId}`], // Add user-specific tag for revalidation
          revalidate: 604800, // Revalidate every week (7 days)
        },
      }));

    if (roleError) {
      console.error("Error fetching roles:", roleError.message);
      return NextResponse.json(
        { error: "Failed to fetch roles" },
        { status: 500 }
      );
    }

    // Fetch profile with cache tagging
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", userId)
      .single()
      .then((res) => ({
        ...res,
        next: {
          tags: [`user-${userId}`], // Add user-specific tag for revalidation
          revalidate: 604800, // Revalidate every week (7 days)
        },
      }));

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      roles: roles?.map((role) => role.role_name) || [],
      profile: {
        name: profile?.name || "Unknown",
        avatar_url: profile?.avatar_url || "",
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
