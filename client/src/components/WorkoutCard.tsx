import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Play, 
  CheckCircle,
  Calendar,
  Flame
} from "lucide-react";

interface WorkoutCardProps {
  session: {
    id: number;
    name: string;
    muscleGroups: string[];
    duration?: number;
    caloriesBurned?: number;
    exercises: any[];
    completed: boolean;
    completedAt?: string;
    scheduledDate?: string;
  };
  onComplete: () => void;
  isCompleting?: boolean;
}

export default function WorkoutCard({ session, onComplete, isCompleting = false }: WorkoutCardProps) {
  const getExerciseCount = () => {
    return session.exercises?.length || 0;
  };

  const isScheduledToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return session.scheduledDate === today;
  };

  const isOverdue = () => {
    if (!session.scheduledDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return session.scheduledDate < today && !session.completed;
  };

  return (
    <Card className={`bg-gym-surface border-gray-700 card-hover ${
      session.completed ? 'border-gym-primary' : 
      isOverdue() ? 'border-red-500' : 
      isScheduledToday() ? 'border-gym-secondary' : ''
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Dumbbell className="h-5 w-5 text-gym-primary" />
            <span>{session.name}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {session.completed && (
              <CheckCircle className="h-5 w-5 text-gym-primary" />
            )}
            {isScheduledToday() && !session.completed && (
              <Badge variant="outline" className="border-gym-secondary text-gym-secondary">
                Today
              </Badge>
            )}
            {isOverdue() && (
              <Badge variant="outline" className="border-red-500 text-red-500">
                Overdue
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center space-x-4">
          {session.scheduledDate && (
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(session.scheduledDate).toLocaleDateString()}</span>
            </span>
          )}
          {session.duration && (
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{session.duration} min</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Muscle Groups */}
        <div className="flex flex-wrap gap-2">
          {session.muscleGroups?.map((group, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-gym-primary text-gym-primary"
            >
              {group}
            </Badge>
          ))}
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gym-dark p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-gym-primary mr-1" />
              <span className="text-sm text-gray-400">Exercises</span>
            </div>
            <div className="text-lg font-bold">{getExerciseCount()}</div>
          </div>
          <div className="bg-gym-dark p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm text-gray-400">Target Calories</span>
            </div>
            <div className="text-lg font-bold">{session.caloriesBurned || 350}</div>
          </div>
        </div>

        {/* Exercise List Preview */}
        {session.exercises && session.exercises.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Exercises:</div>
            <div className="space-y-1">
              {session.exercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gym-dark rounded text-sm">
                  <span>{exercise.name}</span>
                  <span className="text-gray-400">
                    {exercise.sets}x{exercise.reps}
                  </span>
                </div>
              ))}
              {session.exercises.length > 3 && (
                <div className="text-xs text-gray-400 text-center">
                  +{session.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar for Completed Workouts */}
        {session.completed && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Completed</span>
              <span className="text-gym-primary">100%</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="text-xs text-gray-400">
              Completed on {new Date(session.completedAt!).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {session.completed ? (
            <Button
              disabled
              className="w-full bg-gym-primary/20 text-gym-primary border border-gym-primary/30"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="w-full gym-button-primary"
              disabled={isCompleting}
            >
              <Play className="h-4 w-4 mr-2" />
              {isCompleting ? "Completing..." : "Start Workout"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
