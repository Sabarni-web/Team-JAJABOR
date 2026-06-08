"use client";

import { useState } from "react";
import { ADMIN_KEY } from "@/lib/admin-auth";

const SERVICES = [
  "Wedding",
  "Pre-wedding",
  "Rice Ceremony",
  "Bridal",
  "Engagement",
  "Birthday Joy",
];

export default function AddBookingModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!clientName.trim() || !email.trim() || !service) {
      setError("Client name, email, and service are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({
          client_name: clientName,
          email,
          phone,
          service,
          event_date: eventDate,
          venue,
          package_price: Number(packagePrice) || 0,
          status,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save booking");
      onAdded();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">Add Booking</div>
          <button type="button" className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Client Name *</label>
            <input className="form-input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Service *</label>
            <select className="form-select" value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Event Date</label>
            <input className="form-input" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Venue</label>
            <input className="form-input" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Location" />
          </div>
          <div>
            <label className="form-label">Package Price (₹)</label>
            <input className="form-input" type="number" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        {error && <div className="admin-form-error" style={{ marginTop: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-gold" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
