"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TeamSection from "./components/TeamSection";
import DashboardSection from "./components/DashboardSection";
import BookingsSection from "./components/BookingsSection";
import InquiriesSection from "./components/InquiriesSection";
import ClientsSection from "./components/ClientsSection";
import {
  CalendarSection,
  PortfolioSection,
  PackagesSection,
  AnalyticsSection,
  SettingsSection,
} from "./components/AdminSections";
import { ADMIN_KEY } from "@/lib/admin-auth";

type PageId =
  | "dashboard"
  | "bookings"
  | "inquiries"
  | "calendar"
  | "portfolio"
  | "packages"
  | "team"
  | "clients"
  | "analytics"
  | "settings";

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: "Dashboard Overview",
  bookings: "Booking Management",
  inquiries: "Client Inquiries",
  calendar: "Shoot Schedule",
  portfolio: "Portfolio Manager",
  packages: "Service Packages",
  team: "Team Members",
  clients: "Client Directory",
  analytics: "Analytics & Insights",
  settings: "Studio Settings",
};

const CREDENTIALS = { username: "jajabor", password: "jajabor2026" };

function buildNavItems(bookingCount: number, inquiryCount: number) {
  return [
  {
    section: "Main",
    items: [
      { id: "dashboard" as PageId, icon: "📊", label: "Dashboard" },
      { id: "bookings" as PageId, icon: "📅", label: "Bookings", badge: bookingCount > 0 ? String(bookingCount) : undefined },
      { id: "inquiries" as PageId, icon: "💬", label: "Inquiries", badge: inquiryCount > 0 ? String(inquiryCount) : undefined },
      { id: "calendar" as PageId, icon: "🗓️", label: "Schedule" },
    ],
  },
  {
    section: "Content",
    items: [
      { id: "portfolio" as PageId, icon: "🖼️", label: "Portfolio" },
      { id: "packages" as PageId, icon: "💼", label: "Packages", badge: "New", badgeGold: true },
      { id: "team" as PageId, icon: "👤", label: "Team Members" },
      { id: "clients" as PageId, icon: "👥", label: "Clients" },
    ],
  },
  {
    section: "System",
    items: [
      { id: "analytics" as PageId, icon: "📈", label: "Analytics" },
      { id: "settings" as PageId, icon: "⚙️", label: "Settings" },
    ],
  },
];
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("jajabor");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [toast, setToast] = useState("");
  const [bookingCount, setBookingCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  const refreshCounts = () => {
    const headers = { "x-admin-key": ADMIN_KEY };
    fetch("/api/bookings", { headers }).then((r) => r.json()).then((d) => {
      if (d.success) setBookingCount(d.data.length);
    });
    fetch("/api/inquiries", { headers }).then((r) => r.json()).then((d) => {
      if (d.success) setInquiryCount(d.data.filter((i: { status: string }) => i.status === "new").length);
    });
  };

  useEffect(() => {
    if (loggedIn) refreshCounts();
  }, [loggedIn, activePage]);

  const showToast = (msg: string) => {
    refreshCounts();
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const doLogin = () => {
    if (username.trim() === CREDENTIALS.username && password === CREDENTIALS.password) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("✗ Incorrect username or password.");
      setPassword("");
      setTimeout(() => setLoginError(""), 3000);
    }
  };

  const navigate = (id: PageId) => setActivePage(id);

  if (!loggedIn) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-box">
          <div className="admin-login-logo">TEAM JAJABOR</div>
          <div className="admin-login-sub">Admin Panel · Secure Access</div>

          <label className="admin-login-label">Username</label>
          <input
            className="admin-login-input"
            type="text"
            placeholder="admin"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="admin-login-label">Password</label>
          <input
            className="admin-login-input"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
          />

          <button type="button" className="admin-login-btn" onClick={doLogin}>
            Enter Admin Panel
          </button>
          <div className="admin-login-err">{loginError}</div>
          <div className="admin-login-hint">🔒 Access restricted to Team Jajabor administrators</div>
          <div style={{ marginTop: 16 }}>
            <Link href="/" style={{ fontSize: 11, color: "#5C5744" }}>← Back to website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand">TEAM JAJABOR</div>
          <div className="sub">Photography Team of Happiness</div>
          <div className="pill"><span className="dot"></span> Admin Panel</div>
        </div>

        <div className="nav-section">
          {buildNavItems(bookingCount, inquiryCount).map((group) => (
            <div key={group.section}>
              <div className="nav-label">{group.section}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${activePage === item.id ? "active" : ""}`}
                  onClick={() => navigate(item.id)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className={`badge ${item.badgeGold ? "gold" : ""}`}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">JB</div>
            <div>
              <div className="admin-name">Jajabor Admin</div>
              <div className="admin-role">Super Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{PAGE_TITLES[activePage]}</div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search bookings, clients..." />
            </div>
            <div className="notif-btn" title="Notifications">🔔<div className="notif-dot"></div></div>
            <button type="button" className="btn btn-gold" onClick={() => navigate("bookings")}>+ New Booking</button>
            <Link href="/" className="btn btn-outline" style={{ textDecoration: "none" }}>View Site</Link>
          </div>
        </div>

        <div className="content">
          <div className={`page ${activePage === "dashboard" ? "active" : ""}`}>
            <DashboardSection onNavigate={(p) => navigate(p as PageId)} />
          </div>
          <div className={`page ${activePage === "bookings" ? "active" : ""}`}><BookingsSection onToast={showToast} /></div>
          <div className={`page ${activePage === "inquiries" ? "active" : ""}`}><InquiriesSection onToast={showToast} /></div>
          <div className={`page ${activePage === "calendar" ? "active" : ""}`}><CalendarSection /></div>
          <div className={`page ${activePage === "portfolio" ? "active" : ""}`}><PortfolioSection /></div>
          <div className={`page ${activePage === "packages" ? "active" : ""}`}><PackagesSection /></div>
          <div className={`page ${activePage === "team" ? "active" : ""}`}><TeamSection onToast={showToast} /></div>
          <div className={`page ${activePage === "clients" ? "active" : ""}`}><ClientsSection /></div>
          <div className={`page ${activePage === "analytics" ? "active" : ""}`}><AnalyticsSection /></div>
          <div className={`page ${activePage === "settings" ? "active" : ""}`}><SettingsSection /></div>
        </div>
      </main>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
