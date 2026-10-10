"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { JobStatus, VerificationStatus } from "@/types";

export function AdminProfileActions({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  async function update(status: VerificationStatus) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsLoading(true);
    const { error } = await supabase.from("worker_profiles").update({ verification_status: status }).eq("id", profileId);
    setIsLoading(false);
    if (!error) router.refresh();
  }
  return <div className="grid gap-2 sm:grid-cols-2"><Button size="sm" variant="secondary" icon={<CheckCircle2 className="h-4 w-4" />} disabled={isLoading} onClick={() => update("verified")}>Aprobar perfil</Button><Button size="sm" variant="danger" icon={<XCircle className="h-4 w-4" />} disabled={isLoading} onClick={() => update("rejected")}>Rechazar perfil</Button></div>;
}

export function AdminJobActions({ jobId, currentStatus }: { jobId: string; currentStatus: JobStatus }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  async function update(status: JobStatus) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsLoading(true);
    const { error } = await supabase.from("job_posts").update({ status }).eq("id", jobId);
    setIsLoading(false);
    if (!error) router.refresh();
  }
  return <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" icon={<PauseCircle className="h-4 w-4" />} disabled={isLoading} onClick={() => update(currentStatus === "paused" ? "active" : "paused")}>{currentStatus === "paused" ? "Reactivar" : "Pausar"}</Button><Button size="sm" variant="danger" icon={<XCircle className="h-4 w-4" />} disabled={isLoading} onClick={() => update("closed")}>Cerrar</Button></div>;
}
