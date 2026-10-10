import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  WalletCards
} from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/Badge";
import { getPublicJob } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo";
import { Button } from "@/components/ui/Button";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getPublicJob(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="premium-card rounded-2xl p-6 sm:p-8">
            <Badge variant="blue">{job.serviceType}</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {job.city}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-700">
              {job.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Días" value={job.requiredDays} />
              <Detail icon={Clock} label="Horarios" value={job.requiredHours} />
              <Detail icon={MapPin} label="Modalidad" value={job.modality} />
              <Detail icon={WalletCards} label="Presupuesto" value={job.estimatedBudget} />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Requirement
                label="Requiere experiencia"
                value={job.requiresExperience ? "Sí" : "No excluyente"}
              />
              <Requirement
                label="Requiere referencias"
                value={job.requiresReferences ? "Sí" : "No excluyente"}
              />
              <Requirement label="Fecha de inicio" value={formatDate(job.startDate)} />
              <Requirement label="Publicado" value={formatDate(job.createdAt)} />
            </div>

            {job.observations ? (
              <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-800">Observaciones</p>
                <p className="mt-2 text-sm leading-6 text-emerald-800/80">
                  {job.observations}
                </p>
              </div>
            ) : null}
          </section>

          <aside id="postularme" className="premium-card h-fit rounded-2xl p-6">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              {isDemoMode ? "VISTA DE EJEMPLO" : "Postulación"}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              {isDemoMode ? "Conocé la experiencia" : "Enviá tu interés"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isDemoMode ? "Esta búsqueda es ficticia. Podés recorrer el panel de trabajadora y explorar más oportunidades sin registrarte." : "Elegí un mensaje rápido y agregá una nota solo si hace falta."}
            </p>
            {isDemoMode ? <Button href="/demo/trabajadora" className="mt-6 w-full">Ver vista trabajadora</Button> : <ApplicationForm jobId={job.id} />}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Requirement({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <CheckCircle2 className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-slate-950">{label}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
    </div>
  );
}
