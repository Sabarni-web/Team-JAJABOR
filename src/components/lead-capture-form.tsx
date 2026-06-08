"use client";

import { useState } from "react";

type BookingState = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  serviceType: string;
  message: string;
};

const initialState: BookingState = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  serviceType: "",
  message: "",
};

export function LeadCaptureForm() {
  const [form, setForm] = useState<BookingState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to submit booking request.");
      }

      setStatus("success");
      setMessage(data.message ?? "Thank you! We will check availability and get back to you shortly.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Booking submission failed");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="form-name" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
            Full Name
          </label>
          <input
            id="form-name"
            required
            className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="form-phone" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
            Phone Number
          </label>
          <input
            id="form-phone"
            type="tel"
            required
            className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="7585920952"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="form-email" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
            Email Address
          </label>
          <input
            id="form-email"
            type="email"
            required
            className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="form-date" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
            Event Date
          </label>
          <input
            id="form-date"
            type="date"
            required
            className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm [color-scheme:dark]"
            name="eventDate"
            value={form.eventDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="form-service" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
          Service Type
        </label>
        <select
          id="form-service"
          required
          className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm"
          name="serviceType"
          value={form.serviceType}
          onChange={handleInputChange}
        >
          <option value="" disabled className="bg-neutral-950">Select a service</option>
          <option value="Wedding" className="bg-neutral-950">Wedding Photography</option>
          <option value="Pre-wedding" className="bg-neutral-950">Pre-wedding Shoot</option>
          <option value="Rice Ceremony" className="bg-neutral-950">Rice Ceremony (Annaprashan)</option>
          <option value="Bridal" className="bg-neutral-950">Bridal Portraiture</option>
          <option value="Engagement" className="bg-neutral-950">Engagement Shoot</option>
          <option value="Birthday" className="bg-neutral-950">Birthday Celebration</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="form-message" className="text-xs uppercase tracking-widest font-semibold text-gold-200">
          Tell Us About Your Event (Venue, Theme, etc.)
        </label>
        <textarea
          id="form-message"
          rows={3}
          className="w-full bg-neutral-950/60 border border-gold-800/25 rounded-xl py-3 px-4 text-white placeholder-neutral-500 outline-none transition focus:border-gold-300 focus:ring-1 focus:ring-gold-300/40 text-sm resize-none"
          name="message"
          value={form.message}
          onChange={handleInputChange}
          placeholder="Share details so we can customize your package..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full relative group overflow-hidden bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-neutral-950 font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(214,162,79,0.3)] transition duration-300 hover:shadow-[0_4px_30px_rgba(214,162,79,0.55)] disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {status === "submitting" ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Availability...
            </>
          ) : (
            "Check Date & Book Now"
          )}
        </span>
        <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </button>

      {message ? (
        <div
          className={`rounded-xl border p-4 text-sm animate-pulse flex items-start gap-3 ${
            status === "success"
              ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
              : "border-rose-500/30 bg-rose-950/20 text-rose-300"
          }`}
        >
          <span>
            {status === "success" ? "✓" : "⚠"}
          </span>
          <p>{message}</p>
        </div>
      ) : null}
    </form>
  );
}