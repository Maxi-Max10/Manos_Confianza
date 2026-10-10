import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { BenefitCard } from "@/components/BenefitCard";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { JobCard } from "@/components/JobCard";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { StepCard } from "@/components/StepCard";
import { WorkerCard } from "@/components/WorkerCard";
import { Button } from "@/components/ui/Button";
import {
  familyBenefits,
  familySteps,
  services,
  workerBenefits,
  workerSteps
} from "@/lib/constants";
import { getPublicJobs, getPublicWorkers } from "@/lib/data";

export default async function HomePage() {
  const [workers, jobs] = await Promise.all([getPublicWorkers(), getPublicJobs()]);
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section className="soft-band px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Más seguridad al elegir",
                text: "Perfiles ordenados, referencias visibles y estados de verificación."
              },
              {
                icon: UsersRound,
                title: "Red de cuidado cercana",
                text: "Encontrá personas disponibles por zona, servicio y modalidad."
              },
              {
                icon: Sparkles,
                title: "Experiencia simple",
                text: "Publicá, revisá postulantes y contactá por WhatsApp en pocos pasos."
              }
            ].map((item) => (
              <article key={item.title} className="premium-card lift-card rounded-2xl p-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f2eb] text-teal-700">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="display-title mt-5 text-2xl text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="eyebrow">
                Cómo funciona
              </p>
              <h2 className="display-title mt-3 text-4xl text-slate-950 sm:text-5xl">
                Una experiencia clara para familias y trabajadoras
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Encontrá cuidadoras, niñeras y personal doméstico cerca de tu
                zona en Mendoza, de forma simple, segura y rápida.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-slate-950">Para familias</h3>
                </div>
                <div className="grid gap-4">
                  {familySteps.map((step, index) => (
                    <StepCard key={step.title} step={index + 1} {...step} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-slate-950">
                    Para trabajadoras y cuidadoras
                  </h3>
                </div>
                <div className="grid gap-4">
                  {workerSteps.map((step, index) => (
                    <StepCard key={step.title} step={index + 1} {...step} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="soft-band px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">
                  Servicios
                </p>
                <h2 className="display-title mt-3 text-4xl text-slate-950 sm:text-5xl">
                  Perfiles para cada necesidad del hogar
                </h2>
              </div>
              <Button href="/perfiles" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                Ver perfiles
              </Button>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section id="beneficios" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-6 text-white shadow-card sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">
                Familias
              </p>
              <h2 className="display-title mt-3 text-4xl">
                Más claridad antes de abrir la puerta de tu hogar
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {familyBenefits.map((benefit) => (
                  <BenefitCard key={benefit.title} {...benefit} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#176d65] p-6 text-white shadow-premium sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
                Trabajadoras
              </p>
              <h2 className="display-title mt-3 text-4xl">
                Una presencia profesional para encontrar mejores oportunidades
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {workerBenefits.map((benefit) => (
                  <BenefitCard key={benefit.title} {...benefit} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="soft-band px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">
                  Perfiles destacados
                </p>
                <h2 className="display-title mt-3 text-4xl text-slate-950 sm:text-5xl">
                  Personas preparadas para ayudarte
                </h2>
              </div>
              <Button href="/perfiles" variant="outline">
                Explorar perfiles
              </Button>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {workers.slice(0, 3).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">
                  Oportunidades activas
                </p>
                <h2 className="display-title mt-3 text-4xl text-slate-950 sm:text-5xl">
                  Búsquedas recientes de familias
                </h2>
              </div>
              <Button href="/busquedas" variant="outline">
                Ver búsquedas
              </Button>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {jobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} showStatus={false} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#164b47,#176d65,#42847a)] px-6 py-10 text-white shadow-premium sm:px-10 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
                Manos de Confianza
              </p>
              <h2 className="display-title mt-3 text-4xl">
                Conocé todo lo que podés hacer en Manos de Confianza
              </h2>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Button href="/perfiles" variant="secondary">
                Explorar perfiles
              </Button>
              <Button href="/demo" variant="outline">
                Recorrer la demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
