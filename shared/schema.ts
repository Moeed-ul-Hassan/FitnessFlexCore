import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  points: integer("points").default(0),
  level: integer("level").default(1),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastWorkoutDate: date("last_workout_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workout Plans
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  duration: integer("duration").notNull(), // in weeks
  workoutsPerWeek: integer("workouts_per_week").notNull(),
  isPreMade: boolean("is_pre_made").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workout Sessions
export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  workoutPlanId: integer("workout_plan_id").references(() => workoutPlans.id),
  name: text("name").notNull(),
  muscleGroups: text("muscle_groups").array().notNull(),
  exercises: jsonb("exercises").notNull(), // Array of exercise objects
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  scheduledDate: date("scheduled_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meal Plans
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  goal: varchar("goal", { enum: ["weight_loss", "muscle_gain", "maintenance"] }).notNull(),
  budget: varchar("budget", { enum: ["low", "medium", "high"] }).notNull(),
  meals: jsonb("meals").notNull(), // Array of meal objects
  totalCalories: integer("total_calories"),
  totalProtein: decimal("total_protein", { precision: 5, scale: 2 }),
  totalCarbs: decimal("total_carbs", { precision: 5, scale: 2 }),
  totalFats: decimal("total_fats", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Meal Logs
export const userMealLogs = pgTable("user_meal_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mealPlanId: integer("meal_plan_id").references(() => mealPlans.id),
  mealType: varchar("meal_type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
  consumed: boolean("consumed").default(false),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress Tracking
export const progressEntries = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  height: decimal("height", { precision: 5, scale: 2 }),
  bodyFat: decimal("body_fat", { precision: 5, scale: 2 }),
  muscleMass: decimal("muscle_mass", { precision: 5, scale: 2 }),
  bmi: decimal("bmi", { precision: 5, scale: 2 }),
  notes: text("notes"),
  entryDate: date("entry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: varchar("type", { enum: ["streak", "workout", "progress", "consistency", "special"] }).notNull(),
  requirement: jsonb("requirement").notNull(), // Conditions to unlock
  points: integer("points").default(100),
  rarity: varchar("rarity", { enum: ["common", "rare", "epic", "legendary"] }).default("common"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Motivation Quotes
export const motivationQuotes = pgTable("motivation_quotes", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  category: varchar("category", { enum: ["general", "workout", "nutrition", "mindset"] }).default("general"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Brand Configuration (White-label)
export const brandConfig = pgTable("brand_config", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull().unique(),
  brandName: text("brand_name").notNull(),
  primaryColor: varchar("primary_color").default("#10b981"),
  secondaryColor: varchar("secondary_color").default("#60a5fa"),
  accentColor: varchar("accent_color").default("#8b5cf6"),
  logoUrl: text("logo_url"),
  backgroundUrl: text("background_url"),
  customCss: text("custom_css"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workoutSessions: many(workoutSessions),
  mealLogs: many(userMealLogs),
  progressEntries: many(progressEntries),
  achievements: many(userAchievements),
}));

export const workoutPlansRelations = relations(workoutPlans, ({ many }) => ({
  sessions: many(workoutSessions),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  workoutPlan: one(workoutPlans, {
    fields: [workoutSessions.workoutPlanId],
    references: [workoutPlans.id],
  }),
}));

export const mealPlansRelations = relations(mealPlans, ({ many }) => ({
  userLogs: many(userMealLogs),
}));

export const userMealLogsRelations = relations(userMealLogs, ({ one }) => ({
  user: one(users, {
    fields: [userMealLogs.userId],
    references: [users.id],
  }),
  mealPlan: one(mealPlans, {
    fields: [userMealLogs.mealPlanId],
    references: [mealPlans.id],
  }),
}));

export const progressEntriesRelations = relations(progressEntries, ({ one }) => ({
  user: one(users, {
    fields: [progressEntries.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type MealPlan = typeof mealPlans.$inferSelect;
export type UserMealLog = typeof userMealLogs.$inferSelect;
export type ProgressEntry = typeof progressEntries.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type MotivationQuote = typeof motivationQuotes.$inferSelect;
export type BrandConfig = typeof brandConfig.$inferSelect;

// Insert schemas
export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans);
export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions);
export const insertMealPlanSchema = createInsertSchema(mealPlans);
export const insertUserMealLogSchema = createInsertSchema(userMealLogs);
export const insertProgressEntrySchema = createInsertSchema(progressEntries);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertMotivationQuoteSchema = createInsertSchema(motivationQuotes);
export const insertBrandConfigSchema = createInsertSchema(brandConfig);

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type InsertUserMealLog = z.infer<typeof insertUserMealLogSchema>;
export type InsertProgressEntry = z.infer<typeof insertProgressEntrySchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertMotivationQuote = z.infer<typeof insertMotivationQuoteSchema>;
export type InsertBrandConfig = z.infer<typeof insertBrandConfigSchema>;
