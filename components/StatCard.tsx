import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon
}: {
  label: string;
  value: string;
  helper: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="premium-card lift-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        {Icon ? (
          <span className="rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 p-3 text-emerald-600 shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-slate-500">{helper}</p>
    </div>
  );
}
