"use client";

import React from "react";
import { formatCAD, formatPercent } from "@/lib/currency";
import { BudgetRecord, ExpenseRecord } from "@/store/useStore";
import { AlertCircle, CheckCircle, Flame } from "lucide-react";

interface BudgetProgressProps {
  budgets: BudgetRecord[];
  expenses: ExpenseRecord[];
}

export default function BudgetProgress({ budgets, expenses }: BudgetProgressProps) {
  // 1. Calculate spending for each budget category
  const budgetSummaries = budgets.map((budget) => {
    // Filter expenses in the current month matching the category
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);

    const spent = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return (
          e.category.toLowerCase() === budget.category.toLowerCase() &&
          d >= start &&
          d <= end
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const ratio = budget.limitAmount > 0 ? spent / budget.limitAmount : 0;
    
    return {
      id: budget.id,
      category: budget.category,
      limit: budget.limitAmount,
      spent,
      ratio,
    };
  });

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header} className="flex-between">
        <div>
          <h3 style={styles.title}>Budget Limits</h3>
          <span style={styles.subTitle}>Monthly category allocations</span>
        </div>
        <div style={styles.activeLabel}>
          {budgets.length} Active Budgets
        </div>
      </div>

      <div style={styles.list}>
        {budgetSummaries.length === 0 ? (
          <div style={styles.emptyState}>No active budgets configured. Add one below!</div>
        ) : (
          budgetSummaries.map((b) => {
            const percentage = Math.min(Math.round(b.ratio * 100), 100);
            
            // Set indicator state
            let barColor = "hsl(var(--primary))";
            let textColor = "hsl(var(--foreground))";
            let StatusIcon = CheckCircle;
            let iconColor = "hsl(var(--success))";

            if (b.ratio >= 1.0) {
              barColor = "hsl(var(--destructive))";
              textColor = "hsl(var(--destructive))";
              StatusIcon = Flame;
              iconColor = "hsl(var(--destructive))";
            } else if (b.ratio >= 0.8) {
              barColor = "hsl(var(--warning))";
              textColor = "hsl(var(--warning))";
              StatusIcon = AlertCircle;
              iconColor = "hsl(var(--warning))";
            }

            return (
              <div key={b.id} style={styles.item}>
                <div style={styles.itemHeader} className="flex-between">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StatusIcon size={16} style={{ color: iconColor }} />
                    <span style={styles.categoryLabel}>{b.category}</span>
                  </div>
                  <span style={{ ...styles.ratioText, color: textColor }}>
                    {formatPercent(b.ratio)} Spent
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                <div style={styles.itemFooter} className="flex-between">
                  <span style={styles.spentText}>
                    Spent: <strong style={{ color: "hsl(var(--foreground))" }}>{formatCAD(b.spent)}</strong>
                  </span>
                  <span style={styles.limitText}>Limit: {formatCAD(b.limit)}</span>
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
    flex: 1,
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
  activeLabel: {
    fontSize: "0.78rem",
    fontWeight: "600",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    color: "hsl(var(--primary))",
    padding: "4px 10px",
    borderRadius: "10px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyState: {
    padding: "24px",
    textAlign: "center",
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.88rem",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  itemHeader: {
    width: "100%",
  },
  categoryLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  ratioText: {
    fontSize: "0.82rem",
    fontWeight: "700",
  },
  barTrack: {
    width: "100%",
    height: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.4s ease-out",
  },
  itemFooter: {
    width: "100%",
    fontSize: "0.78rem",
  },
  spentText: {
    color: "hsl(var(--muted-foreground))",
  },
  limitText: {
    fontWeight: "500",
    color: "hsl(var(--muted))",
  },
};
