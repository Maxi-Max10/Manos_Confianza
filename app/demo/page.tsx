import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, House, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const roles = [
  { slug: "familia", title: "Soy familia", description: "Explorá búsquedas, postulantes y perfiles de cuidado.", icon: House, number: "01" },
  { slug: "trabajadora", title: "Soy trabajadora", description: "Mirá oportunidades, tu perfil y el seguimiento de postulaciones.", icon: BriefcaseBusiness, number: "02" },
  { slug: "admin", title: "Administración", description: "Conocé cómo se organiza la comunidad y sus publicaciones.", icon: ShieldCheck, number: "03" }
] as const;

export default function DemoPage() {
  return <><Navbar /><main className="demo-hub px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <span className="eyebrow">RECORRÉ LA PLATAFORMA</span>
      <h1 className="display-title mt-5 max-w-3xl text-5xl leading-[1.05] text-slate-950 sm:text-6xl">Una mirada a Manos de Confianza</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Elegí una vista para conocer la experiencia. Los perfiles y búsquedas son de ejemplo; podés recorrer todo sin crear una cuenta.</p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {roles.map(({ slug, title, description, icon: Icon, number }) => <Link key={slug} href={`/demo/${slug}`} className="demo-role-card group focus-ring">
          <div className="flex items-start justify-between"><span className="demo-role-icon"><Icon className="h-7 w-7" /></span><span className="text-sm font-semibold text-slate-400">{number} / 03</span></div>
          <h2 className="display-title mt-10 text-3xl text-slate-950">{title}</h2>
          <p className="mt-3 min-h-16 text-sm leading-7 text-slate-600">{description}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-teal-800 group-hover:gap-3">Entrar a la vista <ArrowRight className="h-4 w-4" /></span>
        </Link>)}
      </div>
      <div className="mt-8 flex flex-wrap gap-5"><Link className="text-sm font-semibold text-teal-800 underline underline-offset-4" href="/perfiles">Ver perfiles</Link><Link className="text-sm font-semibold text-teal-800 underline underline-offset-4" href="/busquedas">Ver búsquedas</Link></div>
    </div>
  </main><Footer /></>;
}
