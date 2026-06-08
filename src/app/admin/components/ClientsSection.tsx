"use client";

import { useState, useEffect } from "react";
import { ADMIN_KEY } from "@/lib/admin-auth";

interface Booking {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  event_date: string;
  package_price: number;
}

interface ClientRow {
  email: string;
  name: string;
  phone: string;
  bookings: number;
  lastEvent: string;
  totalSpend: number;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function ClientsSection() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        const map = new Map<string, ClientRow>();
        for (const b of d.data as Booking[]) {
          const key = b.email.toLowerCase();
          const existing = map.get(key);
          if (existing) {
            existing.bookings += 1;
            existing.totalSpend += b.package_price || 0;
            if (b.event_date > existing.lastEvent) existing.lastEvent = b.event_date;
          } else {
            map.set(key, {
              email: b.email,
              name: b.client_name,
              phone: b.phone,
              bookings: 1,
              lastEvent: b.event_date || "",
              totalSpend: b.package_price || 0,
            });
          }
        }
        setClients([...map.values()]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Client Directory</div>
          <div className="card-sub">Derived from saved bookings</div>
        </div>
      </div>
      {loading ? (
        <div className="card-body" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Loading...</div>
      ) : clients.length === 0 ? (
        <div className="card-body" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No clients yet. Add bookings to build the directory.</div>
      ) : (
        <div style={{ padding: "0 20px" }}>
          <table className="table">
            <thead>
              <tr><th>Client</th><th>Phone</th><th>Bookings</th><th>Last Event</th><th>Total Spend</th></tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.email}>
                  <td>
                    <div className="client-cell">
                      <div className="client-av">{initials(c.name)}</div>
                      <div>
                        <div className="client-name">{c.name}</div>
                        <div className="client-email">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{c.phone || "—"}</td>
                  <td style={{ color: "var(--gold)" }}>{c.bookings} shoot{c.bookings !== 1 ? "s" : ""}</td>
                  <td style={{ color: "var(--text2)" }}>{c.lastEvent || "—"}</td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>₹{c.totalSpend.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
