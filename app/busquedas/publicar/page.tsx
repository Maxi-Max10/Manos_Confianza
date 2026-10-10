"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Send, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CheckboxPills } from "@/components/ui/CheckboxPills";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { serviceTypes, workModes } from "@/lib/constants";
import {
  budgetOptions,
  mendozaZones,
  timeSlotOptions,
  weekDayOptions
} from "@/lib/mendoza-data";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function PublishJobPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("La conexión todavía no está configurada.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const requiredDays = formData.getAll("required_days").map(String);
    if (requiredDays.length === 0) {
      setStatus("Seleccioná al menos un día.");
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: account } = user
      ? await supabase.from("users_profiles").select("id, role").eq("auth_user_id", user.id).maybeSingle()
      : { data: null };
    if (!account || (account.role !== "family" && account.role !== "admin")) {
      setStatus("Necesitás ingresar con una cuenta de familia.");
      setIsLoading(false);
      return;
    }

    const { data: job, error } = await supabase.from("job_posts").insert({
      employer_id: account.id,
      service_type: String(formData.get("service_type") ?? "").slice(0, 100),
      city: String(formData.get("city") ?? "").slice(0, 100),
      required_hours: String(formData.get("required_hours") ?? "").slice(0, 100),
      required_days: requiredDays.join(", ").slice(0, 200),
      modality: String(formData.get("modality") ?? "").slice(0, 100),
      start_date: String(formData.get("start_date") ?? "") || null,
      estimated_budget: String(formData.get("estimated_budget") ?? "").slice(0, 100),
      requires_experience: formData.has("requires_experience"),
      requires_references: formData.has("requires_references"),
      description: String(formData.get("description") ?? "").trim().slice(0, 2000),
      observations: String(formData.get("observations") ?? "").trim().slice(0, 1000),
      status: "active"
    }).select("id").single();
    setIsLoading(false);

    if (error || !job) {
      setStatus("No pudimos publicar la búsqueda. Revisá los datos e intentá nuevamente.");
      return;
    }

    router.push(`/busquedas/${job.id}`);
    router.refresh();
  }

  return (
    <DashboardLayout
      role="family"
      title="Publicar busqueda"
      subtitle="Elegí opciones rápidas para cargar menos datos a mano."
      actions={
        <Button form="job-post-form" type="submit" icon={<Send className="h-4 w-4" />} disabled={isLoading}>
          Publicar busqueda
        </Button>
      }
    >
      <form id="job-post-form" className="grid gap-6" onSubmit={handleSubmit}>
        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Datos principales
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Servicio, zona de Mendoza, días y horario. Lo importante primero.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FormSelect
              label="Tipo de servicio"
              name="service_type"
              placeholder="Seleccionar"
              options={serviceTypes.map((service) => ({
                label: service,
                value: service
              }))}
              required
            />
            <FormSelect
              label="Zona de trabajo"
              name="city"
              placeholder="Departamento / distrito"
              options={mendozaZones.map((zone) => ({
                label: zone,
                value: zone
              }))}
              required
            />
            <FormSelect
              label="Horario"
              name="required_hours"
              placeholder="Seleccionar"
              options={timeSlotOptions.map((slot) => ({
                label: slot,
                value: slot
              }))}
              required
            />
            <FormSelect
              label="Modalidad"
              name="modality"
              placeholder="Seleccionar"
              options={workModes.map((mode) => ({ label: mode, value: mode }))}
              required
            />
          </div>

          <div className="mt-6">
            <CheckboxPills
              label="Dias requeridos"
              name="required_days"
              options={weekDayOptions}
              defaultSelected={["Lunes", "Miercoles", "Viernes"]}
              hint="Selector multiple: tocá todos los dias que necesitás cubrir."
            />
          </div>
        </section>

        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Condiciones simples
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Usá presets para evitar escribir presupuesto y requisitos.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FormInput label="Fecha de inicio" name="start_date" type="date" required />
            <FormSelect
              label="Presupuesto estimado"
              name="estimated_budget"
              placeholder="Seleccionar rango"
              options={budgetOptions.map((budget) => ({
                label: budget,
                value: budget
              }))}
              required
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="micro-bounce flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
              <input
                type="checkbox"
                name="requires_experience"
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                defaultChecked
              />
              Requiere experiencia
            </label>
            <label className="micro-bounce flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
              <input
                type="checkbox"
                name="requires_references"
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                defaultChecked
              />
              Requiere referencias
            </label>
          </div>

          <div className="mt-5">
            <FormTextarea
              label="Descripcion breve"
              name="description"
              placeholder="Opcional: agregá detalles que ayuden a entender la necesidad."
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="mt-5">
            <FormTextarea
              label="Observaciones"
              name="observations"
              placeholder="Opcional: cuidados especiales, mascotas, acceso, movilidad, etc."
              rows={3}
              maxLength={1000}
            />
          </div>

          {status ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {status}
            </p>
          ) : null}
          <Button
            type="submit"
            className="mt-5 w-full sm:w-auto"
            icon={<Send className="h-4 w-4" />}
            disabled={isLoading}
          >
            Publicar busqueda
          </Button>
        </section>
      </form>
    </DashboardLayout>
  );
}
