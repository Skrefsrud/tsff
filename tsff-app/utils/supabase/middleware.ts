import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "./session";

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

  // Fetch the session
  const session = await getServerSession();
  if (!session) {
    return supabaseResponse;
  }

  // Define protected and admin routes
  const protectedRoutes = ["/profile"]; // Add your protected routes here
  const adminRoutes = ["/admin"];

  // Redirect unauthenticated users for protected routes
  if (protectedRoutes.includes(request.nextUrl.pathname) && !session.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based protection for admin routes
  const roles = session.roles || [];
  if (adminRoutes.includes(request.nextUrl.pathname)) {
    if (!roles.includes("admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect unauthorized users to home
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
