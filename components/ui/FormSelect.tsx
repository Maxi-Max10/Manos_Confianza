import { cn } from "@/lib/utils";

type FormSelectProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  hint?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({
  label,
  options,
  placeholder,
  hint,
  className,
  id,
  ...props
}: FormSelectProps) {
  const selectId = id ?? props.name ?? label;

  return (
    <label className="block space-y-2" htmlFor={selectId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        id={selectId}
        className={cn(
          "focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 text-sm font-medium text-slate-900 shadow-sm transition duration-200 hover:border-blue-200 focus-visible:border-blue-500",
          className
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
