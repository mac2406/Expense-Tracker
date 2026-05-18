import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  notes?: string | null;
  isRecurring: boolean;
  recurrencePeriod?: string | null;
  receiptUrl?: string | null;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  amount: number;
  category: string;
  source: string;
  date: string;
  notes?: string | null;
  isRecurring: boolean;
  recurrencePeriod?: string | null;
}

export interface BudgetRecord {
  id: string;
  userId: string;
  limitAmount: number;
  category: string;
  period: string;
  startDate: string;
  endDate: string;
}

export interface SavingsGoalRecord {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface AppState {
  user: UserProfile | null;
  theme: "dark" | "light";
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  budgets: BudgetRecord[];
  savingsGoals: SavingsGoalRecord[];
  notifications: NotificationRecord[];
  
  // Base Authentication setters
  setUser: (user: UserProfile | null) => void;
  
  // Premium Theme Actions
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;

  // Mass data setters
  setExpenses: (expenses: ExpenseRecord[]) => void;
  setIncomes: (incomes: IncomeRecord[]) => void;
  setBudgets: (budgets: BudgetRecord[]) => void;
  setSavingsGoals: (savingsGoals: SavingsGoalRecord[]) => void;
  setNotifications: (notifications: NotificationRecord[]) => void;

  // Single transaction mutators (for instant client-side feedback)
  addExpense: (expense: ExpenseRecord) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updated: Partial<ExpenseRecord>) => void;

  addIncome: (income: IncomeRecord) => void;
  deleteIncome: (id: string) => void;
  updateIncome: (id: string, updated: Partial<IncomeRecord>) => void;

  addBudget: (budget: BudgetRecord) => void;
  deleteBudget: (id: string) => void;
  updateBudget: (id: string, updated: Partial<BudgetRecord>) => void;

  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Calculated getters (invoked reactively in React)
  getFinancialSummary: () => {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
  };
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  theme: "dark",
  expenses: [],
  incomes: [],
  budgets: [],
  savingsGoals: [],
  notifications: [],

  setUser: (user) => set({ user }),

  setTheme: (theme) => {
    set({ theme });
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
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    get().setTheme(nextTheme);
  },

  setExpenses: (expenses) => set({ expenses }),
  setIncomes: (incomes) => set({ incomes }),
  setBudgets: (budgets) => set({ budgets }),
  setSavingsGoals: (savingsGoals) => set({ savingsGoals }),
  setNotifications: (notifications) => set({ notifications }),

  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
  updateExpense: (id, updated) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    })),

  addIncome: (income) => set((state) => ({ incomes: [income, ...state.incomes] })),
  deleteIncome: (id) => set((state) => ({ incomes: state.incomes.filter((i) => i.id !== id) })),
  updateIncome: (id, updated) =>
    set((state) => ({
      incomes: state.incomes.map((i) => (i.id === id ? { ...i, ...updated } : i)),
    })),

  addBudget: (budget) => set((state) => ({ budgets: [budget, ...state.budgets] })),
  deleteBudget: (id) => set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) })),
  updateBudget: (id, updated) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  getFinancialSummary: () => {
    const { incomes, expenses } = get();

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
    };
  },
}));
