"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { quickApplicationMessages } from "@/lib/mendoza-data";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function ApplicationForm({ jobId }: { jobId: string }) {
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus("Ingresá con una cuenta de trabajadora para postularte.");
      setIsLoading(false);
      return;
    }

    const { data: account } = await supabase
      .from("users_profiles")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!account || account.role !== "worker") {
      setStatus("Solo las cuentas de trabajadora pueden postularse.");
      setIsLoading(false);
      return;
    }

    const { data: worker } = await supabase
      .from("worker_profiles")
      .select("id")
      .eq("user_id", account.id)
      .maybeSingle();
    if (!worker) {
      setStatus("Primero completá tu perfil laboral.");
      setIsLoading(false);
      return;
    }

    const template = String(formData.get("message_template") ?? "");
    const note = String(formData.get("message") ?? "").trim();
    const { error } = await supabase.from("applications").insert({
      job_post_id: jobId,
      worker_id: worker.id,
      message: [template, note].filter(Boolean).join(" — ").slice(0, 1000)
    });
    setIsLoading(false);

    if (error?.code === "23505") {
      setStatus("Ya te postulaste a esta búsqueda.");
    } else if (error) {
      setStatus("No pudimos enviar la postulación. Revisá tu sesión e intentá nuevamente.");
    } else {
      setStatus("Postulación enviada correctamente.");
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <FormSelect
        label="Mensaje rapido"
        name="message_template"
        options={quickApplicationMessages.map((message) => ({
          label: message,
          value: message
        }))}
        defaultValue={quickApplicationMessages[0]}
      />
      <FormTextarea
        label="Nota opcional"
        name="message"
        placeholder="Agregá solo si querés sumar un detalle."
        rows={3}
      />
      {status ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          {status}
        </p>
      ) : null}
      <Button type="submit" className="w-full" icon={<Send className="h-4 w-4" />} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Postularme"}
      </Button>
    </form>
  );
}
