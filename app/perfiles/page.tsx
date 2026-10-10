import { Filter, UsersRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WorkerCard } from "@/components/WorkerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { serviceTypes } from "@/lib/constants";
import { getPublicWorkers } from "@/lib/data";

type ProfilesPageProps = {
  searchParams?: Promise<{ servicio?: string }>;
};

export default async function ProfilesPage({ searchParams }: ProfilesPageProps) {
  const params = await searchParams;
  const selectedService = params?.servicio;
  const workers = await getPublicWorkers(selectedService);

  return (
    <>
      <Navbar />
      <main>
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                  <UsersRound className="h-4 w-4" aria-hidden="true" />
                  Perfiles
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                  Trabajadoras y cuidadoras disponibles
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Explorá perfiles con experiencia, disponibilidad por zonas de
                  Mendoza, referencias y datos de contacto.
                </p>
              </div>
              {selectedService ? (
                <Badge variant="blue">{selectedService}</Badge>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="flex-1 text-sm leading-6 text-slate-700">
                ¿Querés ver cómo es una ficha completa? Abrí el perfil de demostración.
              </p>
              <Button href="/perfiles/ejemplo" variant="outline">Ver perfil de ejemplo</Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="slate">
                <Filter className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Servicios
              </Badge>
              {serviceTypes.map((service) => (
                <a key={service} href={`/perfiles?servicio=${encodeURIComponent(service)}`}>
                  <Badge variant={service === selectedService ? "green" : "blue"}>
                    {service}
                  </Badge>
                </a>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
            {workers.length === 0 ? (
              <p className="mt-10 rounded-2xl bg-slate-50 p-6 text-center text-slate-600">
                Todavía no hay perfiles verificados con estos filtros.
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
