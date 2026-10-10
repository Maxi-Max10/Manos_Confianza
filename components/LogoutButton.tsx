"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    setIsLoading(true);
    await supabase?.auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      icon={<LogOut className="h-4 w-4" />}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Saliendo..." : "Salir"}
    </Button>
  );
}
