"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { dashboardForRole, safeNextPath } from "@/lib/auth";
import { friendlyAuthError } from "@/lib/auth-errors";
import { isDemoMode } from "@/lib/demo";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("password") === "updated") {
      setStatus("Contraseña actualizada. Ya podés ingresar.");
    } else if (params.get("error") === "callback") {
      setStatus("El enlace no es válido o venció. Solicitá uno nuevo.");
    }
  }, []);

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    setIsLoading(false);

    if (error) {
      setStatus(friendlyAuthError(error.message));
      return;
    }

    const { data: profile } = await supabase
      .from("users_profiles")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();
    const fallback = dashboardForRole(profile?.role as UserRole | undefined);
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    router.replace(requestedNext ? safeNextPath(requestedNext, fallback) : fallback);
    router.refresh();
  }

  if (isDemoMode) {
    return (
      <AuthShell title="Entrar a la demostración" subtitle="Elegí el rol que querés recorrer.">
        <div className="grid gap-3">
          <Button href="/demo/familia" className="w-full">Entrar como familia</Button>
          <Button href="/demo/trabajadora" variant="secondary" className="w-full">Entrar como trabajadora</Button>
          <Button href="/demo/admin" variant="outline" className="w-full">Entrar como administrador</Button>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Son vistas con datos ficticios. No necesitás email ni contraseña.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Ingresar"
      subtitle="Accedé a tu panel para gestionar búsquedas, perfiles y postulaciones."
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
        <FormInput
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {status ? (
          <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {status}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/auth/recuperar" className="font-semibold text-blue-600">
          Recuperar contraseña
        </Link>
        <Link href="/auth/registro" className="font-semibold text-slate-700">
          Crear cuenta
        </Link>
      </div>
    </AuthShell>
  );
}
