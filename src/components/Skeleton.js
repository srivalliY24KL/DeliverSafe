import React from "react";
import { useApp } from "../context/AppContext";

export default function Skeleton({ width = "100%", height = 18, borderRadius = 8, style }) {
  const { darkMode } = useApp();
  return (
    <div style={{
      width, height, borderRadius,
      background: darkMode ? "#334155" : "#e2e8f0",
      animation: "pulse 1.5s ease-in-out infinite",
      ...style,
    }} />
  );
}

export function SkeletonCard() {
  const { darkMode } = useApp();
  return (
    <div style={{ background: darkMode ? "#1e293b" : "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <Skeleton width="40%" height={14} style={{ marginBottom: 16 }} />
      <Skeleton height={14} style={{ marginBottom: 10 }} />
      <Skeleton width="80%" height={14} style={{ marginBottom: 10 }} />
      <Skeleton width="60%" height={14} />
    </div>
  );
}
