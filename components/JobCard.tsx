import { CalendarDays, Clock, Eye, MapPin, Send } from "lucide-react";
import type { JobPost } from "@/types";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, statusLabel } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo";

export function JobCard({
  job,
  showStatus = true,
  showApply = true
}: {
  job: JobPost;
  showStatus?: boolean;
  showApply?: boolean;
}) {
  return (
    <article className="premium-card lift-card rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600">{job.serviceType}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{job.city}</h3>
        </div>
        {showStatus ? (
          <Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge>
        ) : null}
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {job.description}
      </p>

      <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {job.requiredDays}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {job.requiredHours}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {job.modality}
        </span>
        <span className="font-semibold text-slate-900">{job.estimatedBudget}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
        <span>{job.applicantsCount} postulantes</span>
        <span>{isDemoMode ? "Publicación de ejemplo" : `Publicado ${formatDate(job.createdAt)}`}</span>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button
          href={`/busquedas/${job.id}`}
          variant="outline"
          icon={<Eye className="h-4 w-4" />}
        >
          Ver detalle
        </Button>
        {showApply && !isDemoMode ? (
          <Button href={`/busquedas/${job.id}#postularme`} icon={<Send className="h-4 w-4" />}>
            Postularme
          </Button>
        ) : isDemoMode ? <Button href={`/busquedas/${job.id}`} icon={<Send className="h-4 w-4" />}>Conocer más</Button> : null}
      </div>
    </article>
  );
}
