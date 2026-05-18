"use client";

import React from "react";
import { formatCAD } from "@/lib/currency";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  type: "primary" | "success" | "warning" | "destructive";
  icon: LucideIcon;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  type,
  icon: Icon,
}: MetricCardProps) {
  // Define visual colors based on status type
  const themeColors = {
    primary: {
      glow: "rgba(99, 102, 241, 0.08)",
      border: "rgba(99, 102, 241, 0.25)",
      text: "hsl(var(--primary))",
    },
    success: {
      glow: "rgba(16, 185, 129, 0.08)",
      border: "rgba(16, 185, 129, 0.25)",
      text: "hsl(var(--success))",
    },
    warning: {
      glow: "rgba(245, 158, 11, 0.08)",
      border: "rgba(245, 158, 11, 0.25)",
      text: "hsl(var(--warning))",
    },
    destructive: {
      glow: "rgba(244, 63, 94, 0.08)",
      border: "rgba(244, 63, 94, 0.25)",
      text: "hsl(var(--destructive))",
    },
  };

  const colors = themeColors[type] || themeColors.primary;

  return (
    <div className="glass-panel glass-panel-hover" style={styles.card}>
      <div style={styles.cardHeader} className="flex-between">
        <span style={styles.titleText}>{title}</span>
        <div
          style={{
            ...styles.iconWrapper,
            backgroundColor: colors.glow,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div style={styles.cardBody}>
        <h2 style={styles.valueText}>{formatCAD(value)}</h2>

        {(subtitle || trend) && (
          <div style={styles.footer} className="flex-between">
            {subtitle && <span style={styles.subtitleText}>{subtitle}</span>}
            {trend && (
              <span
                style={{
                  ...styles.trendBadge,
                  color: trend.isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))",
                  backgroundColor: trend.isPositive ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                }}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: 1,
    minWidth: "240px",
  },
  cardHeader: {
    width: "100%",
  },
  titleText: {
    fontSize: "0.88rem",
    fontWeight: "600",
    color: "hsl(var(--muted))",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  iconWrapper: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  valueText: {
    fontSize: "1.85rem",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: "hsl(var(--foreground))",
  },
  footer: {
    marginTop: "4px",
    fontSize: "0.82rem",
    width: "100%",
  },
  subtitleText: {
    color: "hsl(var(--muted-foreground))",
  },
  trendBadge: {
    fontSize: "0.75rem",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "6px",
  },
};
