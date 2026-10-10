import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="premium-card flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 p-4 text-blue-600 shadow-sm">
        <Inbox className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
