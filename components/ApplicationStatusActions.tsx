"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function ApplicationStatusActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateStatus(status: "accepted" | "rejected") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsLoading(true);
    const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId);
    setIsLoading(false);
    if (!error) router.refresh();
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button size="sm" variant="secondary" icon={<CheckCircle2 className="h-4 w-4" />} disabled={isLoading} onClick={() => updateStatus("accepted")}>Aceptar</Button>
      <Button size="sm" variant="danger" icon={<XCircle className="h-4 w-4" />} disabled={isLoading} onClick={() => updateStatus("rejected")}>Rechazar</Button>
    </div>
  );
}
