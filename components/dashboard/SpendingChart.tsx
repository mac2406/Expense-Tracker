"use client";

import React, { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { formatCAD } from "@/lib/currency";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartDataPoint {
  dateLabel: string;
  Income: number;
  Expenses: number;
}

export default function SpendingChart() {
  const { incomes, expenses } = useStore();

  const chartData = useMemo(() => {
    // 1. Determine dates for the last 7 days including today
    const dataPoints: { [key: string]: ChartDataPoint } = {};
    const dates: Date[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const dateLabel = d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
      
      dates.push(d);
      dataPoints[key] = {
        dateLabel,
        Income: 0,
        Expenses: 0,
      };
    }

    // 2. Aggregate Incomes by date key
    incomes.forEach((inc) => {
      const d = new Date(inc.date);
      const key = d.toLocaleDateString("en-CA");
      if (dataPoints[key]) {
        dataPoints[key].Income += inc.amount;
      }
    });

    // 3. Aggregate Expenses by date key
    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = d.toLocaleDateString("en-CA");
      if (dataPoints[key]) {
        dataPoints[key].Expenses += exp.amount;
      }
    });

    // 4. Return as chronologically sorted array
    return Object.values(dataPoints);
  }, [incomes, expenses]);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{payload[0].payload.dateLabel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "hsl(var(--success))", fontWeight: 600 }}>
              Income: {formatCAD(payload[0].value)}
            </span>
            <span style={{ color: "hsl(var(--destructive))", fontWeight: 600 }}>
              Expenses: {formatCAD(payload[1].value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header} className="flex-between">
        <div>
          <h3 style={styles.title}>Cash Flow Overview</h3>
          <span style={styles.subTitle}>Activity over the last 7 days</span>
        </div>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.dot, backgroundColor: "hsl(var(--success))" }} />
            <span>Income</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.dot, backgroundColor: "hsl(var(--primary))" }} />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip content={customTooltip} />
            <Area
              type="monotone"
              dataKey="Income"
              stroke="hsl(var(--success))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flex: 2,
    minWidth: "320px",
    minHeight: "360px",
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
  legend: {
    display: "flex",
    gap: "16px",
    fontSize: "0.82rem",
    fontWeight: "500",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "hsl(var(--muted))",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  chartWrapper: {
    width: "100%",
    flex: 1,
    minHeight: "240px",
  },
  tooltip: {
    padding: "12px 14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    borderRadius: "var(--radius-sm)",
  },
  tooltipLabel: {
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "hsl(var(--muted))",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};
