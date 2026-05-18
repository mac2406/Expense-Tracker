"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { formatCAD } from "@/lib/currency";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";

export default function RecentTransactions() {
  const { expenses, incomes, deleteExpense, deleteIncome } = useStore();

  // 1. Merge and sort transactions by date descending
  const recentList = useMemo(() => {
    const expList = expenses.map((e) => ({
      ...e,
      txType: "expense" as const,
    }));
    
    const incList = incomes.map((i) => ({
      ...i,
      paymentMethod: "Direct Deposit", // dummy placeholder for income display structure
      txType: "income" as const,
    }));

    return [...expList, ...incList]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // display only the 5 latest items
  }, [expenses, incomes]);

  const handleDelete = async (id: string, type: "expense" | "income") => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    try {
      if (type === "expense") {
        deleteExpense(id);
        await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      } else {
        deleteIncome(id);
        await fetch(`/api/income/${id}`, { method: "DELETE" });
      }
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header} className="flex-between">
        <div>
          <h3 style={styles.title}>Recent Activity</h3>
          <span style={styles.subTitle}>Latest cash movements</span>
        </div>
        <Link href="/transactions" style={styles.viewAllBtn}>
          View Ledger
        </Link>
      </div>

      <div style={styles.list}>
        {recentList.length === 0 ? (
          <div style={styles.emptyState}>No recent transactions found. Add one to get started!</div>
        ) : (
          recentList.map((tx) => {
            const isExpense = tx.txType === "expense";
            const dateStr = new Date(tx.date).toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
            });

            return (
              <div key={tx.id} style={styles.item} className="flex-between">
                <div style={styles.itemMeta}>
                  {/* Directional Icon indicator */}
                  <div
                    style={{
                      ...styles.iconBadge,
                      backgroundColor: isExpense ? "rgba(244, 63, 94, 0.08)" : "rgba(16, 185, 129, 0.08)",
                      borderColor: isExpense ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: isExpense ? "hsl(var(--destructive))" : "hsl(var(--success))",
                    }}
                  >
                    {isExpense ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div style={styles.txDetails}>
                    <h4 style={styles.categoryLabel}>{tx.category}</h4>
                    <span style={styles.metaLabel}>
                      {dateStr} • {isExpense ? tx.paymentMethod : (tx as any).source}
                    </span>
                  </div>
                </div>

                <div style={styles.itemAction}>
                  {/* Amount with color highlighting */}
                  <span
                    style={{
                      ...styles.amountText,
                      color: isExpense ? "hsl(var(--destructive))" : "hsl(var(--success))",
                    }}
                  >
                    {isExpense ? "-" : "+"}
                    {formatCAD(tx.amount)}
                  </span>
                  
                  {/* Action delete */}
                  <button
                    onClick={() => handleDelete(tx.id, tx.txType)}
                    style={styles.deleteBtn}
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1.2,
    minWidth: "300px",
  },
  header: {
    width: "100%",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  subTitle: {
    fontSize: "0.8rem",
    color: "hsl(var(--muted-foreground))",
  },
  viewAllBtn: {
    fontSize: "0.82rem",
    fontWeight: "600",
    color: "hsl(var(--primary))",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(99, 102, 241, 0.15)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  emptyState: {
    padding: "24px",
    textAlign: "center",
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.88rem",
  },
  item: {
    padding: "10px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
  },
  itemMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  iconBadge: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  txDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  categoryLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  metaLabel: {
    fontSize: "0.78rem",
    color: "hsl(var(--muted-foreground))",
  },
  itemAction: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  amountText: {
    fontSize: "0.95rem",
    fontWeight: "700",
  },
  deleteBtn: {
    backgroundColor: "transparent",
    color: "hsl(var(--muted-foreground))",
    cursor: "pointer",
    transition: "color 0.2s",
    padding: "4px",
    borderRadius: "4px",
  },
};
