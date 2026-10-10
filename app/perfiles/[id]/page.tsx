import { notFound } from "next/navigation";
import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  FileCheck,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { getPublicWorker } from "@/lib/data";
import { statusLabel } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo";

type WorkerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkerProfilePage({ params }: WorkerPageProps) {
  const { id } = await params;
  const worker = await getPublicWorker(id);

  if (!worker) {
    notFound();
  }

  const fullName = `${worker.firstName} ${worker.lastName}`;
  const isExample = isDemoMode || worker.id === "ejemplo";

  return (
    <>
      <Navbar />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        {isExample ? (
          <div className="mx-auto mb-6 max-w-7xl rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-900">
            Perfil de demostración. Los datos de esta ficha son ficticios.
          </div>
        ) : null}
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <aside className="premium-card h-fit overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={worker.photoUrl}
                alt={`Foto de ${fullName}`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-slate-950">{fullName}</h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {worker.city}
                  </p>
                </div>
                {isExample ? <Badge variant="blue">Ejemplo</Badge> : (
                  <Badge variant={statusVariant(worker.verificationStatus)}>
                    {statusLabel(worker.verificationStatus)}
                  </Badge>
                )}
              </div>

              {!isExample ? (
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {worker.rating} · {worker.reviewsCount} referencias
                </div>
              ) : null}

              {!isDemoMode && worker.phone ? (
                <>
                  <Button
                    href={createWhatsAppUrl(worker.phone)}
                    external
                    className="mt-6 w-full"
                    variant="secondary"
                    icon={<MessageCircle className="h-4 w-4" />}
                  >
                    Contactar
                  </Button>
                  <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {worker.phone}
                  </p>
                </>
              ) : !isExample ? (
                <Button href="/auth/login" className="mt-6 w-full" variant="secondary">
                  Ingresar como familia para contactar
                </Button>
              ) : null}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="premium-card rounded-2xl p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-950">Perfil laboral</h2>
              </div>
              <p className="mt-5 text-base leading-8 text-slate-700">
                {worker.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail label="Experiencia" value={`${worker.experienceYears} años`} />
                <Detail label="Disponibilidad" value={worker.availability} />
                <Detail label="Pretensión salarial" value={worker.expectedSalary} />
                {!isDemoMode && worker.email ? <Detail label="Email" value={worker.email} /> : null}
              </div>
            </div>

            <div className="premium-card rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-950">
                  Servicios y modalidad
                </h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {worker.serviceTypes.map((service) => (
                  <Badge key={service} variant="blue">
                    {service}
                  </Badge>
                ))}
                {worker.workMode.map((mode) => (
                  <Badge key={mode} variant="green">
                    {mode}
                  </Badge>
                ))}
              </div>
            </div>

            {!isExample ? <div className="grid gap-6 lg:grid-cols-2">
              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-950">Referencias</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {worker.references.map((reference) => (
                    <div key={reference.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-950">
                        {reference.referenceName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {reference.relationship} · {reference.referencePhone}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {reference.comment}
                      </p>
                    </div>
                  ))}
                  {worker.references.length === 0 ? (
                    <p className="text-sm leading-6 text-slate-600">
                      {worker.reviewsCount} referencias o reseñas registradas. Los datos personales de terceros no se publican.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-950">
                    Estado de verificación
                  </h2>
                </div>
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <p className="flex items-center gap-2 font-semibold text-emerald-800">
                    <FileCheck className="h-5 w-5" aria-hidden="true" />
                    {statusLabel(worker.verificationStatus)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-800/80">
                    El perfil muestra datos laborales, referencias y documentación
                    cargada para revisión.
                  </p>
                </div>
              </div>
            </div> : null}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
