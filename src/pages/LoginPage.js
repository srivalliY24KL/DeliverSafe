import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginPage({ onGoSignUp }) {
  const { login, darkMode, users } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";
  const inputBorder = darkMode ? "#334155" : "#e2e8f0";

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      // Always read fresh from localStorage so newly signed up users are found
      let latestUsers = users;
      try {
        const stored = localStorage.getItem("ds_users");
        if (stored) latestUsers = JSON.parse(stored);
      } catch (_) {}
      const user = latestUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      if (user) login(user);
      else setError("Invalid email or password. Please try again.");
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: cardBg, borderRadius: 20, padding: "44px 40px", width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📦</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: textColor, margin: 0 }}>DeliverSafe</h1>
          <p style={{ color: subColor, fontSize: 14, marginTop: 8 }}>Insurance Platform for Delivery Workers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ef4444" : inputBorder}`, background: inputBg, color: textColor, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#6366f1"}
              onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : inputBorder}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: textColor, display: "block", marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ef4444" : inputBorder}`, background: inputBg, color: textColor, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : inputBorder}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: subColor, padding: 0 }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "13px", background: loading ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#4f46e5"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#6366f1"; }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: subColor, fontSize: 13, marginTop: 24 }}>
          Don't have an account?{" "}
          <button onClick={onGoSignUp} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
