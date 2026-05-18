"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Sidebar from "@/components/dashboard/Sidebar";
import { Bell, Menu, Moon, Sun, ShieldAlert, Check } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    user,
    theme,
    notifications,
    setUser,
    setTheme,
    toggleTheme,
    setExpenses,
    setIncomes,
    setBudgets,
    setSavingsGoals,
    setNotifications,
    markNotificationAsRead,
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. Initial Data Hydration & Session Check
  useEffect(() => {
    async function hydrateApp() {
      try {
        // Fetch current session user
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();

        if (!userData.user) {
          router.push("/login");
          return;
        }

        // Hydrate User details
        setUser(userData.user);

        // Fetch user financial records in parallel
        const [expensesRes, incomeRes, budgetsRes, savingsRes, notifyRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/income"),
          fetch("/api/budgets"),
          fetch("/api/savings-goals"),
          fetch("/api/notifications"),
        ]);

        const [expenses, incomes, budgets, savings, notifications] = await Promise.all([
          expensesRes.json(),
          incomeRes.json(),
          budgetsRes.json(),
          savingsRes.json(),
          notifyRes.json(),
        ]);

        // Populate global store
        setExpenses(expenses.data || []);
        setIncomes(incomes.data || []);
        setBudgets(budgets.data || []);
        setSavingsGoals(savings.data || []);
        setNotifications(notifications.data || []);
      } catch (error) {
        console.error("Hydration error:", error);
      } finally {
        setLoading(false);
      }
    }

    hydrateApp();
  }, [setUser, setExpenses, setIncomes, setBudgets, setSavingsGoals, setNotifications, router]);

  // Sync theme with document class list
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (theme === "dark") {
        html.classList.add("dark");
        html.classList.remove("light");
      } else {
        html.classList.add("light");
        html.classList.remove("dark");
      }
    }
  }, [theme]);

  const handleMarkAsRead = async (id: string) => {
    try {
      markNotificationAsRead(id);
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} className="pulse-glow" />
        <p style={{ marginTop: "16px", color: "hsl(var(--muted))", fontWeight: 500 }}>
          Securing connection to Lumina Spend Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Layout */}
      <div className="main-content">
        {/* Dynamic Glassmorphic Navbar */}
        <header className="glass-panel" style={styles.header}>
          <button style={styles.hamburger} onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>

          <div style={styles.welcomeText}>
            <h3 style={{ fontSize: "1.1rem" }}>Welcome back, {user?.name?.split(" ")[0]}! 👋</h3>
            <span style={styles.todayDate}>
              {new Date().toLocaleDateString("en-CA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div style={styles.navActions}>
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} style={styles.actionBtn}>
              {theme === "dark" ? <Sun size={20} style={{ color: "hsl(var(--warning))" }} /> : <Moon size={20} />}
            </button>

            {/* Notification Center Trigger */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  ...styles.actionBtn,
                  backgroundColor: showNotifications ? "rgba(99, 102, 241, 0.1)" : undefined,
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={styles.badge} className="pulse-glow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Glassmorphic Notification Popover */}
              {showNotifications && (
                <div className="glass-panel" style={styles.notificationBox}>
                  <div style={styles.notifyHeader} className="flex-between">
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Notifications</span>
                    {unreadCount > 0 && <span style={styles.unreadCountLabel}>{unreadCount} unread</span>}
                  </div>

                  <div style={styles.notifyList}>
                    {notifications.length === 0 ? (
                      <div style={styles.emptyNotify}>All quiet! No notifications.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            ...styles.notifyItem,
                            backgroundColor: n.isRead ? "transparent" : "rgba(99, 102, 241, 0.05)",
                          }}
                        >
                          <div style={styles.notifyMeta}>
                            {n.type === "BUDGET_WARNING" ? (
                              <ShieldAlert size={16} style={{ color: "hsl(var(--warning))", marginRight: "8px" }} />
                            ) : (
                              <span style={{ marginRight: "8px" }}>📢</span>
                            )}
                            <span style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>{n.message}</span>
                          </div>
                          {!n.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(n.id)}
                              style={styles.markReadBtn}
                              title="Mark as read"
                            >
                              <Check size={12} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Layout Pages */}
        <main style={styles.pageViewport}>{children}</main>
      </div>
    </div>
  );
}

// Layout styling specifications
const styles: { [key: string]: React.CSSProperties } = {
  loadingScreen: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#08080a",
  },
  spinner: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "3px solid rgba(99, 102, 241, 0.12)",
    borderTopColor: "hsl(var(--primary))",
    animation: "pulse-glow-keyframes 2s infinite",
  },
  header: {
    height: "var(--header-height)",
    borderRadius: "0",
    borderTop: "0",
    borderLeft: "0",
    borderRight: "0",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    backgroundColor: "rgba(10, 10, 12, 0.5)",
    gap: "20px",
    zIndex: 90,
  },
  hamburger: {
    display: "none",
    color: "hsl(var(--foreground))",
  },
  welcomeText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  todayDate: {
    fontSize: "0.8rem",
    color: "hsl(var(--muted-foreground))",
  },
  navActions: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  actionBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid hsl(var(--border))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "hsl(var(--foreground))",
    transition: "all 0.2s",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    backgroundColor: "hsl(var(--destructive))",
    color: "#fff",
    fontSize: "0.68rem",
    fontWeight: "700",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBox: {
    position: "absolute",
    top: "52px",
    right: "0",
    width: "320px",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    overflow: "hidden",
    zIndex: 200,
  },
  notifyHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid hsl(var(--border))",
  },
  unreadCountLabel: {
    fontSize: "0.75rem",
    color: "hsl(var(--primary))",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "600",
  },
  notifyList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  emptyNotify: {
    padding: "20px",
    textAlign: "center",
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.85rem",
  },
  notifyItem: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.02)",
    gap: "10px",
  },
  notifyMeta: {
    display: "flex",
    alignItems: "flex-start",
    flex: 1,
  },
  markReadBtn: {
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "hsl(var(--muted))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  pageViewport: {
    flex: 1,
    padding: "32px",
    position: "relative",
  },
};
