"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { friendlyAuthError } from "@/lib/auth-errors";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      setStatus("Las contraseñas no coinciden.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("La conexión segura todavía no está configurada.");
      return;
    }

    setIsLoading(true);
    setStatus("");
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setStatus(friendlyAuthError(error.message));
      return;
    }

    router.replace("/auth/login?password=updated");
    router.refresh();
  }

  return (
    <AuthShell title="Nueva contraseña" subtitle="Elegí una contraseña nueva para volver a ingresar.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          label="Nueva contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          maxLength={72}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,72}"
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
        />
        <FormInput
          label="Repetir contraseña"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          required
        />
        {status ? <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">{status}</p> : null}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </form>
    </AuthShell>
  );
}
