import type { LucideIcon } from "lucide-react";

export function StepCard({
  step,
  title,
  description,
  icon: Icon
}: {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="premium-card lift-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600 shadow-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-bold text-emerald-600">Paso {step}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
