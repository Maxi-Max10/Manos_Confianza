import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "green" | "amber" | "rose" | "slate";

const variants: Record<BadgeVariant, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700"
};

export function Badge({
  children,
  variant = "slate",
  className
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  if (["active", "verified", "accepted"].includes(status)) return "green";
  if (["pending", "paused", "seen"].includes(status)) return "amber";
  if (["closed", "rejected"].includes(status)) return "rose";
  if (["sent", "incomplete"].includes(status)) return "blue";
  return "slate";
}
