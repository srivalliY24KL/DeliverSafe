import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MdPerson, MdWork, MdSecurity, MdNotifications, MdDownload, MdWarning, MdEdit, MdCheck } from "react-icons/md";
import Card from "../components/Card";
import { currentWorker } from "../data/mockData";

const SECTIONS = [
  { id: "personal", label: "Personal Information", icon: <MdPerson size={18} /> },
  { id: "work", label: "Work Information", icon: <MdWork size={18} /> },
  { id: "security", label: "Security Settings", icon: <MdSecurity size={18} /> },
  { id: "notifications", label: "Notification Preferences", icon: <MdNotifications size={18} /> },
  { id: "account", label: "Account Actions", icon: <MdWarning size={18} /> },
];

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#6366f1" : "#cbd5e1", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

export default function WorkerSettings() {
  const { darkMode, currentUser, updateUser } = useApp();
  const [activeSection, setActiveSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, claimUpdates: true, paymentReminders: true, weatherAlerts: true });
  const [form, setForm] = useState({ name: currentUser?.name || currentWorker.name, email: currentUser?.email || currentWorker.email, phone: currentUser?.phone || currentWorker.phone, city: currentUser?.city || currentWorker.city });

  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#f1f5f9";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";
  const inputBorder = darkMode ? "#334155" : "#e2e8f0";
  const sectionBg = darkMode ? "#0f172a" : "#f8fafc";

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${inputBorder}`, background: editMode ? inputBg : "transparent", color: textColor, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "all 0.2s" };

  const handleSave = () => { updateUser(form); setSaved(true); setEditMode(false); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 20, padding: "28px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>Account Management</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Settings</h1>
        <p style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>Manage your profile, security and preferences</p>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, color: "#16a34a", fontWeight: 600, fontSize: 14 }}>
          <MdCheck size={18} /> Changes saved successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Section Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500, transition: "all 0.2s",
              background: activeSection === s.id ? (darkMode ? "rgba(99,102,241,0.2)" : "#ede9fe") : "transparent",
              color: activeSection === s.id ? "#6366f1" : subColor,
            }}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div>
          {/* Personal Information */}
          {activeSection === "personal" && (
            <Card title="Personal Information" accent="#6366f1">
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                {editMode ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditMode(false)} style={{ padding: "8px 16px", background: darkMode ? "#334155" : "#f1f5f9", color: subColor, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleSave} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
                  </div>
                ) : (
                  <button onClick={() => setEditMode(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: darkMode ? "#334155" : "#f1f5f9", color: subColor, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <MdEdit size={15} /> Edit
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[["Full Name", "name", "text"], ["Email Address", "email", "email"], ["Phone Number", "phone", "tel"], ["City", "city", "text"]].map(([label, key, type]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: subColor, display: "block", marginBottom: 6 }}>{label}</label>
                    <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} disabled={!editMode} style={{ ...inputStyle, cursor: editMode ? "text" : "default" }}
                      onFocus={(e) => { if (editMode) e.target.style.borderColor = "#6366f1"; }}
                      onBlur={(e) => e.target.style.borderColor = inputBorder} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Work Information */}
          {activeSection === "work" && (
            <Card title="Work Information" accent="#f59e0b">
              <div style={{ display: "flex", flexDirection: "column", gap: 0, background: sectionBg, borderRadius: 14, overflow: "hidden" }}>
                {[
                  ["Partner ID", currentWorker.id],
                  ["Platform", currentWorker.platform],
                  ["Delivery Zone", currentWorker.zone],
                  ["Vehicle Type", currentWorker.vehicle],
                  ["Working Hours", currentWorker.workingHours],
                  ["Member Since", currentWorker.joinDate],
                  ["Policy ID", currentWorker.policy.id],
                  ["Coverage Type", currentWorker.policy.subType],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderBottom: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 13, color: subColor }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <Card title="Security Settings" accent="#ef4444">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[{ title: "Change Password", desc: "Update your account password", btn: "Update Password", color: "#6366f1" }, { title: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", btn: "Enable 2FA", color: "#16a34a" }, { title: "Active Sessions", desc: "Manage devices where you're logged in", btn: "View Sessions", color: "#f59e0b" }].map((s) => (
                  <div key={s.title} style={{ background: sectionBg, borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${borderColor}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: textColor, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: subColor }}>{s.desc}</div>
                    </div>
                    <button style={{ padding: "9px 18px", background: s.color + "22", color: s.color, border: `1px solid ${s.color}44`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{s.btn}</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <Card title="Notification Preferences" accent="#8b5cf6">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                  { key: "sms", label: "SMS Notifications", desc: "Get SMS for claims & payments" },
                  { key: "push", label: "Push Notifications", desc: "In-app real-time alerts" },
                  { key: "claimUpdates", label: "Claim Status Updates", desc: "Notified when claim status changes" },
                  { key: "paymentReminders", label: "Payment Reminders", desc: "Reminded before premium due date" },
                  { key: "weatherAlerts", label: "Weather Disruption Alerts", desc: "Alerts for your delivery zone" },
                ].map((s) => (
                  <div key={s.key} style={{ background: sectionBg, borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${borderColor}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: textColor, marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: subColor }}>{s.desc}</div>
                    </div>
                    <Toggle value={notifs[s.key]} onChange={(v) => setNotifs((n) => ({ ...n, [s.key]: v }))} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Account Actions */}
          {activeSection === "account" && (
            <Card title="Account Actions" accent="#ef4444">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: sectionBg, borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${borderColor}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textColor, marginBottom: 4 }}>Download My Data</div>
                    <div style={{ fontSize: 12, color: subColor }}>Export all your claims, payments and policy data</div>
                  </div>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#dbeafe", color: "#2563eb", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <MdDownload size={16} /> Download
                  </button>
                </div>
                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fed7aa" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#c2410c", marginBottom: 4 }}>Deactivate Account</div>
                    <div style={{ fontSize: 12, color: "#9a3412" }}>Temporarily disable your account. You can reactivate anytime.</div>
                  </div>
                  <button style={{ padding: "9px 18px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Deactivate</button>
                </div>
                <div style={{ background: "#fef2f2", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fecaca" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>Delete Account</div>
                    <div style={{ fontSize: 12, color: "#b91c1c" }}>Permanently delete your account and all associated data.</div>
                  </div>
                  <button style={{ padding: "9px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
