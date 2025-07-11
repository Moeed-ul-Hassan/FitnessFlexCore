import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface AchievementBadgeProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    points: number;
    unlockedAt?: string;
  };
  unlocked?: boolean;
}

export default function AchievementBadge({ achievement, unlocked = true }: AchievementBadgeProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      case 'common':
      default:
        return 'from-gym-primary to-green-400';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-500';
      case 'epic':
        return 'border-purple-500';
      case 'rare':
        return 'border-blue-500';
      case 'common':
      default:
        return 'border-gym-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <div className={`relative p-4 rounded-full w-16 h-16 mx-auto mb-2 ${
        unlocked 
          ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} badge-glow` 
          : 'bg-gray-700'
      } ${unlocked ? getRarityBorder(achievement.rarity) : 'border-gray-600'} border-2`}>
        <div className="text-2xl">
          {unlocked ? achievement.icon : '🔒'}
        </div>
        {unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        )}
      </div>
      <div className="space-y-1">
        <p className={`text-sm font-medium ${unlocked ? 'text-white' : 'text-gray-400'}`}>
          {achievement.name}
        </p>
        <p className="text-xs text-gray-400">
          {unlocked ? (
            achievement.unlockedAt ? 
              `Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}` :
              'Unlocked'
          ) : 'Locked'}
        </p>
        {unlocked && (
          <Badge variant="outline" className={`text-xs ${getRarityBorder(achievement.rarity)} ${
            achievement.rarity === 'legendary' ? 'text-yellow-500' :
            achievement.rarity === 'epic' ? 'text-purple-500' :
            achievement.rarity === 'rare' ? 'text-blue-500' :
            'text-gym-primary'
          }`}>
            {achievement.points} pts
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
