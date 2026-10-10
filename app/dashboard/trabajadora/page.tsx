import { BadgeCheck, BriefcaseBusiness, CheckCircle2, PlusCircle, Send, UserRound } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EmptyState } from "@/components/EmptyState";
import { JobCard } from "@/components/JobCard";
import { StatCard } from "@/components/StatCard";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentAccount, getPublicJobs } from "@/lib/data";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { statusLabel } from "@/lib/utils";
import type { ApplicationStatus, VerificationStatus } from "@/types";

type WorkerData = { id: string; verification_status: VerificationStatus };
type WorkerApplication = {
  id: string;
  status: ApplicationStatus;
  job_posts: { id: string; service_type: string; city: string } | null;
};

export default async function WorkerDashboardPage() {
  const [account, supabase, jobs] = await Promise.all([getCurrentAccount(), getSupabaseServerClient(), getPublicJobs()]);
  const { data: workerData } = account && supabase
    ? await supabase.from("worker_profiles").select("id, verification_status").eq("user_id", account.id).maybeSingle()
    : { data: null };
  const worker = workerData as WorkerData | null;
  const { data: applicationData } = worker && supabase
    ? await supabase.from("applications").select("id, status, job_posts!inner(id, service_type, city)").eq("worker_id", worker.id).order("created_at", { ascending: false })
    : { data: [] };
  const applications = (applicationData ?? []) as unknown as WorkerApplication[];

  return (
    <DashboardLayout
      role="worker"
      title={`Hola, ${account?.first_name || "trabajadora"}`}
      subtitle="Completá tu perfil, revisá oportunidades y seguí tus postulaciones."
      actions={<Button href="/perfil/completar" icon={<PlusCircle className="h-4 w-4" />}>Completar mi perfil</Button>}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Estado del perfil" value={worker ? statusLabel(worker.verification_status) : "Incompleto"} helper="Revisión de identidad y experiencia" icon={UserRound} />
        <StatCard label="Postulaciones" value={String(applications.length)} helper="Enviadas a familias" icon={Send} />
        <StatCard label="Aceptadas" value={String(applications.filter((item) => item.status === "accepted").length)} helper="Contactos confirmados" icon={BriefcaseBusiness} />
      </section>

      <section className="premium-card mt-8 rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Estado del perfil</h2><p className="mt-1 text-sm text-slate-500">La verificación mejora la visibilidad ante familias.</p></div><Badge variant={statusVariant(worker?.verification_status || "incomplete")}>{statusLabel(worker?.verification_status || "incomplete")}</Badge></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Datos personales completos", "Referencias laborales cargadas", "Documentación revisada"].map((item, index) => <div key={item} className="micro-bounce flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{worker && index < 2 ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <BadgeCheck className="h-5 w-5 text-amber-500" />}<span className="text-sm font-semibold text-slate-700">{item}</span></div>)}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-lg font-bold text-slate-950">Búsquedas disponibles</h2><p className="mt-1 text-sm text-slate-500">Publicaciones activas para revisar.</p></div><Button href="/busquedas" variant="outline">Ver todas</Button></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">{jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} showStatus={false} />)}</div>
        {jobs.length === 0 ? <div className="mt-5"><EmptyState title="No hay búsquedas activas" description="Las nuevas oportunidades aparecerán acá." /></div> : null}
      </section>

      <section className="premium-card mt-8 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-slate-950">Mis postulaciones</h2>
        <div className="mt-5 divide-y divide-slate-100">{applications.map((application) => <div key={application.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold text-slate-950">{application.job_posts?.service_type || "Búsqueda"}</h3><p className="mt-1 text-sm text-slate-500">{application.job_posts?.city || "Mendoza"}</p></div><Badge variant={statusVariant(application.status)}>{statusLabel(application.status)}</Badge></div>)}</div>
        {applications.length === 0 ? <EmptyState title="Todavía no te postulaste" description="Explorá las búsquedas y enviá tu interés." /> : null}
      </section>
    </DashboardLayout>
  );
}
