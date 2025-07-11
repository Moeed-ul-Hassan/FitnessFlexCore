export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'workout' | 'streak' | 'progress' | 'consistency' | 'special';
  requirement: {
    type: string;
    value: number;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  perks: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🏋️',
    type: 'workout',
    requirement: { type: 'workouts_completed', value: 1 },
    points: 50,
    rarity: 'common'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    type: 'streak',
    requirement: { type: 'current_streak', value: 7 },
    points: 100,
    rarity: 'rare'
  },
  {
    id: 'streak-30',
    name: 'Month Master',
    description: 'Maintain a 30-day workout streak',
    icon: '⭐',
    type: 'streak',
    requirement: { type: 'current_streak', value: 30 },
    points: 300,
    rarity: 'epic'
  },
  {
    id: 'weight-loss-5kg',
    name: 'First 5KG Lost',
    description: 'Lose your first 5 kilograms',
    icon: '⚖️',
    type: 'progress',
    requirement: { type: 'weight_loss', value: 5 },
    points: 200,
    rarity: 'rare'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Work out 5 days a week for 4 weeks',
    icon: '👑',
    type: 'consistency',
    requirement: { type: 'weekly_consistency', value: 4 },
    points: 250,
    rarity: 'epic'
  },
  {
    id: 'level-10',
    name: 'Double Digits',
    description: 'Reach level 10',
    icon: '🎯',
    type: 'special',
    requirement: { type: 'level', value: 10 },
    points: 500,
    rarity: 'legendary'
  }
];

export const USER_LEVELS: UserLevel[] = [
  { level: 1, title: 'Beginner', minPoints: 0, maxPoints: 499, perks: ['Basic tracking'] },
  { level: 2, title: 'Beginner', minPoints: 500, maxPoints: 999, perks: ['Basic tracking', 'Workout templates'] },
  { level: 3, title: 'Intermediate', minPoints: 1000, maxPoints: 1999, perks: ['Basic tracking', 'Workout templates', 'Progress charts'] },
  { level: 4, title: 'Intermediate', minPoints: 2000, maxPoints: 2999, perks: ['Basic tracking', 'Workout templates', 'Progress charts', 'Meal planning'] },
  { level: 5, title: 'Intermediate', minPoints: 3000, maxPoints: 3999, perks: ['Basic tracking', 'Workout templates', 'Progress charts', 'Meal planning', 'Advanced analytics'] },
  { level: 6, title: 'Advanced', minPoints: 4000, maxPoints: 4999, perks: ['All previous perks', 'Custom workouts'] },
  { level: 7, title: 'Advanced', minPoints: 5000, maxPoints: 5999, perks: ['All previous perks', 'Custom workouts', 'Achievement badges'] },
  { level: 8, title: 'Advanced', minPoints: 6000, maxPoints: 6999, perks: ['All previous perks', 'Custom workouts', 'Achievement badges', 'PDF reports'] },
  { level: 9, title: 'Advanced', minPoints: 7000, maxPoints: 7999, perks: ['All previous perks', 'Custom workouts', 'Achievement badges', 'PDF reports', 'Priority support'] },
  { level: 10, title: 'Expert', minPoints: 8000, maxPoints: 9999, perks: ['All previous perks', 'Exclusive content'] },
  { level: 15, title: 'Master', minPoints: 12000, maxPoints: 14999, perks: ['All previous perks', 'Beta features'] },
  { level: 20, title: 'Beast Mode', minPoints: 20000, maxPoints: Infinity, perks: ['All previous perks', 'VIP status'] }
];

export function calculateLevel(points: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (points >= USER_LEVELS[i].minPoints) {
      return USER_LEVELS[i];
    }
  }
  return USER_LEVELS[0];
}

export function calculatePointsForAction(action: string): number {
  const pointsMap: { [key: string]: number } = {
    'complete_workout': 50,
    'log_meal': 25,
    'add_progress': 30,
    'achieve_streak_7': 100,
    'achieve_streak_30': 300,
    'first_workout': 50,
    'weight_milestone': 200,
    'consistency_bonus': 150,
  };
  
  return pointsMap[action] || 0;
}

export function checkAchievements(userStats: any): Achievement[] {
  const unlockedAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (isAchievementUnlocked(achievement, userStats)) {
      unlockedAchievements.push(achievement);
    }
  }
  
  return unlockedAchievements;
}

function isAchievementUnlocked(achievement: Achievement, userStats: any): boolean {
  const { requirement } = achievement;
  
  switch (requirement.type) {
    case 'workouts_completed':
      return userStats.workoutsCompleted >= requirement.value;
    case 'current_streak':
      return userStats.currentStreak >= requirement.value;
    case 'weight_loss':
      return userStats.weightLoss >= requirement.value;
    case 'level':
      return userStats.level >= requirement.value;
    case 'weekly_consistency':
      return userStats.weeklyConsistency >= requirement.value;
    default:
      return false;
  }
}

export function getNextMilestone(currentPoints: number): { level: number; pointsNeeded: number } {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevel = USER_LEVELS.find(level => level.level > currentLevel.level);
  
  if (nextLevel) {
    return {
      level: nextLevel.level,
      pointsNeeded: nextLevel.minPoints - currentPoints
    };
  }
  
  return {
    level: currentLevel.level,
    pointsNeeded: 0
  };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  return 1.0;
}

export function calculateBonusPoints(basePoints: number, userStats: any): number {
  const streakMultiplier = getStreakMultiplier(userStats.currentStreak || 0);
  const levelBonus = Math.floor((userStats.level || 1) * 0.1);
  
  return Math.floor(basePoints * streakMultiplier * (1 + levelBonus));
}
