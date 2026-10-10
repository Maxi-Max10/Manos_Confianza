import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[70vh] place-items-center px-4 py-16 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            No encontrado
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Esta página no está disponible
          </h1>
          <p className="mt-4 text-slate-600">
            Volvé al inicio para continuar navegando Manos de Confianza.
          </p>
          <Button href="/" className="mt-6">
            Ir al inicio
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
