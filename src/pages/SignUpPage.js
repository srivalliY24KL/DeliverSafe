import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SignUpPage({ onGoLogin }) {
  const { signup, darkMode } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: "", vehicle: "Bike", city: "", pincode: "",
  });

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";
  const inputBorder = darkMode ? "#334155" : "#e2e8f0";

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${inputBorder}`, background: inputBg,
    color: textColor, fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setError(""); };

  // Step titles change based on role
  const isWorker = form.role === "worker";
  const stepTitles = ["Account Type", "Personal Info", "Set Password", ...(isWorker ? ["Location & Vehicle"] : [])];
  const stepIcons = ["🎭", "👤", "🔒", ...(isWorker ? ["📍"] : [])];
  const totalSteps = stepTitles.length;

  const handleStep1 = (e) => {
    e.preventDefault();
    setError("");
    if (!form.role) return setError("Please select an account type.");
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Full name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (!/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ""))) return setError("Enter a valid phone number.");
    setStep(3);
  };

  const handleStep3 = (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (isWorker) { setStep(4); return; }
    // Admin — submit directly
    submitForm();
  };

  const handleStep4 = (e) => {
    e.preventDefault();
    setError("");
    if (!form.city.trim()) return setError("City is required.");
    if (!/^\d{6}$/.test(form.pincode)) return setError("Enter a valid 6-digit pincode.");
    submitForm();
  };

  const submitForm = () => {
    setLoading(true);
    setTimeout(() => {
      const result = signup(form);
      if (!result.success) { setError(result.message); setLoading(false); }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: cardBg, borderRadius: 20, padding: "40px 40px", width: "100%", maxWidth: 460, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: textColor, margin: 0 }}>Create Account</h1>
          <p style={{ color: subColor, fontSize: 13, marginTop: 6 }}>Join DeliverSafe Insurance Platform</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          {stepTitles.map((title, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={title}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: done || active ? "#6366f1" : (darkMode ? "#334155" : "#e2e8f0"), color: done || active ? "#fff" : subColor, transition: "all 0.3s" }}>
                    {done ? "✓" : stepIcons[i]}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#6366f1" : subColor, textAlign: "center" }}>{title}</span>
                </div>
                {i < totalSteps - 1 && (
                  <div style={{ flex: 1, height: 2, background: step > num ? "#6366f1" : (darkMode ? "#334155" : "#e2e8f0"), margin: "0 4px", marginBottom: 20, borderRadius: 2, transition: "background 0.3s" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Step 1 — Account Type */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 12 }}>
              I want to sign up as a...
            </label>
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              {[
                { role: "worker", icon: "🏍️", title: "Delivery Worker", desc: "Access your policy, claims & payments" },
                { role: "admin", icon: "🛡️", title: "Administrator", desc: "Manage workers, claims & analytics" },
              ].map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => set("role", opt.role)}
                  style={{
                    flex: 1, padding: "18px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                    border: `2px solid ${form.role === opt.role ? "#6366f1" : inputBorder}`,
                    background: form.role === opt.role ? (darkMode ? "#312e81" : "#ede9fe") : inputBg,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{opt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: form.role === opt.role ? "#6366f1" : textColor, marginBottom: 4 }}>{opt.title}</div>
                  <div style={{ fontSize: 11, color: subColor, lineHeight: 1.4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <button type="submit" style={{ width: "100%", padding: "13px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Continue →
            </button>
          </form>
        )}

        {/* Step 2 — Personal Info */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Full Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="e.g. priya@email.com" style={inputStyle} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="e.g. +91 98765 43210" style={inputStyle} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: inputBg, color: subColor, border: `1px solid ${inputBorder}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button type="submit" style={{ flex: 2, padding: "13px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Continue →</button>
            </div>
          </form>
        )}

        {/* Step 3 — Password */}
        {step === 3 && (
          <form onSubmit={handleStep3}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 44 }} required
                  onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: subColor }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, borderRadius: 4, background: darkMode ? "#334155" : "#e2e8f0", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, transition: "width 0.3s, background 0.3s", width: form.password.length < 6 ? "33%" : form.password.length < 10 ? "66%" : "100%", background: form.password.length < 6 ? "#ef4444" : form.password.length < 10 ? "#f59e0b" : "#16a34a" }} />
                  </div>
                  <span style={{ fontSize: 11, color: form.password.length < 6 ? "#ef4444" : form.password.length < 10 ? "#f59e0b" : "#16a34a" }}>
                    {form.password.length < 6 ? "Weak" : form.password.length < 10 ? "Medium" : "Strong"}
                  </span>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter your password"
                style={{ ...inputStyle, borderColor: form.confirmPassword && form.confirmPassword !== form.password ? "#ef4444" : inputBorder }} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: "13px", background: inputBg, color: subColor, border: `1px solid ${inputBorder}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: "13px", background: loading ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {isWorker ? "Continue →" : (loading ? "Creating Account..." : "Create Account")}
              </button>
            </div>
          </form>
        )}

        {/* Step 4 — Location & Vehicle (Workers only) */}
        {step === 4 && (
          <form onSubmit={handleStep4}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Vehicle Type</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ v: "Bike", icon: "🏍️" }, { v: "Motorcycle", icon: "🛵" }].map(({ v, icon }) => (
                  <button key={v} type="button" onClick={() => set("vehicle", v)} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: `2px solid ${form.vehicle === v ? "#6366f1" : inputBorder}`, background: form.vehicle === v ? (darkMode ? "#312e81" : "#ede9fe") : inputBg, color: form.vehicle === v ? "#6366f1" : subColor, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {icon} {v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>City</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>Pincode</label>
              <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="e.g. 400001" maxLength={6} style={inputStyle} required
                onFocus={(e) => e.target.style.borderColor = "#6366f1"} onBlur={(e) => e.target.style.borderColor = inputBorder} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: "13px", background: inputBg, color: subColor, border: `1px solid ${inputBorder}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: "13px", background: loading ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: "center", color: subColor, fontSize: 13, marginTop: 24 }}>
          Already have an account?{" "}
          <button onClick={onGoLogin} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
