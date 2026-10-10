import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ServiceCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="premium-card lift-card flex min-h-64 flex-col rounded-2xl p-5">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f2eb] text-teal-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="display-title mt-5 text-2xl text-slate-950">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <Button
        href={`/perfiles?servicio=${encodeURIComponent(title)}`}
        variant="outline"
        className="mt-5 w-full"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Ver perfiles
      </Button>
    </article>
  );
}
