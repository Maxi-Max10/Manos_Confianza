import Image from "next/image";
import { ArrowRight, Check, Heart, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return <section className="hero-section relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-16">
      <div className="relative z-10">
        <span className="eyebrow inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-600" /> CUIDADO CERCANO EN MENDOZA</span>
        <h1 className="display-title mt-7 max-w-2xl text-[3.25rem] leading-[1.04] tracking-tight text-slate-950 sm:text-6xl lg:text-[5.1rem]">
          Encontrá <em className="font-normal text-teal-800">confianza</em> para cuidar lo que más querés.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Conectamos familias con personas dedicadas al cuidado y al hogar. Explorá perfiles y oportunidades de una forma simple y cercana.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/perfiles" size="lg" icon={<ArrowRight className="h-5 w-5" />}>Encontrar ayuda</Button>
          <Button href="/busquedas" size="lg" variant="outline">Buscar trabajo</Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-teal-700" /> Perfiles para explorar</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-700" /> Gran Mendoza y alrededores</span>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[650px] lg:mx-0">
        <div className="hero-image-wrap relative aspect-[1.06] overflow-hidden rounded-[2.2rem] sm:aspect-[1.15]">
          <Image src="/images/hero-care.webp" alt="Cuidadora conversando con una familia en su hogar" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[62%_center]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/30 to-transparent" />
        </div>
        <div className="hero-float-card absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-7 sm:p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><ShieldCheck className="h-6 w-6" /></span>
          <div><p className="text-sm font-bold text-slate-950">Personas y hogares</p><p className="text-xs text-slate-500">Una conexión más humana</p></div>
        </div>
        <div className="absolute -right-3 top-6 grid h-14 w-14 place-items-center rounded-full bg-[#f2b773] text-white shadow-lg sm:-right-5 sm:h-16 sm:w-16"><Heart className="h-7 w-7 fill-white" /></div>
      </div>
    </div>
  </section>;
}
