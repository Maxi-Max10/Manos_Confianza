import { NextResponse } from "next/server";
import { dashboardForRole, safeNextPath } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { UserRole } from "@/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next");
  const supabase = await getSupabaseServerClient();

  if (!code || !supabase) {
    return NextResponse.redirect(new URL("/auth/login?error=callback", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/auth/login?error=callback", url.origin));
  }

  if (requestedNext) {
    return NextResponse.redirect(new URL(safeNextPath(requestedNext), url.origin));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("users_profiles")
        .select("role")
        .eq("auth_user_id", user.id)
        .maybeSingle()
    : { data: null };

  return NextResponse.redirect(
    new URL(dashboardForRole(profile?.role as UserRole | undefined), url.origin)
  );
}
