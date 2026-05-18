"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Success - Route immediately to dashboard
      router.push("/dashboard");
      router.refresh(); // Trigger page refresh to re-evaluate route middleware
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dynamic Background Accent Glows */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge} className="pulse-glow">
            <span style={{ fontSize: "1.6rem" }}>🇨🇦</span>
          </div>
          <h1 style={styles.title}>
            Lumina <span className="gradient-text">Spend</span>
          </h1>
          <p style={styles.subtitle}>Canadian Student & Professional Finance Portal</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="e.g. alex@university.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div className="flex-between">
              <label style={styles.label}>Password</label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <div style={styles.spinner} />
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            New to Canada or Lumina Spend?{" "}
            <Link href="/register" style={styles.signupLink}>
              Create an Account
            </Link>
          </p>
          <div style={styles.securitySeal}>
            <ShieldCheck size={14} style={{ marginRight: "4px", color: "hsl(var(--success))" }} />
            <span>256-bit bank-grade encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline responsive Javascript styling objects for premium rendering
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "radial-gradient(circle at center, #111116 0%, #060608 100%)",
    padding: "20px",
  },
  glow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    top: "10%",
    left: "15%",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.15)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    bottom: "10%",
    right: "15%",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.1)",
    filter: "blur(70px)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    zIndex: 10,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "8px",
  },
  logoBadge: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "hsl(var(--muted))",
    maxWidth: "320px",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "var(--radius-sm)",
    color: "hsl(var(--destructive))",
    padding: "12px 16px",
    fontSize: "0.88rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.82rem",
    fontWeight: "500",
    color: "hsl(var(--foreground))",
    opacity: 0.9,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "hsl(var(--muted-foreground))",
    pointerEvents: "none",
  },
  forgotLink: {
    fontSize: "0.82rem",
    color: "hsl(var(--primary))",
    opacity: 0.85,
  },
  forgotLinkHover: {
    opacity: 1,
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    padding: "14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.95rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s, transform 0.1s",
    marginTop: "8px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "pulse 1s linear infinite", // fallback dynamic animation
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginTop: "8px",
    borderTop: "1px solid hsl(var(--border))",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "0.88rem",
    color: "hsl(var(--muted))",
    textAlign: "center",
  },
  signupLink: {
    color: "hsl(var(--primary))",
    fontWeight: "600",
  },
  securitySeal: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "hsl(var(--muted-foreground))",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};
