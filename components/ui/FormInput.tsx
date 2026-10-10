import { cn } from "@/lib/utils";

type FormInputProps = {
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormInput({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        id={inputId}
        className={cn(
          "focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-blue-200 focus-visible:border-blue-500",
          error && "border-rose-300",
          className
        )}
        {...props}
      />
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
