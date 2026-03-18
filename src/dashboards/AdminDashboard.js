import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Card, { StatCard } from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import ClaimModal from "../components/ClaimModal";
import { TableToolbar, SortableTh, Pagination, exportToCSV } from "../components/TableControls";
import { useApp } from "../context/AppContext";
import { useTableControls } from "../hooks/useTableControls";
import { workers, allClaims, disruptionData, financialData } from "../data/mockData";

const totalPremiums = financialData.reduce((s, d) => s + d.premiums, 0);
const totalPayouts = financialData.reduce((s, d) => s + d.payouts, 0);
const lossRatio = ((totalPayouts / totalPremiums) * 100).toFixed(1);
const fraudulent = allClaims.filter((c) => c.flagged);
const PIE_COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

function WorkerAvatar({ name }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#16a34a", "#0ea5e9"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function AdminDashboard({ activeView }) {
  const { darkMode, currentUser } = useApp();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [dateRange, setDateRange] = useState("all");

  const workerControls = useTableControls(workers, ["id", "name", "vehicle", "policy"]);
  const claimControls = useTableControls(allClaims, ["id", "worker", "type"]);
  const fraudControls = useTableControls(fraudulent, ["id", "worker", "type"]);

  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const rowHover = darkMode ? "#0f172a" : "#f8fafc";
  const borderColor = darkMode ? "#334155" : "#f1f5f9";

  const approved = allClaims.filter((c) => c.status === "Approved" || c.status === "Paid").length;
  const pending = allClaims.filter((c) => c.status === "Under Review").length;
  const rejected = allClaims.filter((c) => c.status === "Rejected").length;
  const totalClaimValue = allClaims.reduce((s, c) => s + c.amount, 0);

  const claimPieData = [
    { name: "Approved/Paid", value: approved },
    { name: "Under Review", value: pending },
    { name: "Rejected", value: rejected },
  ];

  const filteredFinancial = dateRange === "3m" ? financialData.slice(-3) : dateRange === "6m" ? financialData.slice(-6) : financialData;
  const td = { padding: "12px 16px", fontSize: 13, color: textColor, borderBottom: `1px solid ${borderColor}` };

  const renderContent = () => {
    switch (activeView) {
      case "workers":
        return (
          <Card title="Worker & Policy Management" accent="#6366f1">
            <TableToolbar search={workerControls.search} onSearch={workerControls.handleSearch} statusFilter={workerControls.statusFilter} onFilter={workerControls.handleFilter} statuses={workerControls.statuses} placeholder="Search workers..." onExport={() => exportToCSV(workers, "workers.csv")} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
                    <SortableTh label="Worker ID" sortKey="id" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                    <SortableTh label="Name" sortKey="name" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                    <SortableTh label="Vehicle" sortKey="vehicle" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                    <SortableTh label="Policy ID" sortKey="policy" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                    <SortableTh label="Annual Amount" sortKey="premium" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                    <SortableTh label="Status" sortKey="status" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {workerControls.paginated.map((w) => (
                    <tr key={w.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = rowHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12, background: darkMode ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{w.id}</span></td>
                      <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><WorkerAvatar name={w.name} /><span style={{ fontWeight: 600 }}>{w.name}</span></div></td>
                      <td style={td}>{w.vehicle}</td>
                      <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{w.policy}</span></td>
                      <td style={{ ...td, fontWeight: 700 }}>₹{w.premium.toLocaleString("en-IN")}</td>
                      <td style={td}><StatusBadge status={w.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={workerControls.page} totalPages={workerControls.totalPages} onPage={workerControls.setPage} />
          </Card>
        );

      case "claims":
        return (
          <Card title="Claims & Compensation Monitoring" accent="#16a34a">
            <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
              {[{ label: "Approved / Paid", value: approved, color: "#16a34a", icon: "✅" }, { label: "Under Review", value: pending, color: "#ca8a04", icon: "⏳" }, { label: "Rejected", value: rejected, color: "#dc2626", icon: "❌" }].map((s) => (
                <div key={s.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: "14px 20px", flex: 1, borderLeft: `4px solid ${s.color}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: subColor, marginTop: 3 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <TableToolbar search={claimControls.search} onSearch={claimControls.handleSearch} statusFilter={claimControls.statusFilter} onFilter={claimControls.handleFilter} statuses={claimControls.statuses} placeholder="Search claims..." onExport={() => exportToCSV(allClaims, "claims.csv")} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
                    <SortableTh label="Claim ID" sortKey="id" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                    <SortableTh label="Worker" sortKey="worker" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                    <SortableTh label="Type" sortKey="type" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                    <SortableTh label="Amount" sortKey="amount" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                    <SortableTh label="Date" sortKey="date" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                    <SortableTh label="Status" sortKey="status" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {claimControls.paginated.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedClaim(c)} style={{ cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = rowHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12, background: darkMode ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{c.id}</span></td>
                      <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><WorkerAvatar name={c.worker} />{c.worker}</div></td>
                      <td style={td}><span style={{ background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{c.type}</span></td>
                      <td style={{ ...td, fontWeight: 700 }}>₹{c.amount.toLocaleString("en-IN")}</td>
                      <td style={td}>{c.date}</td>
                      <td style={td}><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={claimControls.page} totalPages={claimControls.totalPages} onPage={claimControls.setPage} />
          </Card>
        );

      case "analytics":
        return (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card title="Disruption Pattern & Risk Analytics" accent="#f59e0b">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={disruptionData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
                    <Legend iconType="circle" iconSize={8} />
                    <Bar dataKey="storms" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="floods" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="heatwaves" fill="#fb923c" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card title="Claims Distribution" accent="#8b5cf6">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={claimPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                      {claimPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card title="Loss Ratio & Financial Performance" accent="#16a34a">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  {[{ label: "Total Premiums", value: `₹${totalPremiums.toLocaleString("en-IN")}`, color: "#16a34a" }, { label: "Total Payouts", value: `₹${totalPayouts.toLocaleString("en-IN")}`, color: "#ef4444" }, { label: "Loss Ratio", value: `${lossRatio}%`, color: "#f59e0b" }].map((s) => (
                    <div key={s.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: "12px 18px", textAlign: "center", border: `1px solid ${borderColor}` }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, background: darkMode ? "#0f172a" : "#f1f5f9", borderRadius: 10, padding: 4 }}>
                  {[["all", "All Time"], ["6m", "6 Months"], ["3m", "3 Months"]].map(([val, label]) => (
                    <button key={val} onClick={() => setDateRange(val)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: dateRange === val ? "#6366f1" : "transparent", color: dateRange === val ? "#fff" : subColor, transition: "all 0.2s" }}>{label}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={filteredFinancial}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="premiums" stroke="#16a34a" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="payouts" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        );

      case "fraud":
        return (
          <Card title="🚨 Fraud Monitoring Console" accent="#ef4444">
            <TableToolbar search={fraudControls.search} onSearch={fraudControls.handleSearch} placeholder="Search suspicious claims..." onExport={() => exportToCSV(fraudulent, "fraud.csv")} />
            {fraudControls.paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: subColor }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: textColor }}>No suspicious claims detected</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: darkMode ? "#0f172a" : "#fff7ed" }}>
                      {["Claim ID", "Worker", "Type", "Amount", "Date", "Status", "Flag"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, color: subColor, fontWeight: 700, borderBottom: `1px solid ${borderColor}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fraudControls.paginated.map((c) => (
                      <tr key={c.id} onClick={() => setSelectedClaim(c)} style={{ background: darkMode ? "rgba(239,68,68,0.05)" : "#fff7ed", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.1)" : "#fee2e2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.05)" : "#fff7ed"}>
                        <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{c.id}</span></td>
                        <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><WorkerAvatar name={c.worker} />{c.worker}</div></td>
                        <td style={td}>{c.type}</td>
                        <td style={{ ...td, fontWeight: 700 }}>₹{c.amount.toLocaleString("en-IN")}</td>
                        <td style={td}>{c.date}</td>
                        <td style={td}><StatusBadge status={c.status} /></td>
                        <td style={td}><span style={{ color: "#dc2626", fontWeight: 700, background: "#fee2e2", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>⚠️ Suspicious</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={fraudControls.page} totalPages={fraudControls.totalPages} onPage={fraudControls.setPage} />
          </Card>
        );

      default: // "admin" — full overview
        return (
          <>
            {/* Hero Banner */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", borderRadius: 20, padding: "28px 32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.1)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 120, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.08)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.6, marginBottom: 6 }}>Operations Center 🛡️</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>Admin Dashboard</h1>
          <p style={{ opacity: 0.6, fontSize: 13, marginTop: 6 }}>Welcome back, {currentUser?.name} · Full system access</p>
        </div>
        <div style={{ display: "flex", gap: 12, position: "relative" }}>
          {[
            { label: "Active Workers", value: workers.filter(w => w.status === "Active").length },
            { label: "Total Claims", value: allClaims.length },
            { label: "Fraud Alerts", value: fraudulent.length },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 20px", textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
        <StatCard label="Registered Workers" value={workers.length} icon="👷" color="#6366f1" trend={{ dir: "up", pct: "2.0" }} subtitle="6 active policies" />
        <StatCard label="Approved Claims" value={approved} icon="✅" color="#16a34a" trend={{ dir: "up", pct: "8.3" }} subtitle={`₹${totalClaimValue.toLocaleString("en-IN")} total value`} />
        <StatCard label="Pending Claims" value={pending} icon="⏳" color="#f59e0b" trend={{ dir: "down", pct: "4.1" }} subtitle="Awaiting review" />
        <StatCard label="Loss Ratio" value={`${lossRatio}%`} icon="📊" color="#ef4444" trend={{ dir: "up", pct: "1.2" }} subtitle="Industry avg: 65%" />
      </div>

      {/* Workers Table */}
      <Card title="Worker & Policy Management" accent="#6366f1">
        <TableToolbar search={workerControls.search} onSearch={workerControls.handleSearch} statusFilter={workerControls.statusFilter} onFilter={workerControls.handleFilter} statuses={workerControls.statuses} placeholder="Search workers..." onExport={() => exportToCSV(workers, "workers.csv")} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
                <SortableTh label="Worker ID" sortKey="id" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                <SortableTh label="Name" sortKey="name" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                <SortableTh label="Vehicle" sortKey="vehicle" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                <SortableTh label="Policy ID" sortKey="policy" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                <SortableTh label="Annual Amount" sortKey="premium" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
                <SortableTh label="Status" sortKey="status" currentSort={workerControls.sortKey} currentDir={workerControls.sortDir} onSort={workerControls.toggleSort} />
              </tr>
            </thead>
            <tbody>
              {workerControls.paginated.map((w) => (
                <tr key={w.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = rowHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12, background: darkMode ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{w.id}</span></td>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <WorkerAvatar name={w.name} />
                      <span style={{ fontWeight: 600 }}>{w.name}</span>
                    </div>
                  </td>
                  <td style={td}>{w.vehicle}</td>
                  <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{w.policy}</span></td>
                  <td style={{ ...td, fontWeight: 700 }}>₹{w.premium.toLocaleString("en-IN")}</td>
                  <td style={td}><StatusBadge status={w.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={workerControls.page} totalPages={workerControls.totalPages} onPage={workerControls.setPage} />
      </Card>

      {/* Claims Table */}
      <Card title="Claims & Compensation Monitoring" accent="#16a34a">
        <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          {[{ label: "Approved / Paid", value: approved, color: "#16a34a", icon: "✅" }, { label: "Under Review", value: pending, color: "#ca8a04", icon: "⏳" }, { label: "Rejected", value: rejected, color: "#dc2626", icon: "❌" }].map((s) => (
            <div key={s.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: "14px 20px", flex: 1, borderLeft: `4px solid ${s.color}`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: subColor, marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <TableToolbar search={claimControls.search} onSearch={claimControls.handleSearch} statusFilter={claimControls.statusFilter} onFilter={claimControls.handleFilter} statuses={claimControls.statuses} placeholder="Search claims..." onExport={() => exportToCSV(allClaims, "claims.csv")} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
                <SortableTh label="Claim ID" sortKey="id" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                <SortableTh label="Worker" sortKey="worker" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                <SortableTh label="Type" sortKey="type" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                <SortableTh label="Amount" sortKey="amount" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                <SortableTh label="Date" sortKey="date" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
                <SortableTh label="Status" sortKey="status" currentSort={claimControls.sortKey} currentDir={claimControls.sortDir} onSort={claimControls.toggleSort} />
              </tr>
            </thead>
            <tbody>
              {claimControls.paginated.map((c) => (
                <tr key={c.id} onClick={() => setSelectedClaim(c)} style={{ cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = rowHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12, background: darkMode ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{c.id}</span></td>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <WorkerAvatar name={c.worker} />
                      {c.worker}
                    </div>
                  </td>
                  <td style={td}><span style={{ background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{c.type}</span></td>
                  <td style={{ ...td, fontWeight: 700 }}>₹{c.amount.toLocaleString("en-IN")}</td>
                  <td style={td}>{c.date}</td>
                  <td style={td}><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={claimControls.page} totalPages={claimControls.totalPages} onPage={claimControls.setPage} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Disruption Chart */}
        <Card title="Disruption Pattern & Risk Analytics" accent="#f59e0b">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={disruptionData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="storms" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="floods" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="heatwaves" fill="#fb923c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Claims Pie */}
        <Card title="Claims Distribution" accent="#8b5cf6">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={claimPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                {claimPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Financial Chart */}
      <Card title="Loss Ratio & Financial Performance" accent="#16a34a">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ label: "Total Premiums", value: `₹${totalPremiums.toLocaleString("en-IN")}`, color: "#16a34a" }, { label: "Total Payouts", value: `₹${totalPayouts.toLocaleString("en-IN")}`, color: "#ef4444" }, { label: "Loss Ratio", value: `${lossRatio}%`, color: "#f59e0b" }].map((s) => (
              <div key={s.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: "12px 18px", textAlign: "center", border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, background: darkMode ? "#0f172a" : "#f1f5f9", borderRadius: 10, padding: 4 }}>
            {[["all", "All Time"], ["6m", "6 Months"], ["3m", "3 Months"]].map(([val, label]) => (
              <button key={val} onClick={() => setDateRange(val)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: dateRange === val ? "#6366f1" : "transparent", color: dateRange === val ? "#fff" : subColor, transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filteredFinancial}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: subColor }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
            <Legend iconType="circle" iconSize={8} />
            <Line type="monotone" dataKey="premiums" stroke="#16a34a" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="payouts" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Fraud Console */}
      <Card title="🚨 Fraud Monitoring Console" accent="#ef4444">
        <TableToolbar search={fraudControls.search} onSearch={fraudControls.handleSearch} placeholder="Search suspicious claims..." onExport={() => exportToCSV(fraudulent, "fraud.csv")} />
        {fraudControls.paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: subColor }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: textColor }}>No suspicious claims detected</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: darkMode ? "#0f172a" : "#fff7ed" }}>
                  {["Claim ID", "Worker", "Type", "Amount", "Date", "Status", "Flag"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, color: subColor, fontWeight: 700, borderBottom: `1px solid ${borderColor}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fraudControls.paginated.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedClaim(c)} style={{ background: darkMode ? "rgba(239,68,68,0.05)" : "#fff7ed", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.1)" : "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.05)" : "#fff7ed"}>
                    <td style={td}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{c.id}</span></td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <WorkerAvatar name={c.worker} />
                        {c.worker}
                      </div>
                    </td>
                    <td style={td}>{c.type}</td>
                    <td style={{ ...td, fontWeight: 700 }}>₹{c.amount.toLocaleString("en-IN")}</td>
                    <td style={td}>{c.date}</td>
                    <td style={td}><StatusBadge status={c.status} /></td>
                    <td style={td}><span style={{ color: "#dc2626", fontWeight: 700, background: "#fee2e2", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>⚠️ Suspicious</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={fraudControls.page} totalPages={fraudControls.totalPages} onPage={fraudControls.setPage} />
      </Card>
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
