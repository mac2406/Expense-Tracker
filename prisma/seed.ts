import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing data (safe cascade deletes will handle relations, but let's clear explicitly)
  await db.notification.deleteMany();
  await db.savingsGoal.deleteMany();
  await db.budget.deleteMany();
  await db.income.deleteMany();
  await db.expense.deleteMany();
  await db.user.deleteMany();

  console.log("🗑️  Cleaned existing database records.");

  // 2. Create Demo User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await db.user.create({
    data: {
      email: "demo@example.ca",
      name: "Alex Chen",
      passwordHash: hashedPassword,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
    },
  });

  console.log(`👤 Demo User created: ${user.email}`);

  // 3. Create Canada-focused Budgets
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const budgets = await db.budget.createMany({
    data: [
      {
        userId: user.id,
        limitAmount: 1400.0,
        category: "Housing",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      {
        userId: user.id,
        limitAmount: 450.0,
        category: "Groceries",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      {
        userId: user.id,
        limitAmount: 156.0,
        category: "Transit", // TTC Metropass price range
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      {
        userId: user.id,
        limitAmount: 80.0,
        category: "Phone & Internet",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      {
        userId: user.id,
        limitAmount: 200.0,
        category: "Entertainment & Dining",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      {
        userId: user.id,
        limitAmount: 300.0,
        category: "Academic",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
    ],
  });

  console.log(`📊 Budgets seeded: ${budgets.count} categories`);

  // 4. Create Income Records (TA Salary, Part-time job, Scholarship)
  const incomes = await db.income.createMany({
    data: [
      {
        userId: user.id,
        amount: 1500.00,
        category: "Part-time Job",
        source: "UBC TA stipend",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        isRecurring: true,
        recurrencePeriod: "Monthly",
        notes: "Monthly Teaching Assistant salary from university department.",
      },
      {
        userId: user.id,
        amount: 850.00,
        category: "Part-time Job",
        source: "Local Cafe Barista",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        isRecurring: true,
        recurrencePeriod: "Bi-weekly",
        notes: "Part-time weekend shifts.",
      },
      {
        userId: user.id,
        amount: 1000.00,
        category: "Scholarship",
        source: "Mitacs Global Link Award",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        isRecurring: false,
        notes: "International student entry scholarship payout.",
      },
      {
        userId: user.id,
        amount: 25.50,
        category: "Cashback",
        source: "Simplii Visa Cashback",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 28),
        isRecurring: false,
        notes: "Quarterly credit card reward points redeemed.",
      },
    ],
  });

  console.log(`💰 Income records seeded: ${incomes.count}`);

  // 5. Create Realistic Canadian Expense Records
  const expenses = await db.expense.createMany({
    data: [
      // Rent / Housing
      {
        userId: user.id,
        amount: 1250.00,
        category: "Housing",
        paymentMethod: "Interac e-Transfer",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        notes: "Monthly student shared apartment rent (Downtown Vancouver/Toronto).",
        isRecurring: true,
        recurrencePeriod: "Monthly",
      },
      // TTC / Transit
      {
        userId: user.id,
        amount: 156.00,
        category: "Transit",
        paymentMethod: "Debit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        notes: "Monthly Public Transit Metropass pass autoload.",
        isRecurring: true,
        recurrencePeriod: "Monthly",
      },
      // Phone
      {
        userId: user.id,
        amount: 65.00,
        category: "Phone & Internet",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        notes: "Fido BYOP monthly cellular plan (20GB 5G).",
        isRecurring: true,
        recurrencePeriod: "Monthly",
      },
      // Groceries - Loblaws / NoFrills / T&T
      {
        userId: user.id,
        amount: 142.30,
        category: "Groceries",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        notes: "Weekly groceries at NoFrills (buying President's Choice brand).",
        isRecurring: false,
      },
      {
        userId: user.id,
        amount: 98.45,
        category: "Groceries",
        paymentMethod: "Debit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
        notes: "Asian ingredients at T&T Supermarket.",
        isRecurring: false,
      },
      {
        userId: user.id,
        amount: 120.10,
        category: "Groceries",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
        notes: "Bulk items and household supplies from Costco.",
        isRecurring: false,
      },
      // Entertainment / Coffee / Fast food
      {
        userId: user.id,
        amount: 4.85,
        category: "Entertainment & Dining",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
        notes: "Morning coffee & French Vanilla at Tim Hortons.",
        isRecurring: false,
      },
      {
        userId: user.id,
        amount: 45.20,
        category: "Entertainment & Dining",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        notes: "Dinner with roommates at local Pub (Poutine & wings).",
        isRecurring: false,
      },
      {
        userId: user.id,
        amount: 15.99,
        category: "Entertainment & Dining",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        notes: "Netflix Premium monthly subscription.",
        isRecurring: true,
        recurrencePeriod: "Monthly",
      },
      // Academic
      {
        userId: user.id,
        amount: 185.00,
        category: "Academic",
        paymentMethod: "Debit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
        notes: "University bookstore - Calculus & Linear Algebra textbooks.",
        isRecurring: false,
      },
      // Miscellaneous / Clothing
      {
        userId: user.id,
        amount: 150.00,
        category: "Miscellaneous",
        paymentMethod: "Credit Card",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        notes: "Warm winter jacket from Columbia Sportswear (essential for winter!).",
        isRecurring: false,
      },
    ],
  });

  console.log(`💸 Expense records seeded: ${expenses.count}`);

  // 6. Create Savings Goals
  const savingsGoals = await db.savingsGoal.createMany({
    data: [
      {
        userId: user.id,
        name: "Emergency Fund (CAD)",
        targetAmount: 5000.00,
        currentAmount: 1850.00,
        targetDate: new Date(currentDate.getFullYear() + 1, 0, 1), // 1 Year target
      },
      {
        userId: user.id,
        name: "Winter Gear & Boots",
        targetAmount: 600.00,
        currentAmount: 400.00,
        targetDate: new Date(currentDate.getFullYear(), 9, 31), // October target
      },
      {
        userId: user.id,
        name: "Laptop Upgrade",
        targetAmount: 1500.00,
        currentAmount: 650.00,
        targetDate: new Date(currentDate.getFullYear(), 11, 31), // Year-end
      },
    ],
  });

  console.log(`🏦 Savings Goals seeded: ${savingsGoals.count}`);

  // 7. Create Seed Notifications
  const notifications = await db.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "SYSTEM",
        message: "🇨🇦 Welcome to Canada, Alex! Your premium student finance dashboard is fully set up.",
        isRead: false,
      },
      {
        userId: user.id,
        type: "BUDGET_WARNING",
        message: "⚠️ Warning: Your transit budget has reached 100% after buying your TTC pass.",
        isRead: false,
      },
      {
        userId: user.id,
        type: "SAVINGS_MILESTONE",
        message: "🎉 Success! You are 66% towards your Winter Gear savings goal.",
        isRead: true,
      },
    ],
  });

  console.log(`🔔 Notifications seeded: ${notifications.count}`);
  console.log("🏁 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Note: Database driver connections will be closed implicitly or we can ignore in CLI
  });
