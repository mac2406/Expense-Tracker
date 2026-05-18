"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function QuickAddTransaction() {
  const { addExpense, addIncome, budgets, setNotifications } = useStore();
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  
  // Form states
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethodOrSource, setPaymentMethodOrSource] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = {
    expense: ["Housing", "Groceries", "Transit", "Phone & Internet", "Entertainment & Dining", "Academic", "Miscellaneous"],
    income: ["Part-time Job", "Allowance", "Scholarship", "Cashback", "Refund", "Other"],
  };

  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Interac e-Transfer"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !paymentMethodOrSource) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
        notes,
      };

      if (txType === "expense") {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            paymentMethod: paymentMethodOrSource,
          }),
        });
        const resData = await response.json();

        if (!response.ok) throw new Error(resData.error || "Failed to record expense");

        // Add to Zustand client store immediately
        addExpense(resData.data);
        
        // Dynamic Budget warnings: Check if this category has budgets and exceeded limits
        const budget = budgets.find((b) => b.category.toLowerCase() === category.toLowerCase());
        if (budget) {
          // Re-fetch notifications to ensure warnings display in real-time
          const notifyRes = await fetch("/api/notifications");
          const notifyData = await notifyRes.json();
          setNotifications(notifyData.data || []);
        }

        setMessage("🎉 Expense recorded successfully!");
      } else {
        const response = await fetch("/api/income", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            source: paymentMethodOrSource,
          }),
        });
        const resData = await response.json();

        if (!response.ok) throw new Error(resData.error || "Failed to record income");

        // Add to Zustand client store immediately
        addIncome(resData.data);
        setMessage("🎉 Income recorded successfully!");
      }

      // Reset fields
      setAmount("");
      setCategory("");
      setPaymentMethodOrSource("");
      setNotes("");

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Quick Action</h3>
        <span style={styles.subTitle}>Record transaction instantly</span>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => {
            setTxType("expense");
            setCategory("");
            setPaymentMethodOrSource("");
            setMessage("");
          }}
          style={{
            ...styles.tabBtn,
            backgroundColor: txType === "expense" ? "rgba(244, 63, 94, 0.08)" : "transparent",
            borderColor: txType === "expense" ? "hsl(var(--destructive))" : "transparent",
            color: txType === "expense" ? "hsl(var(--destructive))" : "hsl(var(--muted))",
          }}
        >
          <ArrowDownLeft size={16} style={{ marginRight: "6px" }} />
          <span>Expense</span>
        </button>
        <button
          onClick={() => {
            setTxType("income");
            setCategory("");
            setPaymentMethodOrSource("");
            setMessage("");
          }}
          style={{
            ...styles.tabBtn,
            backgroundColor: txType === "income" ? "rgba(16, 185, 129, 0.08)" : "transparent",
            borderColor: txType === "income" ? "hsl(var(--success))" : "transparent",
            color: txType === "income" ? "hsl(var(--success))" : "hsl(var(--muted))",
          }}
        >
          <ArrowUpRight size={16} style={{ marginRight: "6px" }} />
          <span>Income</span>
        </button>
      </div>

      {message && <div style={styles.alert}>{message}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          {/* Amount input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount (CAD)</label>
            <input
              type="number"
              step="0.01"
              placeholder="$ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Category Select */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="form-input"
              style={styles.selectStyle}
            >
              <option value="" disabled>Select category</option>
              {categories[txType].map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "#1c1c24" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Source/Method input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              {txType === "expense" ? "Payment Method" : "Source / Employer"}
            </label>
            {txType === "expense" ? (
              <select
                value={paymentMethodOrSource}
                onChange={(e) => setPaymentMethodOrSource(e.target.value)}
                required
                className="form-input"
                style={styles.selectStyle}
              >
                <option value="" disabled>Select method</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m} style={{ backgroundColor: "#1c1c24" }}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. Cafe Job, Simplii, UofT"
                value={paymentMethodOrSource}
                onChange={(e) => setPaymentMethodOrSource(e.target.value)}
                required
                className="form-input"
              />
            )}
          </div>

          {/* Notes input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Optional Notes</label>
            <input
              type="text"
              placeholder="e.g. weekly groceries at NoFrills"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            backgroundColor: txType === "expense" ? "hsl(var(--primary))" : "hsl(var(--success))",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <div style={styles.spinner} />
          ) : (
            <>
              <Plus size={18} style={{ marginRight: "6px" }} />
              <span>Record {txType === "expense" ? "Expense" : "Income"}</span>
            </>
          )}
        </button>
      </form>
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
  tabs: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  tabBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: "10px",
    border: "1px solid transparent",
    fontSize: "0.88rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  alert: {
    fontSize: "0.88rem",
    textAlign: "center",
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "hsl(var(--muted))",
  },
  selectStyle: {
    appearance: "none",
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    color: "#fff",
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.92rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "pulse 1s linear infinite",
  },
};
