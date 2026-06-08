"use client";

import { useEffect, useRef, useState } from "react";

function RevenueChart({ id, values, height }: { id: string; values: number[]; height: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const max = Math.max(...values);
    c.innerHTML = values.map((v) => {
      const h = Math.round((v / max) * height);
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="width:100%;height:${h}px;border-radius:3px 3px 0 0;background:linear-gradient(to top,#7A6228,#C9A84C);cursor:pointer;transition:opacity .2s;" title="₹${v}L"></div>
      </div>`;
    }).join("");
  }, [values, height]);

  return <div className="chart-area" id={id} ref={ref} style={id === "big-chart" ? { height: 160, paddingTop: 12 } : undefined} />;
}

export function DashboardSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Bookings</div><div className="stat-value">247</div><div className="stat-sub"><span className="up">▲ 18%</span> vs last month</div><div className="stat-icon">📅</div></div>
        <div className="stat-card"><div className="stat-label">Revenue (June)</div><div className="stat-value">₹4.2L</div><div className="stat-sub"><span className="up">▲ 24%</span> vs May</div><div className="stat-icon">💰</div></div>
        <div className="stat-card"><div className="stat-label">Pending Inquiries</div><div className="stat-value">12</div><div className="stat-sub"><span className="down">4 urgent</span> — reply needed</div><div className="stat-icon">💬</div></div>
        <div className="stat-card"><div className="stat-label">Slots Available</div><div className="stat-value">8</div><div className="stat-sub" style={{ color: "var(--amber)" }}>June–July 2026</div><div className="stat-icon">🗓️</div></div>
      </div>

      <div className="grid3">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Recent Bookings</div><div className="card-sub">Latest 5 submissions</div></div>
            <button type="button" className="card-action" onClick={() => onNavigate("bookings")}>View all →</button>
          </div>
          <div className="card-body" style={{ padding: "0 20px" }}>
            <table className="table">
              <thead><tr><th>Client</th><th>Service</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {[
                  ["SR", "Shreya Roy", "7829xxxxx2", "Wedding", "12 Jul 2026", "Confirmed"],
                  ["AM", "Arjun Mukherjee", "9831xxxxx7", "Pre-wedding", "18 Jul 2026", "Pending"],
                  ["PD", "Priya Das", "9000xxxxx4", "Rice Ceremony", "22 Jun 2026", "Confirmed"],
                  ["RG", "Rahul Ghosh", "8167xxxxx1", "Engagement", "29 Jun 2026", "Pending"],
                  ["NS", "Neha Sen", "7003xxxxx9", "Birthday Joy", "8 Jun 2026", "Completed"],
                ].map(([av, name, phone, service, date, status]) => (
                  <tr key={name}>
                    <td><div className="client-cell"><div className="client-av">{av}</div><div><div className="client-name">{name}</div><div className="client-email">{phone}</div></div></div></td>
                    <td style={{ color: "var(--text2)" }}>{service}</td>
                    <td style={{ color: "var(--text2)" }}>{date}</td>
                    <td><span className={`badge badge-${status === "Confirmed" ? "confirmed" : status === "Pending" ? "pending" : "completed"}`}><span className="badge-dot"></span>{status}</span></td>
                    <td><div className="row-actions"><div className="act-btn">👁️</div><div className="act-btn">✏️</div></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Upcoming Shoots</div><div className="card-sub">Next 7 days</div></div></div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            {[
              { dd: "06", mo: "Jun", name: "Priya Das — Rice Ceremony", type: "👶 Annaprashan · 10:00 AM", loc: "📍 New Town, Kolkata" },
              { dd: "09", mo: "Jun", name: "Tanisha & Dev — Bridal", type: "💄 Portraiture · 2:30 PM", loc: "📍 Studio, Salt Lake" },
              { dd: "11", mo: "Jun", name: "Aarav & Meera — Pre-wed", type: "📸 Pre-Wedding · 5:00 PM", loc: "📍 Prinsep Ghat, Kolkata" },
            ].map((s) => (
              <div className="shoot-item" key={s.name}>
                <div className="shoot-date"><div className="shoot-dd">{s.dd}</div><div className="shoot-mo">{s.mo}</div></div>
                <div className="shoot-info"><div className="shoot-name">{s.name}</div><div className="shoot-type">{s.type}</div><div className="shoot-loc">{s.loc}</div></div>
                <span className="badge badge-confirmed" style={{ fontSize: 9 }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header"><div><div className="card-title">Monthly Revenue</div><div className="card-sub">Jan–Jun 2026 · ₹ Lakhs</div></div><span className="badge badge-confirmed">2026</span></div>
          <div className="card-body">
            <RevenueChart id="rev-chart" values={[1.8, 2.4, 3.1, 2.8, 3.5, 4.2]} height={100} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                <span key={m} style={{ fontSize: 10, color: "var(--text3)" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Service Breakdown</div></div>
          <div className="card-body">
            {[
              ["💍 Wedding Photography", 42], ["📸 Pre-Wedding Shoot", 27], ["💄 Bridal Portraiture", 14],
              ["💞 Engagement Shoot", 10], ["👶 Rice Ceremony", 4], ["🎂 Birthday Joy", 3],
            ].map(([label, pct]) => (
              <div className="aside-stat" key={label as string}>
                <div className="aside-stat-row"><div className="aside-stat-label">{label}</div><div className="aside-stat-val">{pct}%</div></div>
                <div className="aside-stat-bar"><div className="aside-stat-fill" style={{ width: `${pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function BookingsSection() {
  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <select className="form-select" style={{ width: "auto" }}><option>All Services</option><option>Wedding Photography</option><option>Pre-wedding Shoot</option></select>
        <select className="form-select" style={{ width: "auto" }}><option>All Statuses</option><option>Pending</option><option>Confirmed</option><option>Completed</option></select>
        <input type="date" className="form-input" style={{ width: "auto" }} />
        <span style={{ marginLeft: "auto" }}><button type="button" className="btn btn-gold">+ Add Booking</button></span>
      </div>
      <div className="card">
        <div className="card-header"><div><div className="card-title">All Bookings</div><div className="card-sub">247 total records</div></div></div>
        <div style={{ padding: "0 20px" }}>
          <table className="table">
            <thead><tr><th>Client</th><th>Service</th><th>Event Date</th><th>Venue</th><th>Package ₹</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                ["SR", "Shreya Roy", "shreya@email.com · 7829xxxxx2", "Wedding", "12 Jul 2026", "ITC Royal, KOL", "₹85,000", "Confirmed"],
                ["AM", "Arjun Mukherjee", "arjun@email.com · 9831xxxxx7", "Pre-wedding", "18 Jul 2026", "Prinsep Ghat", "₹28,000", "Pending"],
                ["PD", "Priya Das", "priya@email.com · 9000xxxxx4", "Rice Ceremony", "22 Jun 2026", "New Town Home", "₹14,000", "Confirmed"],
                ["RG", "Rahul Ghosh", "rahul@email.com · 8167xxxxx1", "Engagement", "29 Jun 2026", "Ballygunge, KOL", "₹22,000", "Pending"],
                ["NS", "Neha Sen", "neha@email.com · 7003xxxxx9", "Birthday Joy", "8 Jun 2026", "Lake Mall, KOL", "₹9,500", "Completed"],
              ].map(([av, name, contact, service, date, venue, price, status]) => (
                <tr key={name}>
                  <td><div className="client-cell"><div className="client-av">{av}</div><div><div className="client-name">{name}</div><div className="client-email">{contact}</div></div></div></td>
                  <td style={{ color: "var(--text2)" }}>{service}</td>
                  <td style={{ color: "var(--text2)" }}>{date}</td>
                  <td style={{ color: "var(--text2)", fontSize: 11 }}>{venue}</td>
                  <td style={{ color: "var(--gold)" }}>{price}</td>
                  <td><span className={`badge badge-${status === "Confirmed" ? "confirmed" : status === "Pending" ? "pending" : "completed"}`}><span className="badge-dot"></span>{status}</span></td>
                  <td><div className="row-actions"><div className="act-btn">👁️</div><div className="act-btn">✏️</div><div className="act-btn">🗑️</div></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function InquiriesSection() {
  const inquiries = [
    { name: "Ananya Bose", time: "Today, 9:42 AM", contact: "📞 9874xxxxxx · 📧 ananya@gmail.com", detail: "💍 Wedding · 15 Nov 2026 · Howrah venue", msg: "Looking for complete wedding coverage with cinematic reel…" },
    { name: "Rohit Banerjee", time: "Today, 8:15 AM", contact: "📞 8001xxxxxx · 📧 rohit@outlook.com", detail: "📸 Pre-wedding · 3 Aug 2026 · Sundarbans", msg: "Golden hour shoot at Sundarbans, 2 people, casual style…" },
    { name: "Sona Pal", time: "Yesterday, 6:30 PM", contact: "📞 7711xxxxxx · 📧 sona@email.in", detail: "🎂 Birthday Joy · 20 Jun 2026 · Home", msg: "My daughter's 1st birthday, want candid + family shots…" },
    { name: "Dipankar Roy", time: "Yesterday, 2:10 PM", contact: "📞 9330xxxxxx · 📧 dipankar@gmail.com", detail: "💞 Engagement · 10 Jul 2026 · Eco Park", msg: "Simple ring ceremony, garden theme, 30–40 guests…" },
  ];

  return (
    <div className="grid2">
      <div className="card">
        <div className="card-header"><div><div className="card-title">New Inquiries</div><div className="card-sub">Submitted via website form</div></div><span className="badge badge-pending">4 new</span></div>
        <div className="card-body" style={{ padding: "12px 20px" }}>
          {inquiries.map((inq) => (
            <div className="inquiry-item" key={inq.name}>
              <div className="inq-top"><div className="inq-name">{inq.name}</div><div className="inq-time">{inq.time}</div></div>
              <div className="inq-detail">{inq.contact}</div>
              <div className="inq-detail" style={{ marginTop: 3 }}>{inq.detail}</div>
              <div className="inq-detail" style={{ marginTop: 3, fontStyle: "italic", color: "var(--text3)" }}>&quot;{inq.msg}&quot;</div>
              <div className="inq-actions">
                <button type="button" className="inq-btn inq-btn-accept">✓ Accept</button>
                <button type="button" className="inq-btn inq-btn-decline">✗ Decline</button>
                <button type="button" className="inq-btn inq-btn-view">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Quick Reply</div></div>
        <div className="card-body">
          <div style={{ marginBottom: 12 }}><label className="form-label">To Client</label><input type="text" placeholder="Select inquiry to reply…" className="form-input" /></div>
          <div style={{ marginBottom: 12 }}><label className="form-label">Message</label><textarea rows={5} placeholder="Dear [Client], thank you for your inquiry…" className="form-textarea" /></div>
          <div style={{ marginBottom: 12 }}><label className="form-label">Template</label><select className="form-select"><option>Select template…</option><option>Initial Confirmation</option><option>Package Details</option></select></div>
          <button type="button" className="btn btn-gold" style={{ width: "100%" }}>Send Reply via WhatsApp / Email</button>
        </div>
      </div>
    </div>
  );
}

export function CalendarSection() {
  const days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
  const classes = ["other","other","other","today","","","booked","","booked","","booked busy","","","booked","","","booked","","","booked busy","","booked","","","","booked","","","","booked busy",""];

  return (
    <div className="grid2">
      <div className="card">
        <div className="card-header"><div className="card-title">Shoot Calendar — June 2026</div></div>
        <div className="card-body">
          <div className="cal-header"><button type="button" className="cal-nav">◀</button><span className="cal-month">June 2026</span><button type="button" className="cal-nav">▶</button></div>
          <div className="cal-grid">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="cal-day-label">{d}</div>)}
            {days.map((d, i) => <div key={d} className={`cal-day ${classes[i] || ""}`}>{d}</div>)}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Block / Unblock Dates</div></div>
        <div className="card-body">
          <div style={{ marginBottom: 14 }}><label className="form-label">Select Date</label><input type="date" className="form-input" /></div>
          <div style={{ marginBottom: 14 }}><label className="form-label">Reason</label><input type="text" placeholder="e.g. Team holiday, personal leave…" className="form-input" /></div>
          <div style={{ display: "flex", gap: 8 }}><button type="button" className="btn btn-outline" style={{ flex: 1 }}>Unblock Date</button><button type="button" className="btn btn-gold" style={{ flex: 1 }}>Block Date</button></div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const cats = ["Wedding", "Pre-Wed", "Bridal", "Engagement", "Rice", "Birthday", "Wedding"];
  const emojis = ["💍", "📸", "💄", "💞", "👶", "🎂", "💍"];
  const gradients = ["#2a1f0a,#1a130a", "#0a1a2a,#0a1520", "#1a0a0a,#120a0a", "#0a1a0a,#0a120a", "#1a150a,#120f0a", "#0a0a1a,#0a0a12", "#2a1f0a,#1a130a"];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-gold" style={{ fontSize: 11 }}>All</button>
        {["Wedding", "Pre-Wedding", "Rice Ceremony", "Bridal", "Engagement", "Birthday"].map((c) => (
          <button key={c} type="button" className="btn btn-outline" style={{ fontSize: 11 }}>{c}</button>
        ))}
        <span style={{ marginLeft: "auto" }}><button type="button" className="btn btn-gold">+ Upload Photos</button></span>
      </div>
      <div className="card">
        <div className="card-header"><div><div className="card-title">Portfolio Gallery</div><div className="card-sub">24 photos · Manage your masterworks</div></div></div>
        <div className="card-body">
          <div className="media-grid">
            {cats.map((cat, i) => (
              <div key={i} className="media-item" style={{ background: `linear-gradient(135deg,${gradients[i]})` }}>
                <div style={{ fontSize: 24, opacity: 0.3 }}>{emojis[i]}</div>
                <div className="media-cat">{cat}</div>
                <div className="media-overlay">✏️</div>
              </div>
            ))}
            <div className="media-item media-add"><div className="plus">+</div><div className="label">Upload Photo</div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function PackagesSection() {
  return (
    <>
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { icon: "💍", title: "Wedding Photography", sub: "Royal & Eternal", tiers: "3 tiers: Silver · Gold · Platinum" },
          { icon: "📸", title: "Pre-Wedding Shoot", sub: "Romantic & Scenic", tiers: "2 tiers: Essential · Premium" },
          { icon: "🌐", title: "Rice Ceremony", sub: "Warm & Traditional", tiers: "1 tier: Complete Package" },
        ].map((pkg) => (
          <div className="card" style={{ flex: 1, minWidth: 220 }} key={pkg.title}>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{pkg.icon}</span>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{pkg.title}</div><div style={{ fontSize: 10, color: "var(--text3)" }}>{pkg.sub}</div></div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>{pkg.tiers}</div>
              <div style={{ display: "flex", gap: 6 }}><button type="button" className="btn btn-outline" style={{ fontSize: 10, flex: 1 }}>Edit</button><button type="button" className="btn btn-gold" style={{ fontSize: 10, flex: 1 }}>Manage</button></div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Edit Package — Wedding Photography · Gold Tier</div></div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label className="form-label">Package Name</label><input type="text" defaultValue="Wedding Gold Package" className="form-input" /></div>
            <div><label className="form-label">Price (₹)</label><input type="number" defaultValue={85000} className="form-input" /></div>
          </div>
          <div style={{ marginBottom: 14 }}><label className="form-label">Description</label><textarea rows={3} className="form-textarea" defaultValue="Immersive, royal, and highly emotional coverage capturing your most sacred vows in timeless cinematic frames." /></div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button type="button" className="btn btn-outline">Discard</button><button type="button" className="btn btn-gold">Save Package</button></div>
        </div>
      </div>
    </>
  );
}

export function ClientsSection() {
  return (
    <div className="card">
      <div className="card-header"><div><div className="card-title">Client Directory</div><div className="card-sub">All registered clients</div></div><button type="button" className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Client</button></div>
      <div style={{ padding: "0 20px" }}>
        <table className="table">
          <thead><tr><th>Client</th><th>Phone</th><th>Bookings</th><th>Last Event</th><th>Total Spend</th><th>Actions</th></tr></thead>
          <tbody>
            {[
              ["SR", "Shreya Roy", "shreya@email.com", "7829xxxxx2", "2 shoots", "Jul 2026", "₹1,13,000"],
              ["AM", "Arjun Mukherjee", "arjun@email.com", "9831xxxxx7", "1 shoot", "Jul 2026", "₹28,000"],
              ["KC", "Kiran Chatterjee", "kiran@email.com", "8822xxxxx5", "1 shoot", "Aug 2026", "₹1,10,000"],
              ["NS", "Neha Sen", "neha@email.com", "7003xxxxx9", "3 shoots", "Jun 2026", "₹32,500"],
            ].map(([av, name, email, phone, bookings, last, spend]) => (
              <tr key={name}>
                <td><div className="client-cell"><div className="client-av">{av}</div><div><div className="client-name">{name}</div><div className="client-email">{email}</div></div></div></td>
                <td style={{ color: "var(--text2)" }}>{phone}</td>
                <td style={{ color: "var(--gold)" }}>{bookings}</td>
                <td style={{ color: "var(--text2)" }}>{last}</td>
                <td style={{ color: "var(--gold)", fontWeight: 600 }}>{spend}</td>
                <td><div className="row-actions"><div className="act-btn">👁️</div><div className="act-btn">✉️</div></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Revenue (2026)</div><div className="stat-value">₹22.6L</div><div className="stat-sub"><span className="up">▲ 31%</span> YoY growth</div></div>
        <div className="stat-card"><div className="stat-label">Avg. Package Value</div><div className="stat-value">₹46K</div><div className="stat-sub"><span className="up">▲ 9%</span> per booking</div></div>
        <div className="stat-card"><div className="stat-label">Conversion Rate</div><div className="stat-value">68%</div><div className="stat-sub">Inquiries → Bookings</div></div>
        <div className="stat-card"><div className="stat-label">Repeat Clients</div><div className="stat-value">34%</div><div className="stat-sub"><span className="up">▲ 12%</span> referrals</div></div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Revenue Trend — 2026</div></div>
        <div className="card-body">
          <RevenueChart id="big-chart" values={[1.8, 2.4, 3.1, 2.8, 3.5, 4.2]} height={160} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <span key={m} style={{ fontSize: 10, color: "var(--text3)" }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={`toggle ${on ? "on" : ""}`} onClick={() => setOn(!on)} role="switch" aria-checked={on}>
      <div className="toggle-thumb"></div>
    </div>
  );
}

export function SettingsSection() {
  return (
    <div className="grid2">
      <div className="card">
        <div className="card-header"><div className="card-title">Studio Information</div></div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label className="form-label">Studio Name</label><input type="text" defaultValue="Team Jajabor Photography" className="form-input" /></div>
            <div><label className="form-label">Phone / WhatsApp</label><input type="text" defaultValue="7585920952" className="form-input" /></div>
            <div><label className="form-label">Location</label><input type="text" defaultValue="Kolkata, West Bengal, India" className="form-input" /></div>
            <div><label className="form-label">Tagline</label><input type="text" defaultValue="Photography Team of Happiness" className="form-input" /></div>
            <button type="button" className="btn btn-gold">Save Changes</button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Notifications & Preferences</div></div>
        <div className="card-body">
          {[
            ["New Booking Alerts", "Get notified when a new booking comes in"],
            ["WhatsApp Notifications", "Auto-send WhatsApp to client on confirm"],
            ["Shoot Reminders", "24-hour reminder before each shoot"],
            ["Slots Filling Fast Banner", "Show urgency pill on website form"],
            ["Accept New Inquiries", "Pause intake if calendar is full"],
          ].map(([name, desc]) => (
            <div className="setting-row" key={name}>
              <div className="setting-info"><div className="setting-name">{name}</div><div className="setting-desc">{desc}</div></div>
              <Toggle />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
