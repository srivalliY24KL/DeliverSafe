import React from "react";
import { useApp } from "../context/AppContext";

export default function Card({ title, children, style, accent }) {
  const { darkMode } = useApp();
  return (
    <div className="fade-in" style={{
      background: darkMode ? "rgba(30,41,59,0.95)" : "#fff",
      borderRadius: 18,
      padding: "22px 26px",
      boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
      backdropFilter: "blur(10px)",
      transition: "box-shadow 0.2s",
      ...style,
    }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          {accent && <div style={{ width: 4, height: 18, borderRadius: 4, background: accent }} />}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: darkMode ? "#e2e8f0" : "#1e293b", margin: 0, letterSpacing: 0.1 }}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color, trend, subtitle }) {
  const { darkMode } = useApp();
  return (
    <div className="fade-in" style={{
      background: darkMode ? "rgba(30,41,59,0.95)" : "#fff",
      borderRadius: 18,
      padding: "20px 22px",
      boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
      display: "flex", alignItems: "center", gap: 16,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, background: `linear-gradient(135deg, ${color}22, ${color}44)`, color, boxShadow: `0 4px 12px ${color}33` }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 23, fontWeight: 800, color: darkMode ? "#f1f5f9" : "#0f172a", letterSpacing: -0.5 }}>{value}</div>
        <div style={{ fontSize: 12, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2, fontWeight: 500 }}>{label}</div>
        {subtitle && <div style={{ fontSize: 11, color: darkMode ? "#475569" : "#cbd5e1", marginTop: 1 }}>{subtitle}</div>}
      </div>
      {trend && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: trend.dir === "up" ? "#16a34a" : "#dc2626", background: trend.dir === "up" ? "#dcfce7" : "#fee2e2", borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>
            {trend.dir === "up" ? "↑" : "↓"} {trend.pct}%
          </div>
          <div style={{ fontSize: 10, color: darkMode ? "#475569" : "#cbd5e1" }}>vs last month</div>
        </div>
      )}
    </div>
  );
}
