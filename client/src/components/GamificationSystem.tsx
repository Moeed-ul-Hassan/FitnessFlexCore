import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Crown, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function GamificationSystem() {
  const { user } = useAuth();
  
  const currentLevel = user?.level || 1;
  const currentPoints = user?.points || 0;
  
  // Calculate XP needed for next level
  const getXPForLevel = (level: number) => level * 500;
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const progressToNext = currentPoints >= nextLevelXP ? 100 : 
    ((currentPoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const getLevelTitle = (level: number) => {
    if (level < 3) return "Beginner";
    if (level < 6) return "Intermediate";
    if (level < 10) return "Advanced";
    if (level < 15) return "Expert";
    if (level < 20) return "Master";
    return "Beast Mode";
  };

  const getLevelColor = (level: number) => {
    if (level < 3) return "text-green-400";
    if (level < 6) return "text-blue-400";
    if (level < 10) return "text-purple-400";
    if (level < 15) return "text-orange-400";
    if (level < 20) return "text-red-400";
    return "text-yellow-500";
  };

  const getLevelIcon = (level: number) => {
    if (level < 3) return <Star className="h-5 w-5" />;
    if (level < 6) return <Award className="h-5 w-5" />;
    if (level < 10) return <Trophy className="h-5 w-5" />;
    if (level < 15) return <Crown className="h-5 w-5" />;
    if (level < 20) return <Zap className="h-5 w-5" />;
    return <Crown className="h-5 w-5" />;
  };

  // Mock recent activities for points
  const recentActivities = [
    { action: "Completed workout", points: 50, time: "2 hours ago" },
    { action: "7-day streak achieved", points: 100, time: "Yesterday" },
    { action: "Logged meal", points: 25, time: "Yesterday" },
    { action: "Progress entry added", points: 30, time: "3 days ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gym-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-gym-accent" />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>Level up by staying consistent with your fitness journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-gym-accent to-purple-500 ${getLevelColor(currentLevel)}`}>
                  {getLevelIcon(currentLevel)}
                </div>
                <div>
                  <div className="text-xl font-bold">Level {currentLevel}</div>
                  <div className={`text-sm ${getLevelColor(currentLevel)}`}>
                    {getLevelTitle(currentLevel)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold points-counter">
                  {currentPoints.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
            </div>

            {/* Progress to Next Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to Level {currentLevel + 1}</span>
                <span className="text-gym-accent">
                  {Math.max(0, currentPoints - currentLevelXP)} / {nextLevelXP - currentLevelXP} XP
                </span>
              </div>
              <Progress value={Math.max(0, progressToNext)} className="h-3" />
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gym-dark p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gym-primary mb-1">50</div>
              <div className="text-sm text-gray-400">Per Workout</div>
            </div>
            <div className="bg-gym-dark p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gym-secondary mb-1">25</div>
              <div className="text-sm text-gray-400">Per Meal Log</div>
            </div>
            <div className="bg-gym-dark p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gym-accent mb-1">100</div>
              <div className="text-sm text-gray-400">Per Achievement</div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-300">Recent Activities</h3>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-gym-dark rounded-lg"
                >
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                  <Badge variant="outline" className="border-gym-primary text-gym-primary">
                    +{activity.points} pts
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Level Perks */}
          <div className="p-4 bg-gradient-to-r from-gym-accent/20 to-purple-500/20 rounded-lg border border-gym-accent/30">
            <h3 className="font-semibold text-gym-accent mb-2">
              Level {currentLevel + 1} Perks
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Unlock exclusive workout plans</li>
              <li>• New achievement badges</li>
              <li>• Priority customer support</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
