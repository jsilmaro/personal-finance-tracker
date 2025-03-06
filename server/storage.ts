import { User, InsertUser, Transaction, InsertTransaction, SavingsGoal, InsertSavingsGoal } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Transaction methods
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(userId: number, transaction: InsertTransaction): Promise<Transaction>;
  updateUserBalance(userId: number, amount: number): Promise<User>;

  // Savings goals methods
  getSavingsGoals(userId: number): Promise<SavingsGoal[]>;
  createSavingsGoal(userId: number, goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(goalId: number, amount: number): Promise<SavingsGoal>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private savingsGoals: Map<number, SavingsGoal>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.savingsGoals = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, balance: 0 };
    this.users.set(id, user);
    return user;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.userId === userId
    );
  }

  async createTransaction(userId: number, transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      userId,
      date: new Date(),
      description: transaction.description || null
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateUserBalance(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      balance: user.balance + amount
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
    return Array.from(this.savingsGoals.values()).filter(
      (goal) => goal.userId === userId
    );
  }

  async createSavingsGoal(userId: number, goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const id = this.currentId++;
    const newGoal: SavingsGoal = {
      ...goal,
      id,
      userId,
      currentAmount: 0,
      completed: false
    };
    this.savingsGoals.set(id, newGoal);
    return newGoal;
  }

  async updateSavingsGoal(goalId: number, amount: number): Promise<SavingsGoal> {
    const goal = this.savingsGoals.get(goalId);
    if (!goal) throw new Error("Savings goal not found");

    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount,
      completed: goal.currentAmount + amount >= goal.targetAmount
    };
    this.savingsGoals.set(goalId, updatedGoal);
    return updatedGoal;
  }
}

export const storage = new MemStorage();