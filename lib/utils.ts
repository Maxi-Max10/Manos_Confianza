export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Activa",
    paused: "Pausada",
    closed: "Cerrada",
    incomplete: "Incompleto",
    pending: "Pendiente de verificación",
    verified: "Verificado",
    rejected: "Rechazado",
    sent: "Enviada",
    seen: "Vista",
    accepted: "Aceptada",
    rejected_application: "Rechazada"
  };

  if (status === "rejected") {
    return "Rechazada";
  }

  return labels[status] ?? status;
}
