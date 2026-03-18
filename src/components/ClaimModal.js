import React from "react";
import { useApp } from "../context/AppContext";
import StatusBadge from "./StatusBadge";

const STEPS = ["Submitted", "Under Review", "Approved", "Paid"];

export default function ClaimModal({ claim, onClose }) {
  const { darkMode } = useApp();
  if (!claim) return null;

  const bg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const rowBg = darkMode ? "#0f172a" : "#f8fafc";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: bg, borderRadius: 18, padding: "28px 32px", width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textColor, margin: 0 }}>{claim.id}</h2>
            <p style={{ color: subColor, fontSize: 13, marginTop: 4 }}>{claim.type} Claim</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: subColor }}>✕</button>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          {STEPS.map((step, i) => {
            const done = i < claim.step;
            const active = i === claim.step - 1;
            return (
              <React.Fragment key={step}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: done ? "#6366f1" : active ? "#a5b4fc" : (darkMode ? "#334155" : "#e2e8f0"), color: done || active ? "#fff" : subColor }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: done ? "#6366f1" : subColor, textAlign: "center", maxWidth: 60 }}>{step}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < claim.step - 1 ? "#6366f1" : (darkMode ? "#334155" : "#e2e8f0"), margin: "0 4px", marginBottom: 18, borderRadius: 2 }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Details */}
        <div style={{ background: rowBg, borderRadius: 12, padding: "16px 20px" }}>
          {[
            ["Claim ID", claim.id],
            ["Worker", claim.worker || "Alex Rivera"],
            ["Type", claim.type],
            ["Description", claim.description || "—"],
            ["Date Filed", claim.date],
            ["Amount", `₹${claim.amount.toLocaleString("en-IN")}`],
            ["Status", <StatusBadge status={claim.status} />],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}` }}>
              <span style={{ fontSize: 13, color: subColor }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: "100%", marginTop: 20, padding: "11px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  );
}
