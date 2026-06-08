"use client";

import { useState, useRef } from "react";
import Image from "next/image";

import { ADMIN_KEY } from "@/lib/admin-auth";

const SPECIALIZATIONS = [
  "Wedding",
  "Pre-Wedding",
  "Portrait",
  "Event",
  "Wildlife",
  "Birthday",
  "Bridal",
  "Engagement",
  "Other",
];

export default function AddMemberModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("Wedding");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("specialization", specialization);
      if (photoFile) fd.append("photo", photoFile);

      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "x-admin-key": ADMIN_KEY },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status})`);
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
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <div style={{ fontSize: 10, color: "#5C5744", letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Panel</div>
            <div className="admin-modal-title">Add Team Member</div>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <div
          className="admin-photo-upload"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <Image src={preview} alt="Preview" fill style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ textAlign: "center", color: "#5C5744" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
              <div style={{ fontSize: 11 }}>Click to upload photo</div>
              <div style={{ fontSize: 10, marginTop: 2 }}>JPG, PNG, WEBP up to 5MB</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Full Name *", value: name, setter: setName, type: "text", placeholder: "e.g. Rajesh Sharma" },
            { label: "Email Address *", value: email, setter: setEmail, type: "email", placeholder: "e.g. rajesh@jajabor.com" },
            { label: "Phone Number", value: phone, setter: setPhone, type: "tel", placeholder: "e.g. +91 98765 43210" },
          ].map((field) => (
            <div key={field.label}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="form-input"
              />
            </div>
          ))}

          <div>
            <label className="form-label">Photography Specialization *</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="form-select"
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {error && <div className="admin-form-error">{error}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-gold"
              style={{ flex: 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "+ Add Member"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
