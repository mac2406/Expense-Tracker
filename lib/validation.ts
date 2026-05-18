import { z } from "zod";

// User Registration Validation Schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email format. Must be a valid email address (e.g. name@domain.ca)."),
  name: z.string().min(2, "Name must be at least 2 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

// User Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});

// Expense Transaction Validation Schema
export const expenseSchema = z.object({
  amount: z.number().positive("Expense amount must be greater than 0."),
  category: z.string().min(1, "Category is required."),
  paymentMethod: z.string().min(1, "Payment method is required."),
  date: z.string().transform((val) => new Date(val)),
  notes: z.string().optional().nullable(),
  isRecurring: z.boolean().default(false),
  recurrencePeriod: z.string().optional().nullable(),
  receiptUrl: z.string().optional().nullable(),
});

// Income Transaction Validation Schema
export const incomeSchema = z.object({
  amount: z.number().positive("Income amount must be greater than 0."),
  category: z.string().min(1, "Category is required."),
  source: z.string().min(1, "Source / Employer is required."),
  date: z.string().transform((val) => new Date(val)),
  notes: z.string().optional().nullable(),
  isRecurring: z.boolean().default(false),
  recurrencePeriod: z.string().optional().nullable(),
});

// Budget Configuration Validation Schema
export const budgetSchema = z.object({
  limitAmount: z.number().positive("Budget limit must be greater than 0."),
  category: z.string().min(1, "Category is required."),
  period: z.string().default("Monthly"),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});

// Savings Goal Validation Schema
export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required."),
  targetAmount: z.number().positive("Target savings amount must be greater than 0."),
  currentAmount: z.number().nonnegative("Current savings cannot be negative.").default(0),
  targetDate: z.string().transform((val) => new Date(val)),
});
