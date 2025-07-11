import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function StreakTracker() {
  const { user } = useAuth();
  
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;
  const lastWorkoutDate = user?.lastWorkoutDate;

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak === 1) return "Great start! Keep it up!";
    if (currentStreak < 7) return "Building momentum!";
    if (currentStreak < 14) return "You're on fire!";
    if (currentStreak < 30) return "Incredible dedication!";
    return "Legendary consistency!";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-gray-400";
    if (currentStreak < 7) return "text-orange-400";
    if (currentStreak < 14) return "text-orange-500";
    if (currentStreak < 30) return "text-red-500";
    return "text-yellow-500";
  };

  const getNextMilestone = () => {
    if (currentStreak < 7) return 7;
    if (currentStreak < 14) return 14;
    if (currentStreak < 30) return 30;
    if (currentStreak < 50) return 50;
    if (currentStreak < 100) return 100;
    return Math.ceil(currentStreak / 100) * 100;
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = (currentStreak / nextMilestone) * 100;

  const getWeeklyGrid = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Mock data - in real app, this would come from workout history
      const hasWorkout = i < currentStreak || (lastWorkoutDate && dateString <= lastWorkoutDate);
      
      days.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasWorkout
      });
    }
    
    return days;
  };

  const weeklyGrid = getWeeklyGrid();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gym-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className={`h-6 w-6 ${getStreakColor()}`} />
            <span>Workout Streak</span>
          </CardTitle>
          <CardDescription>{getStreakMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Streak Display */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className={`text-6xl font-bold ${getStreakColor()} mb-2`}>
                {currentStreak}
              </div>
              <div className="text-lg text-gray-400">
                {currentStreak === 1 ? 'Day' : 'Days'}
              </div>
              {currentStreak > 0 && (
                <div className="absolute -top-2 -right-2">
                  <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Weekly Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-300">This Week</h3>
              <Badge variant="outline" className="border-gym-primary text-gym-primary">
                <Calendar className="h-3 w-3 mr-1" />
                {weeklyGrid.filter(d => d.hasWorkout).length}/7
              </Badge>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklyGrid.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.hasWorkout 
                      ? 'bg-gym-primary text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {day.hasWorkout ? '✓' : '○'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress to Next Milestone */}
          {currentStreak > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-300">Next Milestone</h3>
                <Badge variant="outline" className="border-gym-secondary text-gym-secondary">
                  <Target className="h-3 w-3 mr-1" />
                  {nextMilestone} days
                </Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-gym-primary to-gym-secondary h-3 rounded-full"
                />
              </div>
              <div className="text-sm text-gray-400 text-center">
                {nextMilestone - currentStreak} days to go
              </div>
            </div>
          )}

          {/* Personal Best */}
          <div className="flex items-center justify-between p-4 bg-gym-dark rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Personal Best</span>
            </div>
            <div className="text-lg font-bold text-yellow-500">
              {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
