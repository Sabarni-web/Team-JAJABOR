"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddMemberModal from "./AddMemberModal";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  photo_url: string | null;
  created_at: string;
}

import { ADMIN_KEY } from "@/lib/admin-auth";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function TeamSection({ onToast }: { onToast: (msg: string) => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchMembers = () => {
    setLoading(true);
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { if (data.success) setMembers(data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this team member?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        onToast("Member removed successfully");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{members.length}</div>
          <div className="stat-sub">Active team roster</div>
          <div className="stat-icon">👥</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Specializations</div>
          <div className="stat-value">{[...new Set(members.map((m) => m.specialization))].length}</div>
          <div className="stat-sub">Unique skill areas</div>
          <div className="stat-icon">📸</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">With Contact</div>
          <div className="stat-value">{members.filter((m) => m.phone).length}</div>
          <div className="stat-sub">Phone numbers on file</div>
          <div className="stat-icon">📞</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">With Photo</div>
          <div className="stat-value">{members.filter((m) => m.photo_url).length}</div>
          <div className="stat-sub">Profile photos uploaded</div>
          <div className="stat-icon">🖼️</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Team Members</div>
            <div className="card-sub">Manage your photography team roster</div>
          </div>
          <button type="button" className="btn btn-gold" style={{ fontSize: 11 }} onClick={() => setShowModal(true)}>
            + Add Team Member
          </button>
        </div>

        {loading ? (
          <div className="card-body" style={{ textAlign: "center", padding: 48, color: "#5C5744" }}>Loading team...</div>
        ) : members.length === 0 ? (
          <div className="card-body" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>👥</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No Team Members Yet</div>
            <div style={{ fontSize: 12, color: "#5C5744", marginBottom: 16 }}>Click &quot;Add Team Member&quot; to get started.</div>
            <button type="button" className="btn btn-gold" onClick={() => setShowModal(true)}>+ Add First Member</button>
          </div>
        ) : (
          <div style={{ padding: "0 20px" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Contact</th>
                  <th>Specialization</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-av">
                          {m.photo_url ? (
                            <Image src={m.photo_url} alt={m.name} fill style={{ objectFit: "cover" }} />
                          ) : (
                            initials(m.name)
                          )}
                        </div>
                        <div>
                          <div className="client-name">{m.name}</div>
                          <div className="client-email">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>
                      {m.phone || "—"}
                    </td>
                    <td>
                      <span className="badge badge-pending">{m.specialization}</span>
                    </td>
                    <td style={{ color: "var(--text2)" }}>
                      {new Date(m.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="act-btn danger"
                          title="Remove member"
                          onClick={() => handleDelete(m.id)}
                          disabled={deleting === m.id}
                        >
                          {deleting === m.id ? "…" : "🗑️"}
                        </button>
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
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onAdded={() => { fetchMembers(); onToast("Team member added successfully!"); }}
        />
      )}
    </>
  );
}
