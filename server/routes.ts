import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTransactionSchema, insertSavingsGoalSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactions(req.user.id);
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const transaction = await storage.createTransaction(req.user.id, parsed.data);
    const amount = parsed.data.type === "INCOME" ? parsed.data.amount : -parsed.data.amount;
    const user = await storage.updateUserBalance(req.user.id, amount);
    
    res.status(201).json({ transaction, user });
  });

  // Savings goals routes
  app.get("/api/savings-goals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const goals = await storage.getSavingsGoals(req.user.id);
    res.json(goals);
  });

  app.post("/api/savings-goals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertSavingsGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const goal = await storage.createSavingsGoal(req.user.id, parsed.data);
    res.status(201).json(goal);
  });

  app.patch("/api/savings-goals/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const amount = Number(req.body.amount);
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const goal = await storage.updateSavingsGoal(Number(req.params.id), amount);
    res.json(goal);
  });

  const httpServer = createServer(app);
  return httpServer;
}
