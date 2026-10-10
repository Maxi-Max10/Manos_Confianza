import { NextResponse, type NextRequest } from "next/server";
import { dashboardForRole, safeNextPath } from "@/lib/auth";
import { updateSupabaseSession } from "@/lib/supabase-middleware";
import type { UserRole } from "@/types";
import { isDemoMode } from "@/lib/demo";

const protectedRoutes = ["/dashboard", "/perfil/completar", "/busquedas/publicar", "/auth/nueva-contrasena"];
const publicAuthRoutes = ["/auth/login", "/auth/registro", "/auth/recuperar"];

function requiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/trabajadora") || pathname.startsWith("/perfil/completar")) return "worker";
  if (pathname.startsWith("/dashboard/familia") || pathname.startsWith("/busquedas/publicar")) return "family";
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isDemoMode) {
    if (pathname.startsWith("/auth/")) return NextResponse.redirect(new URL("/demo", request.url));
    if (pathname.startsWith("/dashboard/familia") || pathname.startsWith("/busquedas/publicar")) return NextResponse.redirect(new URL("/demo/familia", request.url));
    if (pathname.startsWith("/dashboard/trabajadora") || pathname.startsWith("/perfil/completar")) return NextResponse.redirect(new URL("/demo/trabajadora", request.url));
    if (pathname.startsWith("/dashboard/admin")) return NextResponse.redirect(new URL("/demo/admin", request.url));
    return NextResponse.next();
  }
  const { response, supabase, user } = await updateSupabaseSession(request);
  const needsAuthentication = protectedRoutes.some((route) => pathname.startsWith(route));

  if (needsAuthentication && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", safeNextPath(`${pathname}${search}`));
    return NextResponse.redirect(loginUrl);
  }

  if (!user || !supabase) {
    return response;
  }

  const { data: profile } = await supabase
    .from("users_profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  const role = (profile?.role as UserRole | undefined) ?? null;
  const dashboard = dashboardForRole(role);

  if (publicAuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  const roleNeeded = requiredRole(pathname);
  if (roleNeeded && role !== roleNeeded && role !== "admin") {
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
