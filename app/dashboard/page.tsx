"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import MetricCard from "@/components/dashboard/MetricCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickAddTransaction from "@/components/dashboard/QuickAddTransaction";
import { Wallet, ArrowDownCircle, ArrowUpCircle, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { budgets, expenses, getFinancialSummary } = useStore();

  // 1. Calculate dynamic financial sums from the global state store
  const { totalIncome, totalExpenses, netSavings, savingsRate } = getFinancialSummary();

  return (
    <div style={styles.container}>
      {/* Page Title & Intro */}
      <div style={styles.header}>
        <h1 style={styles.title}>Financial Dashboard</h1>
        <p style={styles.subtitle}>
          Real-time cash flow, Canadian budget category tracking, and savings metrics.
        </p>
      </div>

      {/* 4-Column Key Metrics Grid */}
      <div style={styles.metricsGrid}>
        <MetricCard
          title="Total Cash Flow (Net)"
          value={netSavings}
          subtitle="Remaining balance"
          trend={{ value: 8, isPositive: netSavings >= 0 }}
          type={netSavings >= 0 ? "primary" : "destructive"}
          icon={Wallet}
        />
        <MetricCard
          title="Total Income"
          value={totalIncome}
          subtitle="Part-time jobs & stipends"
          trend={{ value: 14, isPositive: true }}
          type="success"
          icon={ArrowUpCircle}
        />
        <MetricCard
          title="Monthly Expenses"
          value={totalExpenses}
          subtitle="Rent, metropasses, groceries"
          trend={{ value: 4, isPositive: false }}
          type="destructive"
          icon={ArrowDownCircle}
        />
        <MetricCard
          title="Savings Rate"
          value={savingsRate * 100} // formatCAD fallback parses it, but let's show as raw percentage value inside subtitles
          subtitle="Portion of earnings saved"
          trend={{ value: Math.round(savingsRate * 100), isPositive: savingsRate >= 0.2 }}
          type="warning"
          icon={TrendingUp}
        />
      </div>

      {/* Main Two-Column Interactive Layout */}
      <div style={styles.layoutGrid}>
        {/* Left Column: Charts and quick entry form */}
        <div style={styles.leftCol}>
          <SpendingChart />
          <QuickAddTransaction />
        </div>

        {/* Right Column: Budgets progress and recent transactions list */}
        <div style={styles.rightCol}>
          <BudgetProgress budgets={budgets} expenses={expenses} />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}

// Responsive CSS-in-JS style rules matching luxury, minimal dashboard spacing
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    width: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "0.92rem",
    color: "hsl(var(--muted))",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  layoutGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    width: "100%",
  },
  leftCol: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minWidth: "320px",
  },
  rightCol: {
    flex: 1.2,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minWidth: "300px",
  },
};
