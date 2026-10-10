import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function AuthShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f8fafc,rgba(37,99,235,0.08),rgba(16,185,129,0.08))] px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="focus-ring mx-auto mb-8 flex w-fit rounded-2xl"
        >
          <BrandLogo markClassName="h-10 w-10" />
        </Link>

        <section className="premium-card rounded-3xl p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
