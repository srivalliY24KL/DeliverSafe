import React from "react";

const colorMap = {
  Active:         { bg: "#dcfce7", color: "#16a34a" },
  Paid:           { bg: "#dcfce7", color: "#16a34a" },
  Approved:       { bg: "#dbeafe", color: "#2563eb" },
  "Under Review": { bg: "#fef9c3", color: "#ca8a04" },
  Submitted:      { bg: "#f3e8ff", color: "#9333ea" },
  Rejected:       { bg: "#fee2e2", color: "#dc2626" },
  Failed:         { bg: "#fee2e2", color: "#dc2626" },
  Lapsed:         { bg: "#fee2e2", color: "#dc2626" },
  Pending:        { bg: "#fef9c3", color: "#ca8a04" },
};

export default function StatusBadge({ status }) {
  const s = colorMap[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}
