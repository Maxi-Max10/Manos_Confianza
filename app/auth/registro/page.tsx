"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { friendlyAuthError } from "@/lib/auth-errors";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { PublicUserRole } from "@/types";

export default function RegisterPage() {
  const [role, setRole] = useState<PublicUserRole>("family");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          accepted_terms: true
        }
      }
    });

    setIsLoading(false);

    if (error) {
      setStatus(friendlyAuthError(error.message));
      return;
    }

    setStatus("Cuenta creada. Revisá tu email para confirmar el acceso.");
  }

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Elegí tu tipo de usuario y empezá a usar Manos de Confianza."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormSelect
          label="Tipo de usuario"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as PublicUserRole)}
          options={[
            { label: "Familia / Empleador", value: "family" },
            { label: "Trabajadora / Cuidadora", value: "worker" }
          ]}
        />

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
          <span>
            Acepto los <Link href="/terminos" className="font-semibold text-blue-600">términos de uso</Link> y la <Link href="/privacidad" className="font-semibold text-blue-600">política de privacidad</Link>.
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Nombre"
            name="first_name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <FormInput
            label="Apellido"
            name="last_name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>
        <FormInput
          label="Teléfono"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          maxLength={72}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,72}"
          title="Usá entre 8 y 72 caracteres, con mayúscula, minúscula y número."
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
        />

        {status ? (
          <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {status}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando..." : "Registrarme"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/auth/login" className="font-semibold text-blue-600">
          Ingresar
        </Link>
      </p>
    </AuthShell>
  );
}
