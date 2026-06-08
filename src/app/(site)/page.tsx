"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { AnimatedSocialButton } from "@/components/animated-social-button";

// ─── Data ────────────────────────────────────────────────────────────────────
const services = [
  {
    title: "Wedding Photography",
    slug: "wedding",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    description: "Immersive, royal, and highly emotional coverage capturing your most sacred vows in timeless cinematic frames.",
    tagline: "Royal & Eternal"
  },
  {
    title: "Pre-wedding Shoot",
    slug: "pre-wedding",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    description: "Candid, romantic, and artistically staged moments at gorgeous scenic locations under golden hour lighting.",
    tagline: "Romantic & Scenic"
  },
  {
    title: "Rice Ceremony",
    slug: "rice-ceremony",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
    description: "Cherishing your little one's traditional Annaprashan milestones with warm, precious baby close-ups.",
    tagline: "Warm & Traditional"
  },
  {
    title: "Bridal Portraiture",
    slug: "bridal",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.01-3.012a5.977 5.977 0 0111.764-1 .25.25 0 00.25.206h.365a1.884 1.884 0 001.884-1.884V5.117a1.884 1.884 0 00-1.884-1.884h-.365a.25.25 0 00-.25.206 5.978 5.978 0 01-11.764 1m0 0a5.99 5.99 0 001.5 3.886m0 0a15.998 15.998 0 003.388 1.62m0 0a15.998 15.998 0 003.388-1.62m0 0a15.998 15.998 0 00-3.388-1.62" />
      </svg>
    ),
    description: "Detailed captures emphasizing intricate jewelry, exquisite makeup, and the elegant, glowing bride.",
    tagline: "Elegant & Detailed"
  },
  {
    title: "Engagement Shoot",
    slug: "engagement",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    description: "Candid emotional ring exchanges, beautiful hand-locking details, and initial promise milestones.",
    tagline: "Joyful & Candid"
  },
  {
    title: "Birthday Joy",
    slug: "birthday",
    icon: (
      <svg className="w-6 h-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.01 6 8.974 6 10.066V11.25m6-3c1.355 0 2.697.056 4.024.166C17.155 8.01 18 8.974 18 10.066V11.25m-12 0c.13 1.178.252 2.374.368 3.578c.042.44.408.772.85.772h9.564c.442 0 .808-.332.85-.772c.116-1.204.238-2.4.368-3.578m-12 0h12m-9 6v-1.5m6 1.5v-1.5m-3 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    description: "Vibrant, playful, and high-energy child birthday portraits packed with colorful decorations and smiles.",
    tagline: "Playful & Colorful"
  }
];

const galleryItems = [
  { title: "The Golden Vow", category: "wedding", image: "/images/wedding.png", aspect: "h-96 md:col-span-2" },
  { title: "Sunset Serenade", category: "pre-wedding", image: "/images/prewedding.png", aspect: "h-96" },
  { title: "The First Grain", category: "rice-ceremony", image: "/images/rice_ceremony.png", aspect: "h-96" },
  { title: "Gaze of the Bride", category: "bridal", image: "/images/bridal.png", aspect: "h-96" },
  { title: "Promise of Eternity", category: "engagement", image: "/images/engagement.png", aspect: "h-96 md:col-span-2" },
  { title: "Candlelit Wishes", category: "birthday", image: "/images/birthday.png", aspect: "h-96" }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredGallery = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <main className="min-h-screen relative bg-luxury-bg text-gold-100 overflow-hidden font-sans selection:bg-gold-400 selection:text-neutral-950">

      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(214,162,79,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(155,106,36,0.05),transparent_50%)] blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(214,162,79,0.03),transparent_40%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-gold-950/40 border border-gold-800/30 rounded-full px-4 py-1.5 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-300"></span>
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-300">
                Official Bookings Open 2026 - 2027
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-gold-400/90">
                A Photography Team of Happiness
              </h2>
              <h1 className="font-serif text-[clamp(2.5rem,6.5vw,4.8rem)] leading-[1.05] font-black tracking-tight text-white">
                Capturing <span className="italic text-gold-300 font-medium">Every Emotion</span>, Framing Memories Forever
              </h1>
            </div>

            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-neutral-400">
              We are a team of passionate visual storytellers dedicated to freezing your sacred moments—from the grand frames of your royal wedding to the delicate joy of a baby's first rice ceremony. Let's make memories together.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                href="#book"
                className="relative group bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-neutral-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-widest shadow-[0_4px_25px_rgba(214,162,79,0.25)] hover:shadow-[0_4px_35px_rgba(214,162,79,0.5)] transition duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                Secure Your Date
                <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </a>
              <a
                href="#gallery"
                className="bg-neutral-900/60 border border-gold-800/25 hover:border-gold-400 text-gold-200 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-widest transition duration-300 shadow-inner"
              >
                Browse Gallery
              </a>
            </div>

            <div className="pt-8 border-t border-gold-900/20 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-400 mt-1">Weddings Captured</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-400 mt-1">Pure Happiness</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">10+</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-400 mt-1">Years of Framing</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2.5rem] border border-gold-800/20 p-3 bg-neutral-950/40 backdrop-blur-md shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
                <Image
                  src="/images/wedding.png"
                  alt="Feature Wedding Snapshot"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gold-300 font-bold uppercase tracking-widest">
                    <span>Featured Frame</span>
                    <span>01</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide">The Royal Bengal Knot</h3>
                  <p className="text-xs text-neutral-300 font-medium">Shot beautifully at our luxury signature destination.</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-neutral-900/90 border border-gold-800/30 rounded-[1.8rem] p-4 flex items-center gap-3 backdrop-blur-xl shadow-2xl animate-float">
              <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-neutral-400">Happiness Captured</p>
                <p className="text-sm font-black text-white">Framed Elegantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative bg-neutral-950/40 border-y border-gold-900/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 lg:mb-20">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gold-400">What We Frame Best</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Six Exquisite Photography Domains
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Every milestone is unique. That's why our lenses adapt to the mood, lighting, and cultural details of each celebration.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group relative rounded-[2rem] border border-gold-800/10 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-gold-500/20 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-inner"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400/5 to-transparent rounded-tr-[2rem] pointer-events-none group-hover:from-gold-400/10 transition-all duration-300" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gold-950/50 border border-gold-800/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-300">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-gold-400">{service.tagline}</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-gold-300 transition duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-gold-900/10 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gold-300">
                  <span>Explore Package</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gold-400">Masterpieces Showcase</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Our Visual Masterworks</h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">Explore a curated compilation of genuine snaps captured in absolute raw richness.</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider bg-neutral-900/50 border border-gold-800/15 rounded-2xl p-1.5 self-start md:self-end">
            {["all", "wedding", "pre-wedding", "rice-ceremony", "bridal", "engagement", "birthday"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl transition duration-300 capitalize cursor-pointer ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-gold-300 to-gold-400 text-neutral-950"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500">
          {filteredGallery.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-[2.2rem] border border-gold-800/15 bg-neutral-950 p-2 shadow-2xl transition duration-500 ${item.aspect}`}
            >
              <div className="relative w-full h-full overflow-hidden rounded-[1.8rem]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gold-300 font-bold uppercase tracking-widest">
                    <span>{item.category.replace("-", " ")}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white tracking-wide">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Section */}
      <section id="book" className="relative bg-gradient-to-b from-neutral-950 to-luxury-bg border-t border-gold-900/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-8" id="about">
              <div className="space-y-4">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gold-400">Let's Frame Happiness</span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                  Write Your Own Story With Us.
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed pt-2">
                  The beautiful golden energy of your special moments deserves to be captured in absolute perfection. Tell us your requested date, and our professional team will cross-verify schedules and follow up with a customized package for you.
                </p>
              </div>

              <div className="rounded-[2.2rem] border border-gold-800/20 bg-neutral-950/80 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(214,162,79,0.06),transparent_50%)] pointer-events-none" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">Contact Team Jajabor</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-950/60 border border-gold-800/25 flex items-center justify-center text-gold-300 mt-0.5 shadow-inner">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.106-6.927-6.927l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-400">Mobile Hotlines</p>
                      <a href="tel:7585920952" className="text-xl sm:text-2xl font-black text-white hover:text-gold-300 transition duration-200 mt-1 block">7585920952</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-950/60 border border-gold-800/25 flex items-center justify-center text-gold-300 mt-0.5 shadow-inner">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25A7.5 7.5 0 1119.5 10.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-400">Principal Studio Location</p>
                      <p className="text-sm font-semibold text-neutral-300 mt-1 leading-relaxed">Kolkata, West Bengal, India</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gold-900/20 text-xs text-neutral-400 flex items-center justify-between font-medium">
                  <span>Available 24/7 for Bookings</span>
                  <span className="text-gold-400">● Slots Filling Fast</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent rounded-[2.8rem] blur-2xl pointer-events-none" />
              <div className="relative rounded-[2.8rem] border border-gold-800/18 bg-neutral-900/35 backdrop-blur-xl p-6 sm:p-10 shadow-3xl">
                <div className="space-y-2 mb-8">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold-400">Request Availability</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">Secure Your Shooting Date</h3>
                  <p className="text-xs sm:text-sm text-neutral-400">Input your event specifications. Our studio will immediately run schedule matches.</p>
                </div>
                <LeadCaptureForm />
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
