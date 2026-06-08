"use client";

import { useState, useEffect } from "react";
import { ADMIN_KEY } from "@/lib/admin-auth";
import AddBookingModal from "./AddBookingModal";

interface Booking {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  venue: string;
  package_price: number;
  status: string;
  source: string;
  created_at: string;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "badge-pending",
    confirmed: "badge-confirmed",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };
  return map[status] || "badge-pending";
}

function formatDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export default function BookingsSection({ onToast }: { onToast: (msg: string) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    const data = await res.json();
    if (data.success) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      onToast("Booking deleted");
    }
  };

  const handleStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setBookings((prev) => prev.map((b) => (b.id === id ? data.data : b)));
      onToast("Booking updated");
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterService !== "all" && b.service !== filterService) return false;
    return true;
  });

  const services = [...new Set(bookings.map((b) => b.service))];

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <select className="form-select" style={{ width: "auto" }} value={filterService} onChange={(e) => setFilterService(e.target.value)}>
          <option value="all">All Services</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className="btn btn-gold" onClick={() => setShowModal(true)}>+ Add Booking</button>
        </span>
      </div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All Bookings</div>
            <div className="card-sub">{bookings.length} total records</div>
          </div>
        </div>
        {loading ? (
          <div className="card-body" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="card-body" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "var(--text3)", marginBottom: 12 }}>No bookings yet.</p>
            <button type="button" className="btn btn-gold" onClick={() => setShowModal(true)}>+ Add First Booking</button>
          </div>
        ) : (
          <div style={{ padding: "0 20px", overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th><th>Service</th><th>Event Date</th><th>Venue</th>
                  <th>Package ₹</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-av">{initials(b.client_name)}</div>
                        <div>
                          <div className="client-name">{b.client_name}</div>
                          <div className="client-email">{b.email}{b.phone ? ` · ${b.phone}` : ""}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{b.service}</td>
                    <td style={{ color: "var(--text2)" }}>{formatDate(b.event_date)}</td>
                    <td style={{ color: "var(--text2)", fontSize: 11, maxWidth: 120 }}>{b.venue || "—"}</td>
                    <td style={{ color: "var(--gold)" }}>{b.package_price ? `₹${b.package_price.toLocaleString("en-IN")}` : "—"}</td>
                    <td>
                      <span className={`badge ${statusBadge(b.status)}`}>
                        <span className="badge-dot"></span>{b.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        {b.status === "pending" && (
                          <button type="button" className="act-btn" title="Confirm" onClick={() => handleStatus(b.id, "confirmed")}>✓</button>
                        )}
                        <button type="button" className="act-btn danger" title="Delete" onClick={() => handleDelete(b.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <AddBookingModal
          onClose={() => setShowModal(false)}
          onAdded={() => { fetchBookings(); onToast("Booking added successfully!"); }}
        />
      )}
    </>
  );
}
