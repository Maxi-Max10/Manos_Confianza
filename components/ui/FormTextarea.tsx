import { cn } from "@/lib/utils";

type FormTextareaProps = {
  label: string;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({
  label,
  hint,
  className,
  id,
  ...props
}: FormTextareaProps) {
  const textareaId = id ?? props.name ?? label;

  return (
    <label className="block space-y-2" htmlFor={textareaId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        id={textareaId}
        className={cn(
          "focus-ring min-h-28 w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 py-3 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-blue-200 focus-visible:border-blue-500",
          className
        )}
        {...props}
      />
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
