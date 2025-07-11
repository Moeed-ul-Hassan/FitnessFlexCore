import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Crown, 
  Flame, 
  Trophy, 
  Dumbbell, 
  Apple,
  Calendar,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AchievementBadge from "@/components/AchievementBadge";
import StreakTracker from "@/components/StreakTracker";
import GamificationSystem from "@/components/GamificationSystem";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: motivationQuote } = useQuery({
    queryKey: ["/api/motivation-quote"],
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/user-achievements"],
  });

  const { data: todayWorkouts } = useQuery({
    queryKey: ["/api/workout-sessions"],
  });

  const { data: todayMeals } = useQuery({
    queryKey: ["/api/meal-logs"],
  });

  const { data: progressEntries } = useQuery({
    queryKey: ["/api/progress"],
  });

  const todayDate = new Date().toISOString().split('T')[0];
  const todayWorkout = todayWorkouts?.find((w: any) => 
    w.scheduledDate === todayDate && !w.completed
  );

  const todayMealLogs = todayMeals?.filter((m: any) => 
    m.logDate === todayDate
  );

  const recentProgress = progressEntries?.[0];

  const statCards = [
    {
      title: "Workout Streak",
      value: `${user?.currentStreak || 0} Days`,
      description: user?.currentStreak === user?.longestStreak ? "Personal Best!" : "Keep it up!",
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Consistency Score",
      value: "87%",
      description: "Weekly average",
      icon: <TrendingUp className="h-6 w-6 text-gym-secondary" />,
      color: "from-gym-secondary to-gym-accent"
    },
    {
      title: "Total Points",
      value: user?.points?.toLocaleString() || "0",
      description: "+50 today",
      icon: <Trophy className="h-6 w-6 text-gym-accent" />,
      color: "from-gym-accent to-purple-500"
    },
    {
      title: "User Level",
      value: `Level ${user?.level || 1}`,
      description: "Beast Mode",
      icon: <Crown className="h-6 w-6 text-yellow-500" />,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'Champion'}!</h1>
          <p className="text-gray-400">Ready to crush your fitness goals today?</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="gym-button-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Workout
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-gym-surface border-gray-700 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <span className="text-sm text-gray-400">{stat.title}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gamification System */}
      <GamificationSystem />

      {/* Streak Tracker */}
      <StreakTracker />

      {/* Daily Motivation */}
      {motivationQuote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-gym-primary/20 to-gym-secondary/20 border-gym-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">💪</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Daily Motivation</h3>
                  <blockquote className="text-gray-300 italic text-lg mb-2">
                    "{motivationQuote.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-400">— {motivationQuote.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gym-surface border-gray-700 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="h-6 w-6 text-gym-primary" />
                <span>Today's Workout</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayWorkout ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{todayWorkout.name}</h3>
                    <Badge variant="outline" className="border-gym-primary text-gym-primary">
                      {todayWorkout.duration} min
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Muscle Groups:</span>
                      <span className="text-gym-primary">
                        {todayWorkout.muscleGroups?.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Exercises:</span>
                      <span className="text-gym-primary">{todayWorkout.exercises?.length || 0}</span>
                    </div>
                  </div>
                  <Button className="w-full gym-button-primary">
                    Start Workout
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No workout scheduled for today</p>
                  <Button className="gym-button-primary">
                    Schedule Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Nutrition */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gym-surface border-gray-700 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="h-6 w-6 text-gym-secondary" />
                <span>Today's Nutrition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gym-primary">125g</div>
                    <div className="text-sm text-gray-400">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gym-secondary">180g</div>
                    <div className="text-sm text-gray-400">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gym-accent">65g</div>
                    <div className="text-sm text-gray-400">Fats</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {["Breakfast", "Lunch", "Dinner"].map((meal, index) => {
                    const mealLog = todayMealLogs?.find((m: any) => 
                      m.mealType.toLowerCase() === meal.toLowerCase()
                    );
                    return (
                      <div key={meal} className="flex justify-between items-center p-3 bg-gym-dark rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            mealLog?.consumed ? 'bg-gym-primary' : 'bg-gray-600'
                          }`} />
                          <span className="text-sm">{meal}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {mealLog?.consumed ? "✓ Completed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gym-surface border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-gym-accent" />
                <span>Recent Achievements</span>
              </span>
              <Button variant="ghost" className="text-gym-primary">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userAchievements?.slice(0, 6).map((achievement: any, index: number) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AchievementBadge achievement={achievement} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Summary */}
      {recentProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-gym-primary" />
                <span>Progress Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Weight Goal Progress</span>
                    <span className="text-gym-primary">65%</span>
                  </div>
                  <Progress value={65} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Start: 85kg</span>
                    <span>Current: {recentProgress.weight}kg</span>
                    <span>Goal: 75kg</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Muscle Gain Goal</span>
                    <span className="text-gym-secondary">42%</span>
                  </div>
                  <Progress value={42} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Start: 15%</span>
                    <span>Current: {recentProgress.muscleMass}%</span>
                    <span>Goal: 22%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
