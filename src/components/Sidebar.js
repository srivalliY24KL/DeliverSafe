import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  MdDashboard, MdAssignment, MdPayment, MdNotifications,
  MdSettings, MdShield, MdPeople, MdBarChart, MdSecurity,
  MdLogout, MdDarkMode, MdLightMode, MdChevronRight,
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";

export default function Sidebar({ active, onNavigate }) {
  const { darkMode, toggleDark, currentUser, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isAdmin = currentUser?.role === "admin";
  const bg = darkMode ? "#0f172a" : "#1e293b";
  const activeBg = "rgba(99,102,241,0.18)";
  const hoverBg = "rgba(255,255,255,0.05)";

  const workerNav = [
    { view: "worker", icon: <MdDashboard size={20} />, label: "Dashboard" },
    { view: "claim", icon: <MdAssignment size={20} />, label: "Submit Claim" },
    { view: "payments", icon: <MdPayment size={20} />, label: "Payments" },
    { view: "alerts", icon: <MdNotifications size={20} />, label: "Alerts" },
    { view: "workerSettings", icon: <MdSettings size={20} />, label: "Settings" },
  ];

  const adminNav = [
    { view: "admin", icon: <MdDashboard size={20} />, label: "Overview" },
    { view: "workers", icon: <MdPeople size={20} />, label: "Workers" },
    { view: "claims", icon: <MdAssignment size={20} />, label: "Claims" },
    { view: "analytics", icon: <MdBarChart size={20} />, label: "Analytics" },
    { view: "fraud", icon: <MdSecurity size={20} />, label: "Fraud Monitor" },
    { view: "adminSettings", icon: <MdSettings size={20} />, label: "Settings" },
  ];

  const navItems = isAdmin ? adminNav : workerNav;
  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("") || "?";

  const NavBtn = ({ item }) => {
    const isActive = active === item.view;
    return (
      <button onClick={() => onNavigate(item.view)} style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        background: isActive ? activeBg : "none", border: "none",
        borderLeft: `3px solid ${isActive ? "#6366f1" : "transparent"}`,
        color: isActive ? "#a5b4fc" : "#94a3b8",
        fontSize: 14, fontWeight: isActive ? 600 : 500,
        padding: "12px 20px", cursor: "pointer", textAlign: "left",
        transition: "all 0.2s",
      }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = "#e2e8f0"; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "none"; e.currentTarget.style.color = isActive ? "#a5b4fc" : "#94a3b8"; }}
      >
        <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
        {item.label}
        {isActive && <MdChevronRight size={16} style={{ marginLeft: "auto", opacity: 0.6 }} />}
      </button>
    );
  };

  return (
    <>
      <aside style={{ width: 248, minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,0.2)", flexShrink: 0, position: "relative", zIndex: 10 }}>

        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdShield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: 0.3 }}>DeliverSafe</div>
              <div style={{ color: "#475569", fontSize: 10, fontWeight: 500 }}>Insurance Platform</div>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ background: isAdmin ? "rgba(139,92,246,0.15)" : "rgba(99,102,241,0.15)", borderRadius: 8, padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {isAdmin ? <MdShield size={13} color="#a78bfa" /> : <FaMotorcycle size={13} color="#818cf8" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: isAdmin ? "#a78bfa" : "#818cf8", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {isAdmin ? "Administrator" : "Delivery Partner"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "12px 0", flex: 1 }}>
          <div style={{ padding: "4px 20px 8px", fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 1 }}>
            {isAdmin ? "Management" : "My Account"}
          </div>
          {navItems.map((item) => <NavBtn key={item.view} item={item} />)}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 0" }}>
          <button onClick={toggleDark} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 500, padding: "10px 20px", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = "#e2e8f0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}>
            {darkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Profile */}
          <div style={{ position: "relative" }}>
            <div onClick={() => setMenuOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0, boxShadow: "0 2px 8px rgba(99,102,241,0.5)" }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.name}</div>
                <div style={{ color: "#475569", fontSize: 11 }}>{currentUser?.email?.split("@")[0]}</div>
              </div>
              <MdChevronRight size={16} color="#475569" style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </div>

            {menuOpen && (
              <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 12, right: 12, background: darkMode ? "#1e293b" : "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: darkMode ? "#e2e8f0" : "#1e293b" }}>{currentUser?.name}</div>
                    <div style={{ fontSize: 11, color: darkMode ? "#64748b" : "#94a3b8" }}>{currentUser?.email}</div>
                  </div>
                </div>
                {[
                  { icon: <MdDashboard size={15} />, label: "My Profile", action: () => { setShowProfile(true); setMenuOpen(false); } },
                  { icon: <MdSettings size={15} />, label: "Settings", action: () => { setShowSettings(true); setMenuOpen(false); } },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "11px 16px", cursor: "pointer", fontSize: 13, color: darkMode ? "#e2e8f0" : "#1e293b", textAlign: "left" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#0f172a" : "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                    {item.icon}{item.label}
                  </button>
                ))}
                <div style={{ height: 1, background: darkMode ? "#334155" : "#f1f5f9" }} />
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "11px 16px", cursor: "pointer", fontSize: 13, color: "#ef4444", textAlign: "left" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                  <MdLogout size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => setMenuOpen(false)} />}
      {showProfile && <ProfileModal user={currentUser} onClose={() => setShowProfile(false)} darkMode={darkMode} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} darkMode={darkMode} toggleDark={toggleDark} />}
    </>
  );
}

function ProfileModal({ user, onClose, darkMode }) {
  const bg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#f1f5f9";
  const initials = user?.name?.split(" ").map((n) => n[0]).join("") || "?";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: bg, borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", padding: "28px 28px 60px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>My Profile</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{user?.name}</div>
        </div>
        <div style={{ padding: "0 28px 28px", marginTop: -36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, border: "4px solid " + bg, marginBottom: 16, boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>{initials}</div>
          <div style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 14, overflow: "hidden" }}>
            {[["ID", user?.id], ["Email", user?.email], ["Phone", user?.phone || "—"], ["Role", user?.role], ["City", user?.city || "—"], ["Vehicle", user?.vehicle || "—"], ["Joined", user?.joinDate || "—"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: 13, color: subColor }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: textColor, textTransform: "capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose, darkMode, toggleDark }) {
  const bg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#f1f5f9";
  const [notifs, setNotifs] = useState({ push: true, email: true, sms: false });

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#6366f1" : (darkMode ? "#334155" : "#cbd5e1"), cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: bg, borderRadius: 20, width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "22px 28px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: textColor }}>Settings</div>
          <button onClick={onClose} style={{ background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: subColor, width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Appearance */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: subColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Appearance</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{darkMode ? "Light Mode" : "Dark Mode"}</div>
                <div style={{ fontSize: 11, color: subColor }}>Switch interface theme</div>
              </div>
              <Toggle value={darkMode} onChange={toggleDark} />
            </div>
          </div>
          {/* Notifications */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: subColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Notifications</div>
            <div style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, overflow: "hidden" }}>
              {[{ key: "push", label: "Push Notifications", desc: "In-app alerts" }, { key: "email", label: "Email Alerts", desc: "Updates via email" }, { key: "sms", label: "SMS Alerts", desc: "Claim & payment SMS" }].map((s) => (
                <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: `1px solid ${borderColor}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: subColor }}>{s.desc}</div>
                  </div>
                  <Toggle value={notifs[s.key]} onChange={(v) => setNotifs((n) => ({ ...n, [s.key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
