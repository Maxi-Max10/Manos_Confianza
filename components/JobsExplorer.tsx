"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { FormSelect } from "@/components/ui/FormSelect";
import { serviceTypes, workModes } from "@/lib/constants";
import { mendozaZones, timeSlotOptions } from "@/lib/mendoza-data";
import type { JobPost } from "@/types";

export function JobsExplorer({ jobs }: { jobs: JobPost[] }) {
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");
  const [modality, setModality] = useState("");
  const [dateRange, setDateRange] = useState("");
  const cities = Array.from(new Set([...mendozaZones, ...jobs.map((job) => job.city)]));

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const ageInDays = Math.ceil((Date.now() - new Date(job.createdAt).getTime()) / 86_400_000);
    return (!service || job.serviceType === service)
      && (!city || job.city === city)
      && (!modality || job.modality === modality)
      && (!availability || `${job.requiredDays} ${job.requiredHours}`.toLowerCase().includes(availability.toLowerCase()))
      && (!dateRange || ageInDays <= Number(dateRange));
  }), [availability, city, dateRange, jobs, modality, service]);

  return (
    <>
      <Navbar />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                <Search className="h-4 w-4" aria-hidden="true" /> Búsquedas disponibles
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Oportunidades cerca de tu zona en Mendoza</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">Filtrá publicaciones activas por servicio, zona, disponibilidad, modalidad y fecha.</p>
            </div>
            <Button href="/demo/familia" variant="secondary">Ver vista familia</Button>
          </div>

          <section className="premium-card mt-8 rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2"><Filter className="h-5 w-5 text-blue-600" /><h2 className="font-bold text-slate-950">Filtros</h2></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <FormSelect label="Tipo de servicio" placeholder="Todos" value={service} onChange={(e) => setService(e.target.value)} options={serviceTypes.map((item) => ({ label: item, value: item }))} />
              <FormSelect label="Zona" placeholder="Todas" value={city} onChange={(e) => setCity(e.target.value)} options={cities.map((item) => ({ label: item, value: item }))} />
              <FormSelect label="Disponibilidad" placeholder="Cualquiera" value={availability} onChange={(e) => setAvailability(e.target.value)} options={timeSlotOptions.map((item) => ({ label: item, value: item }))} />
              <FormSelect label="Modalidad" placeholder="Todas" value={modality} onChange={(e) => setModality(e.target.value)} options={workModes.map((item) => ({ label: item, value: item }))} />
              <FormSelect label="Fecha" placeholder="Todas" value={dateRange} onChange={(e) => setDateRange(e.target.value)} options={[{ label: "Últimos 7 días", value: "7" }, { label: "Últimos 14 días", value: "14" }, { label: "Últimos 30 días", value: "30" }]} />
            </div>
          </section>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">{filteredJobs.map((job) => <JobCard key={job.id} job={job} showStatus={false} />)}</div>
          {filteredJobs.length === 0 ? <div className="mt-8"><EmptyState title="No hay búsquedas con esos filtros" description="Probá ampliando la zona, modalidad o fecha para ver más oportunidades." /></div> : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
