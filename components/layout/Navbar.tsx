"use client";

import Link from "next/link";

const navItems = [
  { name: "Home", href: "#" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="w-full max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-8 backdrop-blur-xl shadow-2xl">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest text-white"
          >
            MK
          </Link>

          <nav className="hidden gap-10 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition duration-300 hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-blue-500"
          >
            Hire Me
          </a>
        </div>
      </div>
    </header>
  );
}