"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { friendlyAuthError } from "@/lib/auth-errors";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("");

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/nueva-contrasena`
    });

    setIsLoading(false);

    if (error) {
      setStatus(friendlyAuthError(error.message));
      return;
    }

    setStatus("Te enviamos un email para recuperar tu contraseña.");
  }

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Ingresá tu email y te enviaremos un enlace de recuperación."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {status ? (
          <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {status}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        <Link href="/auth/login" className="font-semibold text-blue-600">
          Volver a ingresar
        </Link>
      </p>
    </AuthShell>
  );
}
