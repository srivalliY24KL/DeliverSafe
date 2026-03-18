import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import WorkerDashboard from "./dashboards/WorkerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import WorkerSettings from "./pages/WorkerSettings";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ClaimForm from "./components/ClaimForm";
import { MdShield } from "react-icons/md";

const VIEW_TITLES = {
  worker: "Worker Dashboard", admin: "Admin Overview", workers: "Worker Management",
  claims: "Claims Monitoring", analytics: "Risk Analytics", fraud: "Fraud Monitor",
  payments: "Payment History", alerts: "Alerts & Notifications", workerSettings: "Settings", adminSettings: "Settings",
};

function TopBar({ view, darkMode }) {
  const now = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, background: darkMode ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <MdShield size={16} color="#6366f1" />
        <span style={{ fontSize: 12, color: darkMode ? "#475569" : "#94a3b8", fontWeight: 500 }}>DeliverSafe</span>
        <span style={{ color: darkMode ? "#334155" : "#cbd5e1" }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: darkMode ? "#e2e8f0" : "#1e293b" }}>{VIEW_TITLES[view] || "Dashboard"}</span>
      </div>
      <div style={{ fontSize: 12, color: darkMode ? "#475569" : "#94a3b8", fontWeight: 500 }}>{now}</div>
    </div>
  );
}

function LoadingScreen({ darkMode }) {
  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
        <MdShield size={28} color="#fff" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: darkMode ? "#e2e8f0" : "#1e293b" }}>DeliverSafe</div>
      <div style={{ fontSize: 13, color: darkMode ? "#475569" : "#94a3b8" }}>Insurance Platform</div>
      <div style={{ width: 36, height: 36, border: `3px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginTop: 8 }} />
    </div>
  );
}

function AppShell() {
  const { currentUser, darkMode } = useApp();
  const [view, setView] = useState("worker");
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);
  useEffect(() => { if (currentUser) setView(currentUser.role === "admin" ? "admin" : "worker"); }, [currentUser]);

  if (loading) return <LoadingScreen darkMode={darkMode} />;
  if (!currentUser) {
    return authPage === "login"
      ? <LoginPage onGoSignUp={() => setAuthPage("signup")} />
      : <SignUpPage onGoLogin={() => setAuthPage("login")} />;
  }

  const handleNavigate = (v) => {
    setView(v);
    setShowClaimForm(false);
  };

  const renderContent = () => {
    if (currentUser.role === "admin" && view === "adminSettings") return <WorkerSettings />;
    if (currentUser.role === "admin") return <AdminDashboard activeView={view} />;
    if (view === "workerSettings") return <WorkerSettings />;
    return <WorkerDashboard showClaimForm={showClaimForm} onCloseClaimForm={() => setView("worker")} activeView={view} />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar active={view} onNavigate={handleNavigate} />
      <main style={{ flex: 1, overflowY: "auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TopBar view={view} darkMode={darkMode} />
        <div className="page-enter" style={{ padding: "28px 36px", flex: 1 }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppShell /></AppProvider>;
}
