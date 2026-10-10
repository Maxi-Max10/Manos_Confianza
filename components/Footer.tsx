import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const footerLinks = [
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Perfiles", href: "/perfiles" },
  { label: "Búsquedas", href: "/busquedas" },
  { label: "Recorrer la demo", href: "/demo" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos de uso", href: "/terminos" }
];

export function Footer() {
  return (
    <footer className="border-t border-[#e8e9e1] bg-[#fffefa]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div><Link href="/" className="focus-ring inline-flex rounded-2xl"><BrandLogo markClassName="h-10 w-10" /></Link><p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">Conectamos hogares con personas de confianza. Una plataforma simple, segura y cercana para familias y trabajadoras del cuidado.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">{footerLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600">{link.label}</Link>)}</div>
      </div>
      <div className="border-t border-slate-100 px-4 py-5 text-center text-xs text-slate-500">© 2026 Manos de Confianza.</div>
    </footer>
  );
}
