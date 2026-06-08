"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatedSocialButton } from "@/components/animated-social-button";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  photo_url: string | null;
  created_at: string;
}

// ─── Specialization Badge Colors ────────────────────────────────────────────
const specColors: Record<string, string> = {
  Wedding: "bg-rose-900/30 text-rose-300 border-rose-800/30",
  Portrait: "bg-purple-900/30 text-purple-300 border-purple-800/30",
  Event: "bg-blue-900/30 text-blue-300 border-blue-800/30",
  Wildlife: "bg-green-900/30 text-green-300 border-green-800/30",
  "Pre-Wedding": "bg-pink-900/30 text-pink-300 border-pink-800/30",
  Birthday: "bg-yellow-900/30 text-yellow-300 border-yellow-800/30",
  Other: "bg-gold-900/30 text-gold-300 border-gold-800/30",
};

function getSpecColor(spec: string) {
  return specColors[spec] ?? specColors["Other"];
}

// ─── Team Member Card ────────────────────────────────────────────────────────
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative rounded-[2rem] border border-gold-800/15 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-gold-500/25 transition-all duration-400 overflow-hidden shadow-xl flex flex-col">
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400/6 to-transparent rounded-tr-[2rem] pointer-events-none group-hover:from-gold-400/12 transition-all duration-300" />

      {/* Photo */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-[2rem]">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
            <svg className="w-20 h-20 text-gold-800/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />

        {/* Spec badge on photo */}
        <div className="absolute top-4 left-4">
          <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getSpecColor(member.specialization)}`}>
            {member.specialization}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-serif text-xl font-bold text-white tracking-wide group-hover:text-gold-300 transition-colors duration-300">
          {member.name}
        </h3>

        <div className="space-y-2">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-gold-300 transition-colors duration-200 group/link"
          >
            <svg className="w-3.5 h-3.5 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="truncate">{member.email}</span>
          </a>

          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-gold-300 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.106-6.927-6.927l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>{member.phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Team Page ──────────────────────────────────────────────────────────
export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMembers(data.data);
        else setError("Failed to load team members.");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-luxury-bg text-gold-100 overflow-hidden font-sans selection:bg-gold-400 selection:text-neutral-950">

      {/* Background Ornaments */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(214,162,79,0.07),transparent_50%)] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(155,106,36,0.04),transparent_50%)] blur-3xl pointer-events-none animate-glow" />

      {/* Hero Banner */}
      <section className="relative py-20 lg:py-28 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gold-400">The People Behind the Lens</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-6 tracking-tight">
            Meet Our <span className="italic text-gold-300 font-medium">Creative Team</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A passionate collective of visual storytellers — each photographer brings unique expertise and an eye for emotion, 
            turning your most precious moments into timeless memories.
          </p>

          {/* Social Button — centered on mobile */}
          <div className="mt-10 flex justify-center lg:hidden">
            <AnimatedSocialButton size="lg" />
          </div>
          <p className="text-[0.6rem] font-medium tracking-widest uppercase text-neutral-500 mt-2 lg:hidden">
            Tap the logo to connect with us
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 rounded-full border-2 border-gold-400/20 border-t-gold-400 animate-spin" />
            <p className="text-sm text-neutral-400 uppercase tracking-widest font-semibold">Loading Team...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-800/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gold-900/20 border border-gold-800/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-gold-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Team Members Coming Soon</h3>
              <p className="text-sm text-neutral-400 mt-2">Our photographers will be listed here shortly.</p>
            </div>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <>
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                {members.length} talented {members.length === 1 ? "photographer" : "photographers"} in our team
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((m) => <TeamMemberCard key={m.id} member={m} />)}
            </div>
          </>
        )}
      </section>

    </main>
  );
}
