import { Eye, MessageCircle, PlusCircle, UsersRound, WalletCards } from "lucide-react";
import Image from "next/image";
import { ApplicationStatusActions } from "@/components/ApplicationStatusActions";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentAccount } from "@/lib/data";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { statusLabel } from "@/lib/utils";
import type { JobStatus } from "@/types";

type FamilyJob = {
  id: string;
  service_type: string;
  description: string;
  city: string;
  required_days: string;
  required_hours: string;
  estimated_budget: string | null;
  status: JobStatus;
  applications: Array<{ count: number }>;
};

type Applicant = {
  id: string;
  status: "sent" | "seen" | "accepted" | "rejected";
  job_posts: { service_type: string } | null;
  worker_profiles: {
    id: string;
    profile_photo_url: string | null;
    users_profiles: { first_name: string; last_name: string; phone: string | null; city: string | null } | null;
  } | null;
};

export default async function FamilyDashboardPage() {
  const [account, supabase] = await Promise.all([getCurrentAccount(), getSupabaseServerClient()]);
  const [{ data: jobsData }, { data: applicantsData }] = account && supabase
    ? await Promise.all([
        supabase.from("job_posts").select("id, service_type, description, city, required_days, required_hours, estimated_budget, status, applications(count)").eq("employer_id", account.id).order("created_at", { ascending: false }),
        supabase.from("applications").select("id, status, job_posts!inner(service_type, employer_id), worker_profiles!inner(id, profile_photo_url, users_profiles!inner(first_name, last_name, phone, city))").eq("job_posts.employer_id", account.id).order("created_at", { ascending: false }).limit(8)
      ])
    : [{ data: [] }, { data: [] }];
  const jobs = (jobsData ?? []) as unknown as FamilyJob[];
  const applicants = (applicantsData ?? []) as unknown as Applicant[];
  const totalApplicants = jobs.reduce((total, job) => total + (job.applications[0]?.count ?? 0), 0);
  const activeJobs = jobs.filter((job) => job.status === "active").length;

  return (
    <DashboardLayout
      role="family"
      title={`Hola, ${account?.first_name || "familia"}`}
      subtitle="Gestioná tus búsquedas, postulantes y contactos."
      actions={<Button href="/busquedas/publicar" icon={<PlusCircle className="h-4 w-4" />}>Publicar búsqueda</Button>}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Búsquedas activas" value={String(activeJobs)} helper={`${jobs.length} publicaciones totales`} icon={UsersRound} />
        <StatCard label="Postulaciones" value={String(totalApplicants)} helper="Recibidas en tus búsquedas" icon={Eye} />
        <StatCard label="Contactos" value={String(applicants.filter((item) => item.status === "accepted").length)} helper="Postulaciones aceptadas" icon={MessageCircle} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="premium-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-950">Búsquedas publicadas</h2><p className="mt-1 text-sm text-slate-500">Estado, presupuesto y postulantes recibidas.</p></div><Badge variant="blue">{jobs.length} publicaciones</Badge></div>
          <div className="mt-5 space-y-4">
            {jobs.map((job) => <article key={job.id} className="lift-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-blue-600">{job.service_type}</p><h3 className="mt-1 font-bold text-slate-950">{job.city}</h3></div><Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge></div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500"><span>{job.required_days}</span><span>{job.required_hours}</span><span className="flex items-center gap-1 font-semibold text-slate-800"><WalletCards className="h-4 w-4" />{job.estimated_budget || "A convenir"}</span><span>{job.applications[0]?.count ?? 0} postulantes</span></div>
            </article>)}
            {jobs.length === 0 ? <EmptyState title="Todavía no publicaste búsquedas" description="Creá tu primera búsqueda para empezar a recibir postulaciones." /> : null}
          </div>
        </div>

        <div className="premium-card rounded-2xl p-5">
          <h2 className="text-lg font-bold text-slate-950">Postulantes recibidas</h2>
          <div className="mt-5 space-y-4">
            {applicants.map((application) => {
              const profile = application.worker_profiles;
              const person = profile?.users_profiles;
              const fullName = `${person?.first_name || "Trabajadora"} ${person?.last_name || ""}`.trim();
              return <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3"><Image src={profile?.profile_photo_url || "/images/hero-care.webp"} alt={`Foto de ${fullName}`} width={48} height={48} className="h-12 w-12 rounded-2xl object-cover" /><div className="min-w-0"><h3 className="truncate font-bold text-slate-950">{fullName}</h3><p className="truncate text-sm text-slate-500">{person?.city || "Mendoza"} · {application.job_posts?.service_type}</p></div></div>
                <div className="mt-4 grid gap-2"><div className="grid gap-2 sm:grid-cols-2"><Button href={profile ? `/perfiles/${profile.id}` : "/perfiles"} variant="outline" size="sm" icon={<Eye className="h-4 w-4" />}>Ver perfil</Button>{person?.phone ? <Button href={createWhatsAppUrl(person.phone)} external variant="secondary" size="sm" icon={<MessageCircle className="h-4 w-4" />}>WhatsApp</Button> : null}</div>{application.status === "sent" || application.status === "seen" ? <ApplicationStatusActions applicationId={application.id} /> : <Badge variant={statusVariant(application.status)}>{statusLabel(application.status)}</Badge>}</div>
              </article>;
            })}
            {applicants.length === 0 ? <EmptyState title="Sin postulaciones por ahora" description="Cuando alguien se postule, aparecerá en este panel." /> : null}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
