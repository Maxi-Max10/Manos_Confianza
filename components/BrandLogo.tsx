import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  showText?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

export function BrandLogo({
  showText = true,
  className,
  markClassName,
  textClassName
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-white/80 bg-white shadow-md shadow-blue-600/10",
          markClassName
        )}
      >
        <Image
          src="/images/logo-mark.webp"
          alt={showText ? "" : "Manos de Confianza"}
          fill
          sizes="44px"
          className="object-contain p-1"
          priority
        />
      </span>
      {showText ? (
        <span
          className={cn(
            "font-bold leading-tight text-slate-950",
            textClassName
          )}
        >
          Manos de Confianza
        </span>
      ) : null}
    </span>
  );
}
