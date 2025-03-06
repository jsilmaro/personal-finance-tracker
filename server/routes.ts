import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTransactionSchema, insertSavingsGoalSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    next();
  };

  // Transactions routes
  app.get("/api/transactions", requireAuth, async (req, res, next) => {
    try {
      const transactions = await storage.getTransactions(req.user.id);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/transactions", requireAuth, async (req, res, next) => {
    try {
      const parsed = insertTransactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json(parsed.error);
      }

      const transaction = await storage.createTransaction(req.user.id, parsed.data);
      const amount = parsed.data.type === "INCOME" ? parsed.data.amount : -parsed.data.amount;
      const user = await storage.updateUserBalance(req.user.id, amount);

      res.status(201).json({ transaction, user });
    } catch (error) {
      next(error);
    }
  });

  // Savings goals routes
  app.get("/api/savings-goals", requireAuth, async (req, res, next) => {
    try {
      const goals = await storage.getSavingsGoals(req.user.id);
      res.json(goals);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/savings-goals", requireAuth, async (req, res, next) => {
    try {
      const parsed = insertSavingsGoalSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json(parsed.error);
      }

      const goal = await storage.createSavingsGoal(req.user.id, parsed.data);
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/savings-goals/:id", requireAuth, async (req, res, next) => {
    try {
      const amount = Number(req.body.amount);
      if (isNaN(amount)) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const goal = await storage.updateSavingsGoal(Number(req.params.id), amount);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}