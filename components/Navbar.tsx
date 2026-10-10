"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { navItems } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { isDemoMode } from "@/lib/demo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e9e1] bg-[#fffefa]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring rounded-2xl">
          <BrandLogo markClassName="h-10 w-10 border-0 shadow-sm" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={isDemoMode ? "/auth/login" : "/demo"} variant="primary" size="sm">
            {isDemoMode ? "Entrar por rol" : "Explorar demo"}
          </Button>
        </div>

        <button
          className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-slate-700 lg:hidden"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <Button href="/perfiles">Ver perfiles</Button>
              <Button href={isDemoMode ? "/auth/login" : "/demo"} variant="outline">{isDemoMode ? "Entrar por rol" : "Explorar demo"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
