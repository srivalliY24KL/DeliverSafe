import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MdShield, MdPayment, MdAssignment, MdTrendingUp, MdWarning, MdInfo, MdCheckCircle, MdError, MdCalendarToday, MdLocationOn } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";
import Card, { StatCard } from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import ClaimModal from "../components/ClaimModal";
import ClaimForm from "../components/ClaimForm";
import { TableToolbar, SortableTh, Pagination, exportToCSV } from "../components/TableControls";
import { useApp } from "../context/AppContext";
import { useTableControls } from "../hooks/useTableControls";
import { currentWorker, paymentHistory as initialPayments, workerClaims as initialClaims, incomeData, workerAlerts } from "../data/mockData";

const STORAGE_KEY = "ds_worker_claims";
function loadClaims() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch (_) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClaims));
  return initialClaims;
}

const STEPS = ["Submitted", "Under Review", "Approved", "Paid"];
const PIE_COLORS = ["#6366f1", "#f59e0b", "#16a34a", "#ef4444"];

const alertConfig = {
  warning: { bg: "#fef9c3", border: "#fde68a", text: "#92400e", icon: <MdWarning size={18} color="#d97706" /> },
  info: { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af", icon: <MdInfo size={18} color="#2563eb" /> },
  danger: { bg: "#fee2e2", border: "#fecaca", text: "#991b1b", icon: <MdError size={18} color="#dc2626" /> },
  success: { bg: "#dcfce7", border: "#86efac", text: "#14532d", icon: <MdCheckCircle size={18} color="#16a34a" /> },
};

function ClaimCard({ claim, onClick, darkMode }) {
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";
  return (
    <div onClick={() => onClick(claim)} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 16, padding: "18px 22px", cursor: "pointer", border: `1px solid ${borderColor}`, transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: darkMode ? "#e2e8f0" : "#1e293b" }}>{claim.id}</span>
            <span style={{ fontSize: 11, fontWeight: 600, background: darkMode ? "#1e293b" : "#e2e8f0", color: subColor, borderRadius: 20, padding: "2px 10px" }}>{claim.type}</span>
          </div>
          <div style={{ fontSize: 12, color: subColor }}>{claim.description}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: darkMode ? "#e2e8f0" : "#1e293b" }}>₹{claim.amount.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{claim.date}</div>
        </div>
      </div>
      <StatusBadge status={claim.status} />
      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        {STEPS.map((step, i) => {
          const done = i < claim.step;
          const active = i === claim.step - 1;
          return (
            <React.Fragment key={step}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : active ? "#a5b4fc" : (darkMode ? "#334155" : "#e2e8f0"), color: done || active ? "#fff" : subColor, boxShadow: done ? "0 2px 8px rgba(99,102,241,0.4)" : "none", transition: "all 0.3s" }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: done ? "#6366f1" : subColor, textAlign: "center", maxWidth: 60 }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, borderRadius: 2, margin: "0 4px", marginBottom: 18, background: i < claim.step - 1 ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : (darkMode ? "#334155" : "#e2e8f0"), transition: "background 0.3s" }} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkerDashboard({ showClaimForm, onCloseClaimForm, activeView = "worker" }) {
  const { darkMode, currentUser } = useApp();
  const { policy } = currentWorker;
  const [claims, setClaims] = useState(loadClaims);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const paymentControls = useTableControls(initialPayments, ["id", "method", "status"]);

  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#f1f5f9";
  const rowHover = darkMode ? "#0f172a" : "#f8fafc";
  const workerName = currentUser?.name || currentWorker.name;
  const initials = workerName.split(" ").map((n) => n[0]).join("");

  const paidClaims = claims.filter((c) => c.status === "Paid");
  const totalReceived = paidClaims.reduce((s, c) => s + c.amount, 0);

  const claimPieData = [
    { name: "Paid", value: claims.filter((c) => c.status === "Paid").length },
    { name: "Approved", value: claims.filter((c) => c.status === "Approved").length },
    { name: "Under Review", value: claims.filter((c) => c.status === "Under Review").length },
    { name: "Submitted", value: claims.filter((c) => c.status === "Submitted").length },
  ].filter((d) => d.value > 0);

  const handleNewClaim = (claim) => {
    setClaims((prev) => {
      const updated = [claim, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    onCloseClaimForm();
  };

  const td = { padding: "12px 16px", fontSize: 13, color: textColor, borderBottom: `1px solid ${borderColor}` };

  // ── Payments section ──────────────────────────────────────────────────────
  const PaymentsSection = (
    <Card title="Annual Payment & Subscription" accent="#f59e0b">
      <div style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>Annual Payment Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1" }}>{policy.paidCount}/{policy.yearlyTarget} payments</span>
          </div>
          <div style={{ height: 8, background: darkMode ? "#334155" : "#e2e8f0", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(policy.paidCount / policy.yearlyTarget) * 100}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 8, transition: "width 0.5s" }} />
          </div>
        </div>
        <div style={{ textAlign: "center", background: darkMode ? "#1e293b" : "#fff", borderRadius: 12, padding: "10px 16px", border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b" }}>₹{policy.premium.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: 11, color: subColor }}>Next Due</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: textColor }}>{policy.nextDue}</div>
        </div>
      </div>
      <TableToolbar search={paymentControls.search} onSearch={paymentControls.handleSearch} statusFilter={paymentControls.statusFilter} onFilter={paymentControls.handleFilter} statuses={paymentControls.statuses} placeholder="Search payments..." onExport={() => exportToCSV(initialPayments, "payments.csv")} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
              <SortableTh label="Payment ID" sortKey="id" currentSort={paymentControls.sortKey} currentDir={paymentControls.sortDir} onSort={paymentControls.toggleSort} />
              <SortableTh label="Date" sortKey="date" currentSort={paymentControls.sortKey} currentDir={paymentControls.sortDir} onSort={paymentControls.toggleSort} />
              <SortableTh label="Amount" sortKey="amount" currentSort={paymentControls.sortKey} currentDir={paymentControls.sortDir} onSort={paymentControls.toggleSort} />
              <SortableTh label="Method" sortKey="method" currentSort={paymentControls.sortKey} currentDir={paymentControls.sortDir} onSort={paymentControls.toggleSort} />
              <SortableTh label="Status" sortKey="status" currentSort={paymentControls.sortKey} currentDir={paymentControls.sortDir} onSort={paymentControls.toggleSort} />
            </tr>
          </thead>
          <tbody>
            {paymentControls.paginated.map((p) => (
              <tr key={p.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = rowHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12, background: darkMode ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{p.id}</span></td>
                <td style={td}>{p.date}</td>
                <td style={{ ...td, fontWeight: 700 }}>₹{p.amount.toLocaleString("en-IN")}</td>
                <td style={td}>{p.method}</td>
                <td style={td}><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={paymentControls.page} totalPages={paymentControls.totalPages} onPage={paymentControls.setPage} />
    </Card>
  );

  // ── Claims section ────────────────────────────────────────────────────────
  const ClaimsSection = (
    <Card title="Claims Module" accent="#8b5cf6">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: subColor }}>Click any claim card to view full details</span>
        <button onClick={() => { onCloseClaimForm(); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}>
          <MdAssignment size={16} /> + New Claim
        </button>
      </div>
      {claims.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: subColor }}>
          <MdAssignment size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 8 }}>No claims yet</p>
          <p style={{ fontSize: 13 }}>Submit your first claim to get started</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {claims.map((claim) => <ClaimCard key={claim.id} claim={claim} onClick={setSelectedClaim} darkMode={darkMode} />)}
        </div>
      )}
    </Card>
  );

  // ── Alerts section ────────────────────────────────────────────────────────
  const AlertsSection = (
    <Card title="Alerts & Notifications" accent="#ef4444">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {workerAlerts.map((alert) => {
          const cfg = alertConfig[alert.severity] || alertConfig.info;
          return (
            <div key={alert.id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text, borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{alert.type}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{alert.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  // ── Render based on activeView ────────────────────────────────────────────
  const renderContent = () => {
    switch (activeView) {
      case "payments": return PaymentsSection;
      case "claim": return (
        <ClaimForm onClose={onCloseClaimForm} onSubmit={handleNewClaim} inline />
      );
      case "alerts": return AlertsSection;
      default: // "worker" — full dashboard
        return (
          <>
            {/* Hero Profile Banner */}
            <div style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a78bfa 100%)", borderRadius: 22, padding: "28px 32px", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", bottom: -40, right: 100, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, border: "3px solid rgba(255,255,255,0.4)", backdropFilter: "blur(10px)" }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                      <FaMotorcycle size={13} /> Delivery Partner · {currentWorker.id}
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>{workerName}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6, opacity: 0.8, fontSize: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MdLocationOn size={13} />{currentWorker.city} · {currentWorker.zone}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MdCalendarToday size={13} />Since {currentWorker.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[{ label: "Total Claims", value: claims.length }, { label: "Total Received", value: `₹${totalReceived.toLocaleString("en-IN")}` }, { label: "Policy", value: policy.status }].map((s) => (
                    <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 20px", textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{s.value}</div>
                      <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
              <StatCard label="Coverage Amount" value={`₹${policy.coverageAmount.toLocaleString("en-IN")}`} icon={<MdShield size={22} />} color="#6366f1" trend={{ dir: "up", pct: "5.2" }} subtitle="Comprehensive Plan" />
              <StatCard label="Annual Amount" value={`₹${policy.premium.toLocaleString("en-IN")}`} icon={<MdPayment size={22} />} color="#f59e0b" subtitle={`Next due: ${policy.nextDue}`} />
              <StatCard label="Active Claims" value={claims.filter(c => c.status !== "Paid" && c.status !== "Rejected").length} icon={<MdAssignment size={22} />} color="#8b5cf6" subtitle={`${claims.length} total claims`} />
              <StatCard label="Total Received" value={`₹${totalReceived.toLocaleString("en-IN")}`} icon={<MdTrendingUp size={22} />} color="#16a34a" trend={{ dir: "up", pct: "12.4" }} subtitle="Compensation paid out" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Policy Details */}
              <Card title="Insurance Policy Details" accent="#6366f1">
                <div style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 14, overflow: "hidden" }}>
                  {[
                    ["Policy ID", policy.id],
                    ["Coverage Type", policy.subType || policy.type],
                    ["Coverage Amount", `₹${policy.coverageAmount.toLocaleString("en-IN")}`],
                    ["Status", <StatusBadge status={policy.status} />],
                    ["Start Date", policy.startDate],
                    ["Expiry Date", policy.expiryDate],
                    ["Annual Amount", `₹${policy.premium.toLocaleString("en-IN")}`],
                    ["Next Due", policy.nextDue],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: `1px solid ${borderColor}` }}>
                      <span style={{ fontSize: 13, color: subColor }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Alerts */}
              {AlertsSection}
            </div>

            {/* Payments */}
            {PaymentsSection}

            {/* Claims */}
            {ClaimsSection}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Income Protection Analytics */}
              <Card title="Income Protection Analytics" accent="#16a34a">
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  {[{ label: "Total Earnings", value: `₹${incomeData.reduce((s, d) => s + d.earnings, 0).toLocaleString("en-IN")}`, color: "#0ea5e9" }, { label: "Protected Income", value: `₹${incomeData.reduce((s, d) => s + d.compensation, 0).toLocaleString("en-IN")}`, color: "#16a34a" }].map((s) => (
                    <div key={s.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 10, padding: "10px 14px", flex: 1, border: `1px solid ${borderColor}` }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={incomeData}>
                    <defs>
                      <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v, n) => [`₹${v.toLocaleString("en-IN")}`, n === "earnings" ? "Monthly Earnings" : "Protected Income"]} contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
                    <Legend iconType="circle" iconSize={8} />
                    <Area type="monotone" dataKey="earnings" stroke="#0ea5e9" fill="url(#earningsGrad)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="compensation" stroke="#16a34a" fill="url(#compGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Claim Distribution */}
              <Card title="Claim Status Distribution" accent="#f59e0b">
                {claimPieData.length === 0 ? (
                  <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: subColor, fontSize: 13 }}>No claim data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={claimPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                        {claimPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {selectedClaim && <ClaimModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />}
      {renderContent()}
    </div>
  );
}
