import type { LucideIcon } from "lucide-react";

export function BenefitCard({
  title,
  icon: Icon
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="micro-bounce flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold leading-5 text-slate-800">{title}</span>
    </div>
  );
}
