import React from "react";
import { useApp } from "../context/AppContext";

export function TableToolbar({ search, onSearch, statusFilter, onFilter, statuses, onExport, placeholder = "Search..." }) {
  const { darkMode } = useApp();
  const inputStyle = {
    padding: "8px 12px", borderRadius: 8, border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
    background: darkMode ? "#0f172a" : "#f8fafc", color: darkMode ? "#e2e8f0" : "#1e293b",
    fontSize: 13, outline: "none",
  };
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, minWidth: 200 }} />
      {statuses && (
        <select value={statusFilter} onChange={(e) => onFilter(e.target.value)} style={{ ...inputStyle }}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      )}
      {onExport && (
        <button onClick={onExport} style={{ marginLeft: "auto", padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ⬇ Export CSV
        </button>
      )}
    </div>
  );
}

export function SortableTh({ label, sortKey, currentSort, currentDir, onSort, style }) {
  const { darkMode } = useApp();
  const active = currentSort === sortKey;
  return (
    <th onClick={() => onSort(sortKey)} style={{
      textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 700,
      background: darkMode ? "#1e293b" : "#f8fafc",
      color: active ? "#6366f1" : (darkMode ? "#94a3b8" : "#64748b"),
      borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
      cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", ...style,
    }}>
      {label} {active ? (currentDir === "asc" ? "↑" : "↓") : "↕"}
    </th>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  const { darkMode } = useApp();
  if (totalPages <= 1) return null;
  const btnStyle = (active) => ({
    padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: active ? "#6366f1" : (darkMode ? "#334155" : "#f1f5f9"),
    color: active ? "#fff" : (darkMode ? "#e2e8f0" : "#475569"),
  });
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 14, alignItems: "center" }}>
      <button style={btnStyle(false)} onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}>‹ Prev</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i + 1} style={btnStyle(page === i + 1)} onClick={() => onPage(i + 1)}>{i + 1}</button>
      ))}
      <button style={btnStyle(false)} onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next ›</button>
    </div>
  );
}

export function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter((k) => k !== "flagged");
  const csv = [keys.join(","), ...data.map((row) => keys.map((k) => `"${row[k] ?? ""}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
