"use client";

import { useState, useEffect } from "react";
import { ADMIN_KEY } from "@/lib/admin-auth";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins < 1 ? "Just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

export default function InquiriesSection({ onToast }: { onToast: (msg: string) => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = () => {
    setLoading(true);
    fetch("/api/inquiries", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setInquiries(d.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id: number, status: "accepted" | "declined") => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? data.data : i)));
      onToast(status === "accepted" ? "Inquiry accepted — booking confirmed" : "Inquiry declined");
    }
  };

  const newInquiries = inquiries.filter((i) => i.status === "new");

  return (
    <div className="grid2">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">New Inquiries</div>
            <div className="card-sub">Submitted via website form</div>
          </div>
          {newInquiries.length > 0 && <span className="badge badge-pending">{newInquiries.length} new</span>}
        </div>
        <div className="card-body" style={{ padding: "12px 20px" }}>
          {loading ? (
            <p style={{ color: "var(--text3)", textAlign: "center", padding: 24 }}>Loading...</p>
          ) : inquiries.length === 0 ? (
            <p style={{ color: "var(--text3)", textAlign: "center", padding: 24 }}>No inquiries yet. Website booking form submissions appear here.</p>
          ) : (
            inquiries.map((inq) => (
              <div className="inquiry-item" key={inq.id}>
                <div className="inq-top">
                  <div className="inq-name">{inq.name}</div>
                  <div className="inq-time">{timeAgo(inq.created_at)}</div>
                </div>
                <div className="inq-detail">📞 {inq.phone || "—"} · 📧 {inq.email}</div>
                <div className="inq-detail" style={{ marginTop: 3 }}>
                  {inq.service_type} · {inq.event_date || "Date TBD"}
                </div>
                {inq.message && (
                  <div className="inq-detail" style={{ marginTop: 3, fontStyle: "italic", color: "var(--text3)" }}>
                    &quot;{inq.message}&quot;
                  </div>
                )}
                <div className="inq-actions">
                  {inq.status === "new" ? (
                    <>
                      <button type="button" className="inq-btn inq-btn-accept" onClick={() => updateStatus(inq.id, "accepted")}>✓ Accept</button>
                      <button type="button" className="inq-btn inq-btn-decline" onClick={() => updateStatus(inq.id, "declined")}>✗ Decline</button>
                    </>
                  ) : (
                    <span className={`badge ${inq.status === "accepted" ? "badge-confirmed" : "badge-cancelled"}`}>{inq.status}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Quick Stats</div></div>
        <div className="card-body">
          <div className="aside-stat">
            <div className="aside-stat-row"><div className="aside-stat-label">Total Inquiries</div><div className="aside-stat-val">{inquiries.length}</div></div>
          </div>
          <div className="aside-stat">
            <div className="aside-stat-row"><div className="aside-stat-label">Awaiting Response</div><div className="aside-stat-val">{newInquiries.length}</div></div>
          </div>
          <div className="aside-stat">
            <div className="aside-stat-row"><div className="aside-stat-label">Accepted</div><div className="aside-stat-val">{inquiries.filter((i) => i.status === "accepted").length}</div></div>
          </div>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 12 }}>
            Accepting an inquiry automatically confirms the linked booking in the Bookings section.
          </p>
        </div>
      </div>
    </div>
  );
}
