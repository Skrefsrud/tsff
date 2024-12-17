import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Define protected routes
  const protectedRoutes = ["/profile"]; // Add your protected routes here
  const adminRoutes = ["/admin"];

  if (protectedRoutes.includes(request.nextUrl.pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated, fetch their roles
  let roles: string[] = [];
  if (user) {
    const { data: roleData, error: roleError } = await supabase
      .from("user_with_roles")
      .select("role_name")
      .eq("user_id", user.id);

    if (roleError) {
      console.error("Error fetching user roles:", roleError.message);
    } else {
      roles = roleData.map((role) => role.role_name);
    }
  }

  // Role-based protection for admin routes
  if (adminRoutes.includes(request.nextUrl.pathname)) {
    if (!roles.includes("admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect unauthorized users to home
      return NextResponse.redirect(url);
    }
  }
  return supabaseResponse;
}
