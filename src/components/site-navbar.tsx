"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedSocialButton } from "@/components/animated-social-button";

const NAV_LINKS = [
  { href: "/#services", label: "Services", match: null },
  { href: "/#gallery", label: "Portfolio", match: null },
  { href: "/#about", label: "Our Story", match: null },
  { href: "/team", label: "Team", match: "/team" },
  { href: "/#book", label: "Book", match: null },
];

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-luxury-bg/80 backdrop-blur-xl border-b border-gold-800/15 py-4 transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-14 h-14 overflow-hidden rounded-full border border-gold-400/20 bg-neutral-900 group-hover:border-gold-300 transition duration-300">
            <Image src="/logo.png" alt="Team Jajabor Logo" fill className="object-cover scale-110" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-widest bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent group-hover:from-gold-100 group-hover:to-gold-300 transition-all duration-300">
              TEAM JAJABOR
            </span>
            <p className="text-[0.55rem] font-semibold tracking-[0.24em] text-gold-400 uppercase">
              Photography Team of Happiness
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-neutral-300">
          {NAV_LINKS.map((link) => {
            const active = link.match ? pathname === link.match : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gold-300 transition duration-200 ${active ? "text-gold-300" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center">
            <AnimatedSocialButton />
          </div>
          <a
            href="tel:7585920952"
            className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300 hover:text-white transition duration-200 bg-gold-900/20 border border-gold-800/30 rounded-xl px-4 py-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.106-6.927-6.927l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            7585920952
          </a>
          <Link
            href="/#book"
            className="relative overflow-hidden bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(214,162,79,0.2)] hover:shadow-[0_4px_20px_rgba(214,162,79,0.4)] transition duration-300 hover:scale-[1.02]"
          >
            Book Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
