import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertWorkoutPlanSchema,
  insertWorkoutSessionSchema,
  insertMealPlanSchema,
  insertUserMealLogSchema,
  insertProgressEntrySchema,
  insertAchievementSchema,
  insertMotivationQuoteSchema,
  insertBrandConfigSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workout Plans
  app.get('/api/workout-plans', isAuthenticated, async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.get('/api/workout-plans/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      res.status(500).json({ message: "Failed to fetch workout plan" });
    }
  });

  app.post('/api/workout-plans', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertWorkoutPlanSchema.parse(req.body);
      const plan = await storage.createWorkoutPlan(validatedData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating workout plan:", error);
      res.status(500).json({ message: "Failed to create workout plan" });
    }
  });

  // Workout Sessions
  app.get('/api/workout-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserWorkoutSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching workout sessions:", error);
      res.status(500).json({ message: "Failed to fetch workout sessions" });
    }
  });

  app.post('/api/workout-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertWorkoutSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createWorkoutSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating workout session:", error);
      res.status(500).json({ message: "Failed to create workout session" });
    }
  });

  app.patch('/api/workout-sessions/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const session = await storage.completeWorkoutSession(id);
      
      // Update user streak and points
      const user = await storage.getUser(userId);
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const lastWorkout = user.lastWorkoutDate;
        
        let newStreak = 1;
        if (lastWorkout) {
          const lastWorkoutDate = new Date(lastWorkout);
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          if (lastWorkoutDate.toISOString().split('T')[0] === yesterday) {
            newStreak = (user.currentStreak || 0) + 1;
          }
        }
        
        await storage.updateUserStreak(userId, newStreak, Math.max(newStreak, user.longestStreak || 0));
        await storage.updateUserPoints(userId, 50); // 50 points for completing workout
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error completing workout session:", error);
      res.status(500).json({ message: "Failed to complete workout session" });
    }
  });

  // Meal Plans
  app.get('/api/meal-plans', isAuthenticated, async (req, res) => {
    try {
      const { goal, budget } = req.query;
      let plans;
      
      if (goal && budget) {
        plans = await storage.getMealPlansByGoalAndBudget(goal as string, budget as string);
      } else {
        plans = await storage.getMealPlans();
      }
      
      res.json(plans);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  app.post('/api/meal-plans', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMealPlanSchema.parse(req.body);
      const plan = await storage.createMealPlan(validatedData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating meal plan:", error);
      res.status(500).json({ message: "Failed to create meal plan" });
    }
  });

  // User Meal Logs
  app.get('/api/meal-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      const logs = await storage.getUserMealLogs(userId, date as string);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching meal logs:", error);
      res.status(500).json({ message: "Failed to fetch meal logs" });
    }
  });

  app.post('/api/meal-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserMealLogSchema.parse({ ...req.body, userId });
      const log = await storage.createUserMealLog(validatedData);
      res.json(log);
    } catch (error) {
      console.error("Error creating meal log:", error);
      res.status(500).json({ message: "Failed to create meal log" });
    }
  });

  // Progress Tracking
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserProgressEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching progress entries:", error);
      res.status(500).json({ message: "Failed to fetch progress entries" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProgressEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createProgressEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating progress entry:", error);
      res.status(500).json({ message: "Failed to create progress entry" });
    }
  });

  // Achievements
  app.get('/api/achievements', isAuthenticated, async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user-achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      console.error("Error creating achievement:", error);
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  // Motivation Quotes
  app.get('/api/motivation-quote', isAuthenticated, async (req, res) => {
    try {
      const quote = await storage.getRandomMotivationQuote();
      res.json(quote);
    } catch (error) {
      console.error("Error fetching motivation quote:", error);
      res.status(500).json({ message: "Failed to fetch motivation quote" });
    }
  });

  app.get('/api/motivation-quotes', isAuthenticated, async (req, res) => {
    try {
      const quotes = await storage.getMotivationQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching motivation quotes:", error);
      res.status(500).json({ message: "Failed to fetch motivation quotes" });
    }
  });

  app.post('/api/motivation-quotes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const validatedData = insertMotivationQuoteSchema.parse(req.body);
      const quote = await storage.createMotivationQuote(validatedData);
      res.json(quote);
    } catch (error) {
      console.error("Error creating motivation quote:", error);
      res.status(500).json({ message: "Failed to create motivation quote" });
    }
  });

  // Brand Configuration
  app.get('/api/brand-config/:clientId', async (req, res) => {
    try {
      const { clientId } = req.params;
      const config = await storage.getBrandConfig(clientId);
      res.json(config);
    } catch (error) {
      console.error("Error fetching brand config:", error);
      res.status(500).json({ message: "Failed to fetch brand config" });
    }
  });

  app.post('/api/brand-config', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const validatedData = insertBrandConfigSchema.parse(req.body);
      const config = await storage.createBrandConfig(validatedData);
      res.json(config);
    } catch (error) {
      console.error("Error creating brand config:", error);
      res.status(500).json({ message: "Failed to create brand config" });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
