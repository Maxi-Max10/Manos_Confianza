import { BadgeCheck, Ban, CheckCircle2, ShieldCheck, UsersRound } from "lucide-react";
import Image from "next/image";
import { AdminJobActions, AdminProfileActions } from "@/components/AdminActions";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { statusLabel } from "@/lib/utils";
import type { JobStatus, UserRole, VerificationStatus } from "@/types";

type Account = { id: string; first_name: string; last_name: string; email: string; role: UserRole };
type Worker = { id: string; profile_photo_url: string | null; verification_status: VerificationStatus; users_profiles: { first_name: string; last_name: string; city: string | null } | null };
type Job = { id: string; service_type: string; city: string; description: string; status: JobStatus };

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();
  const [{ data: accountData }, { data: workerData }, { data: jobData }] = supabase
    ? await Promise.all([
        supabase.from("users_profiles").select("id, first_name, last_name, email, role").order("created_at", { ascending: false }).limit(100),
        supabase.from("worker_profiles").select("id, profile_photo_url, verification_status, users_profiles!inner(first_name, last_name, city)").order("created_at", { ascending: false }).limit(100),
        supabase.from("job_posts").select("id, service_type, city, description, status").order("created_at", { ascending: false }).limit(100)
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];
  const users = (accountData ?? []) as unknown as Account[];
  const workers = (workerData ?? []) as unknown as Worker[];
  const jobs = (jobData ?? []) as unknown as Job[];
  const pending = workers.filter((worker) => worker.verification_status === "pending").length;

  return (
    <DashboardLayout role="admin" title="Panel administrador" subtitle="Usuarios, perfiles, publicaciones y métricas de la plataforma." actions={<Button href="/dashboard/admin" icon={<ShieldCheck className="h-4 w-4" />}>Actualizar panel</Button>}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuarios" value={String(users.length)} helper="Cuentas registradas" icon={UsersRound} />
        <StatCard label="Por verificar" value={String(pending)} helper="Perfiles pendientes" icon={BadgeCheck} />
        <StatCard label="Perfiles aprobados" value={String(workers.filter((item) => item.verification_status === "verified").length)} helper="Visibles públicamente" icon={CheckCircle2} />
        <StatCard label="Búsquedas cerradas" value={String(jobs.filter((item) => item.status === "closed").length)} helper="Publicaciones finalizadas" icon={Ban} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="premium-card rounded-2xl p-5"><h2 className="text-lg font-bold text-slate-950">Usuarios</h2><div className="mt-5 divide-y divide-slate-100">{users.map((user) => <div key={user.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div className="min-w-0"><p className="truncate font-semibold text-slate-950">{user.first_name} {user.last_name}</p><p className="truncate text-sm text-slate-500">{user.email}</p></div><Badge variant={user.role === "family" ? "blue" : user.role === "admin" ? "amber" : "green"}>{user.role === "family" ? "Familia" : user.role === "worker" ? "Trabajadora" : "Admin"}</Badge></div>)}</div>{users.length === 0 ? <EmptyState title="Sin usuarios" description="Las cuentas registradas aparecerán acá." /> : null}</div>

        <div className="premium-card rounded-2xl p-5"><h2 className="text-lg font-bold text-slate-950">Perfiles de trabajadoras</h2><div className="mt-5 space-y-4">{workers.map((worker) => { const person = worker.users_profiles; return <article key={worker.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Image src={worker.profile_photo_url || "/images/hero-care.webp"} alt={`Foto de ${person?.first_name || "trabajadora"}`} width={48} height={48} className="h-12 w-12 rounded-2xl object-cover" /><div><p className="font-bold text-slate-950">{person?.first_name} {person?.last_name}</p><p className="text-sm text-slate-500">{person?.city || "Mendoza"}</p></div></div><Badge variant={statusVariant(worker.verification_status)}>{statusLabel(worker.verification_status)}</Badge></div><div className="mt-4 grid gap-2 lg:grid-cols-[1fr_auto]"><AdminProfileActions profileId={worker.id} /><Button href={`/perfiles/${worker.id}`} size="sm" variant="outline">Ver perfil</Button></div></article>; })}</div>{workers.length === 0 ? <EmptyState title="Sin perfiles" description="Los perfiles enviados aparecerán acá." /> : null}</div>
      </section>

      <section className="premium-card mt-8 rounded-2xl p-5"><h2 className="text-lg font-bold text-slate-950">Publicaciones</h2><div className="mt-5 space-y-4">{jobs.map((job) => <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold text-blue-600">{job.service_type}</p><h3 className="mt-1 font-bold text-slate-950">{job.city}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500">{job.description}</p></div><div className="flex flex-wrap items-center gap-2"><Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge><AdminJobActions jobId={job.id} currentStatus={job.status} /></div></div></article>)}</div>{jobs.length === 0 ? <EmptyState title="Sin publicaciones" description="Las búsquedas creadas aparecerán acá." /> : null}</section>
    </DashboardLayout>
  );
}
