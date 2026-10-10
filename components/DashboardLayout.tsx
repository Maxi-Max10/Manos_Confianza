"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  Search,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { LogoutButton } from "@/components/LogoutButton";
import { isDemoMode } from "@/lib/demo";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const navLinks: Array<{
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}> = [
  { label: "Familia", href: isDemoMode ? "/demo/familia" : "/dashboard/familia", icon: LayoutDashboard, roles: ["family", "admin"] },
  { label: "Trabajadora", href: isDemoMode ? "/demo/trabajadora" : "/dashboard/trabajadora", icon: BriefcaseBusiness, roles: ["worker", "admin"] },
  { label: "Admin", href: isDemoMode ? "/demo/admin" : "/dashboard/admin", icon: ShieldCheck, roles: ["admin"] },
  { label: "Búsquedas", href: "/busquedas", icon: Search, roles: ["family", "worker", "admin"] },
  { label: isDemoMode ? "Perfiles" : "Publicar", href: isDemoMode ? "/perfiles" : "/busquedas/publicar", icon: ClipboardList, roles: ["family", "admin"] },
  { label: isDemoMode ? "Inicio" : "Perfil", href: isDemoMode ? "/" : "/perfil/completar", icon: UserRound, roles: ["worker", "admin"] }
];

export function DashboardLayout({
  title,
  subtitle,
  children,
  actions,
  role
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  role?: UserRole;
}) {
  const pathname = usePathname();
  const visibleLinks = isDemoMode ? navLinks : role
    ? navLinks.filter((item) => item.roles.includes(role))
    : navLinks;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,rgba(37,99,235,0.06),rgba(16,185,129,0.06))]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/70 bg-white/90 px-4 py-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl lg:block">
        <Link href="/" className="focus-ring inline-flex rounded-2xl px-2">
          <BrandLogo markClassName="h-10 w-10" />
        </Link>
        <nav className="mt-8 grid gap-1">
          {visibleLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "micro-bounce flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700",
                  isActive && "bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 shadow-sm"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-4 bottom-5">{isDemoMode ? <Link href="/auth/login" className="block rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">← Cambiar de rol</Link> : <LogoutButton />}</div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">{isDemoMode ? "Vista de demostración" : "Panel privado"}</p>
              <h1 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">{title}</h1>
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="hidden sm:block">{actions}</div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:hidden">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600",
                    isActive && "border-blue-200 bg-blue-50 text-blue-700"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            <div className="min-w-28">{isDemoMode ? <Link href="/auth/login" className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">Cambiar de rol</Link> : <LogoutButton />}</div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 sm:hidden">{actions}</div>
          {children}
        </main>
      </div>
    </div>
  );
}
