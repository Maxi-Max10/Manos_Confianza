import { cn } from "@/lib/utils";

type CheckboxPillsProps = {
  label: string;
  name: string;
  options: string[];
  hint?: string;
  defaultSelected?: string[];
  className?: string;
};

export function CheckboxPills({
  label,
  name,
  options,
  hint,
  defaultSelected = [],
  className
}: CheckboxPillsProps) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      <div>
        <legend className="text-sm font-semibold text-slate-800">{label}</legend>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="group cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={defaultSelected.includes(option)}
              className="peer sr-only"
            />
            <span className="micro-bounce inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 group-hover:border-blue-200 group-hover:bg-blue-50 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
