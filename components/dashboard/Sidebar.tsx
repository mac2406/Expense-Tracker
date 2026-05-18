"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  PiggyBank,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, notifications, setUser } = useStore();

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Budgets & Limits", href: "/budgets", icon: PiggyBank },
    { name: "Visual Analytics", href: "/analytics", icon: PieChart },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          style={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className="glass-panel"
        style={{
          ...styles.sidebar,
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Brand Banner */}
        <div style={styles.brand}>
          <div style={styles.logoBadge}>
            <span style={{ fontSize: "1.4rem" }}>🇨🇦</span>
          </div>
          <div>
            <h2 style={styles.brandText}>
              Lumina <span className="gradient-text">Spend</span>
            </h2>
            <span style={styles.brandSub}>Student Finance Hub</span>
          </div>
          <button
            style={styles.mobileCloseBtn}
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={styles.nav}>
          <span style={styles.sectionHeader}>Main Menu</span>
          <div style={styles.menuList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    ...styles.navLink,
                    backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                    borderColor: isActive ? "hsl(var(--primary))" : "transparent",
                    color: isActive ? "hsl(var(--foreground))" : "hsl(var(--muted))",
                    fontWeight: isActive ? "600" : "500",
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      marginRight: "12px",
                      color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                  />
                  <span>{item.name}</span>
                  {item.name === "Budgets & Limits" && notifications.some(n => n.type === "BUDGET_WARNING") && (
                    <ShieldAlert size={16} style={{ marginLeft: "auto", color: "hsl(var(--warning))" }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom User Profile Section */}
        <div style={styles.profileSection}>
          <div style={styles.profileCard}>
            <img
              src={user?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Alex"}
              alt="Avatar"
              style={styles.avatar}
            />
            <div style={styles.profileInfo}>
              <h4 style={styles.profileName}>{user?.name || "Alex Chen"}</h4>
              <span style={styles.profileEmail}>{user?.email || "demo@example.ca"}</span>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} style={{ marginRight: "10px" }} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Sidebar modular CSS styling object matching deep luxury glassmorphic specs
const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "var(--sidebar-width)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0",
    borderTop: "0",
    borderBottom: "0",
    borderLeft: "0",
    backgroundColor: "rgba(10, 10, 12, 0.95)",
    zIndex: 100,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 99,
  },
  brand: {
    height: "var(--header-height)",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: "12px",
    borderBottom: "1px solid hsl(var(--border))",
  },
  logoBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1.1",
  },
  brandSub: {
    fontSize: "0.72rem",
    color: "hsl(var(--muted-foreground))",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  mobileCloseBtn: {
    display: "none",
    marginLeft: "auto",
    color: "hsl(var(--muted))",
  },
  nav: {
    flex: 1,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionHeader: {
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "hsl(var(--muted-foreground))",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    paddingLeft: "12px",
  },
  menuList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.92rem",
    borderLeft: "3px solid transparent",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  profileSection: {
    padding: "20px 16px",
    borderTop: "1px solid hsl(var(--border))",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid hsl(var(--border))",
    objectFit: "cover",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "140px",
  },
  profileName: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "hsl(var(--foreground))",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileEmail: {
    fontSize: "0.78rem",
    color: "hsl(var(--muted-foreground))",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid hsl(var(--border))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "hsl(var(--destructive))",
    fontSize: "0.9rem",
    fontWeight: "500",
    backgroundColor: "transparent",
    transition: "all 0.2s",
  },
};
