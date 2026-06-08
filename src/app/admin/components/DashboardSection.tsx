"use client";

import { useState, useEffect } from "react";
import { ADMIN_KEY } from "@/lib/admin-auth";

interface Booking {
  id: number;
  client_name: string;
  phone: string;
  service: string;
  event_date: string;
  status: string;
}

interface Inquiry {
  id: number;
  status: string;
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

export default function DashboardSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const headers = { "x-admin-key": ADMIN_KEY };
    Promise.all([
      fetch("/api/bookings", { headers }).then((r) => r.json()),
      fetch("/api/inquiries", { headers }).then((r) => r.json()),
    ]).then(([b, i]) => {
      if (b.success) setBookings(b.data);
      if (i.success) setInquiries(i.data);
    });
  }, []);

  const pendingInquiries = inquiries.filter((i) => i.status === "new").length;
  const revenue = bookings.reduce((sum, b) => sum + ((b as Booking & { package_price?: number }).package_price || 0), 0);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{bookings.length}</div>
          <div className="stat-sub">Saved records</div>
          <div className="stat-icon">📅</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{revenue >= 100000 ? `${(revenue / 100000).toFixed(1)}L` : revenue.toLocaleString("en-IN")}</div>
          <div className="stat-sub">From all bookings</div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Inquiries</div>
          <div className="stat-value">{pendingInquiries}</div>
          <div className="stat-sub">{pendingInquiries > 0 ? "Reply needed" : "All caught up"}</div>
          <div className="stat-icon">💬</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">{bookings.filter((b) => b.status === "confirmed").length}</div>
          <div className="stat-sub">Active shoots</div>
          <div className="stat-icon">🗓️</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Bookings</div>
            <div className="card-sub">Latest submissions</div>
          </div>
          <button type="button" className="card-action" onClick={() => onNavigate("bookings")}>View all →</button>
        </div>
        <div className="card-body" style={{ padding: "0 20px" }}>
          {bookings.length === 0 ? (
            <p style={{ padding: 24, textAlign: "center", color: "var(--text3)" }}>No bookings yet. Add one from the Bookings section.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Client</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-av">{initials(b.client_name)}</div>
                        <div>
                          <div className="client-name">{b.client_name}</div>
                          <div className="client-email">{b.phone || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{b.service}</td>
                    <td style={{ color: "var(--text2)" }}>{b.event_date || "—"}</td>
                    <td><span className={`badge ${statusBadge(b.status)}`}><span className="badge-dot"></span>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
