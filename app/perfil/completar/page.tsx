"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CheckboxPills } from "@/components/ui/CheckboxPills";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { serviceTypes, workModes } from "@/lib/constants";
import { mendozaZones, timeSlotOptions, weekDayOptions } from "@/lib/mendoza-data";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedDocumentTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

export default function CompleteWorkerProfilePage() {
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
    const photo = formData.get("profile_photo") as File | null;
    const documents = formData.getAll("documents").filter((item): item is File => item instanceof File && item.size > 0);
    if (photo?.size && (!allowedPhotoTypes.has(photo.type) || photo.size > 5 * 1024 * 1024)) {
      setStatus("La foto debe ser JPG, PNG o WebP y pesar hasta 5 MB.");
      setIsLoading(false);
      return;
    }
    if (documents.length > 5 || documents.some((file) => !allowedDocumentTypes.has(file.type) || file.size > 10 * 1024 * 1024)) {
      setStatus("Podés subir hasta 5 documentos PDF, JPG o PNG de hasta 10 MB cada uno.");
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: account } = user
      ? await supabase.from("users_profiles").select("id, role").eq("auth_user_id", user.id).maybeSingle()
      : { data: null };
    if (!user || !account || (account.role !== "worker" && account.role !== "admin")) {
      setStatus("Necesitás ingresar con una cuenta de trabajadora.");
      setIsLoading(false);
      return;
    }

    let photoUrl: string | undefined;
    if (photo?.size) {
      const extension = photo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const photoPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("profile-photos").upload(photoPath, photo, { contentType: photo.type });
      if (error) {
        setStatus("No pudimos subir la foto. Verificá el formato e intentá nuevamente.");
        setIsLoading(false);
        return;
      }
      photoUrl = supabase.storage.from("profile-photos").getPublicUrl(photoPath).data.publicUrl;
    }

    const { error: accountError } = await supabase.from("users_profiles").update({
      first_name: String(formData.get("first_name") ?? "").trim().slice(0, 80),
      last_name: String(formData.get("last_name") ?? "").trim().slice(0, 80),
      phone: String(formData.get("phone") ?? "").trim().slice(0, 30),
      city: String(formData.get("city") ?? "").slice(0, 100)
    }).eq("id", account.id);

    const { data: worker, error: workerError } = await supabase.from("worker_profiles").upsert({
      user_id: account.id,
      ...(photoUrl ? { profile_photo_url: photoUrl } : {}),
      age: Number(formData.get("age")),
      service_type: String(formData.get("service_type") ?? "").slice(0, 100),
      experience_years: Number(formData.get("experience_years")),
      availability: String(formData.get("availability") ?? "").slice(0, 100),
      available_days: formData.getAll("available_days").map(String),
      work_mode: formData.getAll("work_mode").map(String),
      description: String(formData.get("description") ?? "").trim().slice(0, 2000),
      expected_salary: String(formData.get("expected_salary") ?? "").trim().slice(0, 100),
      verification_status: "pending"
    }, { onConflict: "user_id" }).select("id").single();

    if (accountError || workerError || !worker) {
      setStatus("No pudimos guardar el perfil. Revisá los datos e intentá nuevamente.");
      setIsLoading(false);
      return;
    }

    const referenceName = String(formData.get("reference_name") ?? "").trim();
    if (referenceName) {
      await supabase.from("worker_references").insert({
        worker_id: worker.id,
        reference_name: referenceName.slice(0, 120),
        reference_phone: String(formData.get("reference_phone") ?? "").trim().slice(0, 30),
        relationship: String(formData.get("relationship") ?? "").trim().slice(0, 120),
        comment: String(formData.get("reference_comment") ?? "").trim().slice(0, 1000)
      });
    }

    let documentFailure = false;
    for (const document of documents) {
      const safeName = document.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(-100);
      const documentPath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("worker-documents").upload(documentPath, document, { contentType: document.type });
      if (uploadError) {
        documentFailure = true;
        continue;
      }
      const { error: recordError } = await supabase.from("worker_documents").insert({
        worker_id: worker.id,
        document_type: document.type,
        file_url: documentPath,
        status: "pending"
      });
      documentFailure ||= Boolean(recordError);
    }

    setIsLoading(false);
    setStatus(documentFailure
      ? "El perfil se guardó, pero algún documento no pudo subirse. Volvé a intentar con ese archivo."
      : "Perfil guardado. Quedó pendiente de verificación.");
  }

  return (
    <DashboardLayout
      role="worker"
      title="Completar mi perfil"
      subtitle="Cargá tu información laboral, referencias y documentación."
      actions={<Button form="worker-profile-form" type="submit" icon={<Save className="h-4 w-4" />} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar perfil"}</Button>}
    >
      <form id="worker-profile-form" className="grid gap-6" onSubmit={handleSubmit}>
        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">Datos personales</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormInput label="Nombre" name="first_name" maxLength={80} required />
            <FormInput label="Apellido" name="last_name" maxLength={80} required />
            <FormInput label="Foto de perfil" name="profile_photo" type="file" accept="image/jpeg,image/png,image/webp" />
            <FormInput label="Teléfono" name="phone" type="tel" maxLength={30} required />
            <FormInput label="Edad" name="age" type="number" min={18} max={100} required />
            <FormSelect label="Zona / ciudad" name="city" placeholder="Departamento / distrito de Mendoza" options={mendozaZones.map((zone) => ({ label: zone, value: zone }))} required />
            <FormSelect label="Tipo de servicio ofrecido" name="service_type" placeholder="Seleccionar" options={serviceTypes.map((service) => ({ label: service, value: service }))} required />
          </div>
        </section>

        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">Experiencia laboral</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormInput label="Años de experiencia" name="experience_years" type="number" min={0} max={80} required />
            <FormSelect label="Disponibilidad horaria" name="availability" placeholder="Seleccionar" options={timeSlotOptions.map((slot) => ({ label: slot, value: slot }))} required />
            <FormInput label="Pretensión salarial aproximada" name="expected_salary" placeholder="Ej: $3.500 por hora" maxLength={100} required />
          </div>
          <CheckboxPills className="mt-5" label="Días disponibles" name="available_days" options={weekDayOptions} defaultSelected={["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]} hint="Marcá los días en los que querés recibir oportunidades." />
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-slate-800">Modalidad</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {workModes.map((mode) => <label key={mode} className="micro-bounce flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"><input type="checkbox" name="work_mode" value={mode} className="h-4 w-4 rounded border-slate-300 text-blue-600" />{mode}</label>)}
            </div>
          </fieldset>
          <FormTextarea className="mt-5" label="Descripción personal" name="description" placeholder="Contá tu experiencia, forma de trabajo y disponibilidad." maxLength={2000} required />
        </section>

        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">Referencias y documentos</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormInput label="Nombre de referencia" name="reference_name" maxLength={120} />
            <FormInput label="Teléfono de referencia" name="reference_phone" type="tel" maxLength={30} />
            <FormInput label="Relación laboral" name="relationship" maxLength={120} placeholder="Ej: Familia empleadora anterior" />
            <FormInput label="Certificados o documentos" name="documents" type="file" accept="application/pdf,image/jpeg,image/png" multiple />
          </div>
          <FormTextarea className="mt-5" label="Comentario de referencia" name="reference_comment" maxLength={1000} placeholder="Sumá detalles de la referencia laboral." />
        </section>

        <section className="premium-card rounded-2xl p-5 sm:p-6">
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" name="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" /><span>Acepto los términos de uso y autorizo la revisión de la información cargada para el proceso de verificación.</span></label>
          {status ? <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{status}</p> : null}
          <Button type="submit" className="mt-5 w-full sm:w-auto" icon={<Save className="h-4 w-4" />} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar perfil"}</Button>
        </section>
      </form>
    </DashboardLayout>
  );
}
