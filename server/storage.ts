import {
  users,
  workoutPlans,
  workoutSessions,
  mealPlans,
  userMealLogs,
  progressEntries,
  achievements,
  userAchievements,
  motivationQuotes,
  brandConfig,
  type User,
  type UpsertUser,
  type WorkoutPlan,
  type WorkoutSession,
  type MealPlan,
  type UserMealLog,
  type ProgressEntry,
  type Achievement,
  type UserAchievement,
  type MotivationQuote,
  type BrandConfig,
  type InsertWorkoutPlan,
  type InsertWorkoutSession,
  type InsertMealPlan,
  type InsertUserMealLog,
  type InsertProgressEntry,
  type InsertAchievement,
  type InsertMotivationQuote,
  type InsertBrandConfig,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workout Plans
  getWorkoutPlans(): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan>;
  deleteWorkoutPlan(id: number): Promise<void>;
  
  // Workout Sessions
  getUserWorkoutSessions(userId: string): Promise<WorkoutSession[]>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession>;
  completeWorkoutSession(id: number): Promise<WorkoutSession>;
  
  // Meal Plans
  getMealPlans(): Promise<MealPlan[]>;
  getMealPlansByGoalAndBudget(goal: string, budget: string): Promise<MealPlan[]>;
  createMealPlan(plan: InsertMealPlan): Promise<MealPlan>;
  
  // User Meal Logs
  getUserMealLogs(userId: string, date?: string): Promise<UserMealLog[]>;
  createUserMealLog(log: InsertUserMealLog): Promise<UserMealLog>;
  updateUserMealLog(id: number, log: Partial<InsertUserMealLog>): Promise<UserMealLog>;
  
  // Progress Tracking
  getUserProgressEntries(userId: string): Promise<ProgressEntry[]>;
  createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  
  // Motivation Quotes
  getRandomMotivationQuote(): Promise<MotivationQuote | undefined>;
  getMotivationQuotes(): Promise<MotivationQuote[]>;
  createMotivationQuote(quote: InsertMotivationQuote): Promise<MotivationQuote>;
  
  // Brand Configuration
  getBrandConfig(clientId: string): Promise<BrandConfig | undefined>;
  createBrandConfig(config: InsertBrandConfig): Promise<BrandConfig>;
  updateBrandConfig(clientId: string, config: Partial<InsertBrandConfig>): Promise<BrandConfig>;
  
  // Gamification
  updateUserPoints(userId: string, points: number): Promise<User>;
  updateUserStreak(userId: string, currentStreak: number, longestStreak: number): Promise<User>;
  
  // Admin
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workout Plans
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return await db.select().from(workoutPlans).orderBy(desc(workoutPlans.createdAt));
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    const [plan] = await db.select().from(workoutPlans).where(eq(workoutPlans.id, id));
    return plan;
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const [newPlan] = await db.insert(workoutPlans).values(plan).returning();
    return newPlan;
  }

  async updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan> {
    const [updatedPlan] = await db
      .update(workoutPlans)
      .set(plan)
      .where(eq(workoutPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<void> {
    await db.delete(workoutPlans).where(eq(workoutPlans.id, id));
  }

  // Workout Sessions
  async getUserWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    return await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.createdAt));
  }

  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const [newSession] = await db.insert(workoutSessions).values(session).returning();
    return newSession;
  }

  async updateWorkoutSession(id: number, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession> {
    const [updatedSession] = await db
      .update(workoutSessions)
      .set(session)
      .where(eq(workoutSessions.id, id))
      .returning();
    return updatedSession;
  }

  async completeWorkoutSession(id: number): Promise<WorkoutSession> {
    const [completedSession] = await db
      .update(workoutSessions)
      .set({ 
        completed: true, 
        completedAt: new Date() 
      })
      .where(eq(workoutSessions.id, id))
      .returning();
    return completedSession;
  }

  // Meal Plans
  async getMealPlans(): Promise<MealPlan[]> {
    return await db.select().from(mealPlans).orderBy(desc(mealPlans.createdAt));
  }

  async getMealPlansByGoalAndBudget(goal: string, budget: string): Promise<MealPlan[]> {
    return await db
      .select()
      .from(mealPlans)
      .where(and(eq(mealPlans.goal, goal as any), eq(mealPlans.budget, budget as any)))
      .orderBy(desc(mealPlans.createdAt));
  }

  async createMealPlan(plan: InsertMealPlan): Promise<MealPlan> {
    const [newPlan] = await db.insert(mealPlans).values(plan).returning();
    return newPlan;
  }

  // User Meal Logs
  async getUserMealLogs(userId: string, date?: string): Promise<UserMealLog[]> {
    if (date) {
      return await db
        .select()
        .from(userMealLogs)
        .where(and(eq(userMealLogs.userId, userId), eq(userMealLogs.logDate, date)))
        .orderBy(desc(userMealLogs.createdAt));
    }
    
    return await db
      .select()
      .from(userMealLogs)
      .where(eq(userMealLogs.userId, userId))
      .orderBy(desc(userMealLogs.createdAt));
  }

  async createUserMealLog(log: InsertUserMealLog): Promise<UserMealLog> {
    const [newLog] = await db.insert(userMealLogs).values(log).returning();
    return newLog;
  }

  async updateUserMealLog(id: number, log: Partial<InsertUserMealLog>): Promise<UserMealLog> {
    const [updatedLog] = await db
      .update(userMealLogs)
      .set(log)
      .where(eq(userMealLogs.id, id))
      .returning();
    return updatedLog;
  }

  // Progress Tracking
  async getUserProgressEntries(userId: string): Promise<ProgressEntry[]> {
    return await db
      .select()
      .from(progressEntries)
      .where(eq(progressEntries.userId, userId))
      .orderBy(desc(progressEntries.entryDate));
  }

  async createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry> {
    const [newEntry] = await db.insert(progressEntries).values(entry).returning();
    return newEntry;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(desc(achievements.createdAt));
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return userAchievement;
  }

  // Motivation Quotes
  async getRandomMotivationQuote(): Promise<MotivationQuote | undefined> {
    const [quote] = await db
      .select()
      .from(motivationQuotes)
      .where(eq(motivationQuotes.isActive, true))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return quote;
  }

  async getMotivationQuotes(): Promise<MotivationQuote[]> {
    return await db.select().from(motivationQuotes).orderBy(desc(motivationQuotes.createdAt));
  }

  async createMotivationQuote(quote: InsertMotivationQuote): Promise<MotivationQuote> {
    const [newQuote] = await db.insert(motivationQuotes).values(quote).returning();
    return newQuote;
  }

  // Brand Configuration
  async getBrandConfig(clientId: string): Promise<BrandConfig | undefined> {
    const [config] = await db
      .select()
      .from(brandConfig)
      .where(and(eq(brandConfig.clientId, clientId), eq(brandConfig.isActive, true)));
    return config;
  }

  async createBrandConfig(config: InsertBrandConfig): Promise<BrandConfig> {
    const [newConfig] = await db.insert(brandConfig).values(config).returning();
    return newConfig;
  }

  async updateBrandConfig(clientId: string, config: Partial<InsertBrandConfig>): Promise<BrandConfig> {
    const [updatedConfig] = await db
      .update(brandConfig)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(brandConfig.clientId, clientId))
      .returning();
    return updatedConfig;
  }

  // Gamification
  async updateUserPoints(userId: string, points: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        points: sql`${users.points} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStreak(userId: string, currentStreak: number, longestStreak: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        currentStreak, 
        longestStreak: sql`GREATEST(${users.longestStreak}, ${longestStreak})`,
        lastWorkoutDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Admin
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const activeUsers = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(gte(users.lastWorkoutDate, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]));
    
    return {
      totalUsers: totalUsers[0].count,
      activeUsers: activeUsers[0].count,
      // Add more stats as needed
    };
  }
}

export const storage = new DatabaseStorage();
