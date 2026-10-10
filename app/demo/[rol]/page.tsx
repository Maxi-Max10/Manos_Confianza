import { notFound } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, HeartHandshake, ShieldCheck, UsersRound } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { WorkerCard } from "@/components/WorkerCard";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { mockJobs, mockWorkers } from "@/lib/mock-data";

export default async function DemoRolePage({ params }: { params: Promise<{ rol: string }> }) {
  const { rol } = await params;
  if (!["familia", "trabajadora", "admin"].includes(rol)) notFound();

  if (rol === "familia") return <DashboardLayout title="Hola, familia" subtitle="Así podés encontrar ayuda para tu hogar." actions={<Button href="/perfiles" icon={<ArrowRight className="h-4 w-4" />}>Explorar perfiles</Button>}>
    <div className="grid gap-4 md:grid-cols-3"><StatCard label="Perfiles de ejemplo" value={String(mockWorkers.length)} helper="En distintos servicios" icon={UsersRound} /><StatCard label="Servicios" value="6" helper="Para cada necesidad" icon={HeartHandshake} /><StatCard label="Búsquedas de ejemplo" value={String(mockJobs.length)} helper="En Mendoza" icon={BriefcaseBusiness} /></div>
    <section className="mt-9"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow">CONOCÉ A LAS PERSONAS</p><h2 className="display-title mt-2 text-3xl text-slate-950">Perfiles destacados</h2></div><Button href="/perfiles" variant="outline">Ver todos</Button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mockWorkers.slice(0, 3).map((worker) => <WorkerCard key={worker.id} worker={worker} />)}</div></section>
    <p className="mt-7 text-xs text-slate-500">Esta es una vista de demostración con datos ficticios.</p>
  </DashboardLayout>;

  if (rol === "trabajadora") return <DashboardLayout title="Hola, trabajadora" subtitle="Una vista de tus oportunidades y tu perfil profesional." actions={<Button href="/busquedas" icon={<ArrowRight className="h-4 w-4" />}>Explorar búsquedas</Button>}>
    <div className="grid gap-4 md:grid-cols-3"><StatCard label="Oportunidades" value={String(mockJobs.filter((job) => job.status === "active").length)} helper="Búsquedas activas de ejemplo" icon={BriefcaseBusiness} /><StatCard label="Zonas" value="Gran Mendoza" helper="Y alrededores" icon={HeartHandshake} /><StatCard label="Tu perfil" value="Visible" helper="Ejemplo de presentación" icon={UsersRound} /></div>
    <section className="mt-9"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow">PARA VOS</p><h2 className="display-title mt-2 text-3xl text-slate-950">Búsquedas recientes</h2></div><Button href="/busquedas" variant="outline">Ver todas</Button></div><div className="grid gap-5 xl:grid-cols-3">{mockJobs.filter((job) => job.status === "active").slice(0, 3).map((job) => <JobCard key={job.id} job={job} showStatus={false} />)}</div></section>
    <p className="mt-7 text-xs text-slate-500">Esta es una vista de demostración con datos ficticios.</p>
  </DashboardLayout>;

  return <DashboardLayout title="Administración" subtitle="Un resumen de cómo se organiza la plataforma." actions={<Button href="/demo" icon={<ShieldCheck className="h-4 w-4" />}>Cambiar vista</Button>}>
    <div className="grid gap-4 md:grid-cols-3"><StatCard label="Perfiles" value={String(mockWorkers.length)} helper="Personas de ejemplo" icon={UsersRound} /><StatCard label="Búsquedas" value={String(mockJobs.length)} helper="Publicaciones de ejemplo" icon={BriefcaseBusiness} /><StatCard label="Servicios" value="6" helper="Categorías disponibles" icon={HeartHandshake} /></div>
    <div className="mt-9 grid gap-6 lg:grid-cols-2"><section className="premium-card rounded-2xl p-6"><p className="eyebrow">COMUNIDAD</p><h2 className="display-title mt-2 text-3xl">Perfiles</h2><div className="mt-5 divide-y divide-slate-100">{mockWorkers.slice(0, 4).map((worker) => <div key={worker.id} className="flex items-center justify-between gap-3 py-4"><div><p className="font-bold">{worker.firstName} {worker.lastName}</p><p className="text-sm text-slate-500">{worker.city}</p></div><Button href={`/perfiles/${worker.id}`} variant="outline" size="sm">Ver perfil</Button></div>)}</div></section><section className="premium-card rounded-2xl p-6"><p className="eyebrow">ACTIVIDAD</p><h2 className="display-title mt-2 text-3xl">Publicaciones</h2><div className="mt-5 divide-y divide-slate-100">{mockJobs.slice(0, 4).map((job) => <div key={job.id} className="flex items-center justify-between gap-3 py-4"><div><p className="font-bold">{job.serviceType}</p><p className="text-sm text-slate-500">{job.city}</p></div><Button href={`/busquedas/${job.id}`} variant="outline" size="sm">Ver</Button></div>)}</div></section></div>
    <p className="mt-7 text-xs text-slate-500">Esta es una vista de demostración con datos ficticios. Las acciones de administración están desactivadas.</p>
  </DashboardLayout>;
}
