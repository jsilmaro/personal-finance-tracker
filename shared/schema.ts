import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0").notNull()
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["EXPENSE", "INCOME"] }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  description: text("description")
});

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  completed: boolean("completed").default(false).notNull()
});

// Create schemas with numeric validation
export const insertUserSchema = createInsertSchema(users, {
  balance: z.number().default(0)
}).pick({
  username: true,
  password: true
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: z.number().min(0)
}).omit({
  id: true,
  userId: true
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals, {
  targetAmount: z.number().min(0),
  currentAmount: z.number().default(0)
}).omit({
  id: true,
  userId: true,
  completed: true,
  currentAmount: true
});

// Export types with proper numeric typing
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: number;
  username: string;
  password: string;
  balance: number;
};
export type Transaction = {
  id: number;
  userId: number;
  type: "EXPENSE" | "INCOME";
  amount: number;
  category: string;
  date: Date;
  description: string | null;
};
export type SavingsGoal = {
  id: number;
  userId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  completed: boolean;
};
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;