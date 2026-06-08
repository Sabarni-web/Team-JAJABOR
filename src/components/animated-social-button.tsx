"use client";

import { useState } from "react";
import Image from "next/image";

export function AnimatedSocialButton({ size = "md" }: { size?: "md" | "lg" }) {
  const [expanded, setExpanded] = useState(false);
  const isLg = size === "lg";

  const socials = [
    { label: "Instagram", href: "https://instagram.com", angle: -90, icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { label: "Facebook", href: "https://facebook.com", angle: 180, icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
    { label: "WhatsApp", href: "https://wa.me/917585920952", angle: 0, icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
    { label: "YouTube", href: "https://youtube.com", angle: 270, icon: "M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  ];

  const wrap = isLg ? "w-32 h-32" : "w-20 h-20";
  const center = isLg ? "w-16 h-16" : "w-12 h-12";
  const radius = isLg ? 52 : 38;
  const satSize = isLg ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${wrap}`}>
      <div
        className="absolute rounded-full"
        style={{
          width: isLg ? 64 : 52,
          height: isLg ? 64 : 52,
          background: "radial-gradient(circle, rgba(214,162,79,0.35) 0%, transparent 70%)",
          filter: "blur(6px)",
          animation: "socialGlow 2.5s ease-in-out infinite",
        }}
      />
      {socials.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = expanded ? Math.cos(rad) * radius : 0;
        const y = expanded ? Math.sin(rad) * radius : 0;
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: expanded ? 1 : 0,
              pointerEvents: expanded ? "auto" : "none",
              transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s, opacity 0.3s ease ${i * 0.05}s`,
              zIndex: 10,
            }}
            className={`${satSize} rounded-full bg-neutral-900 border border-gold-500/50 flex items-center justify-center text-gold-300 hover:text-white hover:border-gold-300 hover:bg-gold-900/40 transition-colors duration-200 shadow-[0_0_12px_rgba(214,162,79,0.3)]`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
          </a>
        );
      })}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`relative z-20 ${center} rounded-full border-2 border-gold-400/60 bg-neutral-950 flex items-center justify-center cursor-pointer hover:border-gold-300 transition-all duration-300 overflow-hidden`}
        style={{
          boxShadow: expanded
            ? "0 0 0 4px rgba(214,162,79,0.12), 0 0 20px rgba(214,162,79,0.35)"
            : "0 0 0 3px rgba(214,162,79,0.08), 0 0 12px rgba(214,162,79,0.15)",
          animation: expanded ? "none" : "socialPulse 2.5s ease-in-out infinite",
        }}
        aria-label="Toggle social links"
      >
        <div className="relative w-full h-full">
          <Image src="/logo.png" alt="Jajabor" fill className="object-cover scale-110" />
        </div>
      </button>
    </div>
  );
}
