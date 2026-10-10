import type { UserRole } from "@/types";

export function dashboardForRole(role: UserRole | null | undefined) {
  if (role === "worker") return "/dashboard/trabajadora";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/familia";
}

export function safeNextPath(value: string | null, fallback = "/dashboard/familia") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
