import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  href?: string;
  external?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#176d65] text-white shadow-lg shadow-teal-900/15 hover:bg-[#10564f]",
  secondary:
    "bg-[#cf7954] text-white shadow-lg shadow-orange-900/10 hover:bg-[#b96644]",
  outline:
    "border border-[#cadbd4] bg-white/90 text-[#155e57] shadow-sm hover:border-teal-400 hover:bg-teal-50",
  ghost: "text-slate-700 hover:bg-white/75 hover:text-blue-700",
  danger: "bg-rose-50 text-rose-700 shadow-sm hover:bg-rose-100"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-11 gap-2.5 px-4 text-sm",
  lg: "h-12 gap-3 px-5 text-base"
};

export function Button({
  href,
  external,
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const buttonClassName = cn(
    "focus-ring micro-bounce inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClassName} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
