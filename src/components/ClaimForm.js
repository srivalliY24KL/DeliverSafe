import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function ClaimForm({ onClose, onSubmit, inline = false }) {
  const { darkMode } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ type: "Accident", description: "", amount: "", date: today });
  const [submitted, setSubmitted] = useState(false);

  const bg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";
  const inputBorder = darkMode ? "#334155" : "#e2e8f0";

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${inputBorder}`, background: inputBg, color: textColor, fontSize: 14, outline: "none", boxSizing: "border-box" };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${Math.floor(Math.random() * 9000 + 1000)}`,
      ...form,
      amount: Number(form.amount),
      status: "Submitted",
      step: 1,
    };
    onSubmit(newClaim);
    setSubmitted(true);
  };

  const content = (
    <div style={{ background: bg, borderRadius: 18, padding: "28px 32px", width: "100%", maxWidth: inline ? 560 : 460, boxShadow: inline ? "0 4px 24px rgba(0,0,0,0.1)" : "0 20px 60px rgba(0,0,0,0.3)" }}>
      {submitted ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ color: textColor, fontWeight: 800, marginBottom: 8 }}>Claim Submitted!</h2>
          <p style={{ color: subColor, fontSize: 14, marginBottom: 24 }}>Your claim has been submitted and is under review.</p>
          <button onClick={onClose} style={{ padding: "11px 32px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Done</button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textColor, margin: 0 }}>Submit New Claim</h2>
            {!inline && <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: subColor }}>✕</button>}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: subColor, display: "block", marginBottom: 6 }}>Claim Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                {["Accident", "Injury", "Weather Disruption", "Theft", "Medical"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: subColor, display: "block", marginBottom: 6 }}>Date of Incident</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} required max={today} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: subColor, display: "block", marginBottom: 6 }}>Claim Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 50000" style={inputStyle} required min="1" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: subColor, display: "block", marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the incident..." rows={3} style={{ ...inputStyle, resize: "vertical" }} required />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", background: inputBg, color: subColor, border: `1px solid ${inputBorder}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button type="submit" style={{ flex: 2, padding: "11px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Submit Claim</button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  if (inline) {
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>{content}</div>;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  );
}
