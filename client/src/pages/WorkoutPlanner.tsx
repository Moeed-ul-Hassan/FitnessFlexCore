import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Target, 
  Plus, 
  Play, 
  CheckCircle,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import WorkoutCard from "@/components/WorkoutCard";

export default function WorkoutPlanner() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("plans");
  const [newWorkoutOpen, setNewWorkoutOpen] = useState(false);

  const { data: workoutPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/workout-plans"],
  });

  const { data: userSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/workout-sessions"],
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/workout-sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
      toast({
        title: "Success",
        description: "Workout session created successfully!",
      });
      setNewWorkoutOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create workout session",
        variant: "destructive",
      });
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      await apiRequest("PATCH", `/api/workout-sessions/${sessionId}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Congratulations! 🎉",
        description: "Workout completed! You earned 50 points.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete workout",
        variant: "destructive",
      });
    },
  });

  const handleCreateWorkout = (data: any) => {
    createWorkoutMutation.mutate(data);
  };

  const handleCompleteWorkout = (sessionId: number) => {
    completeWorkoutMutation.mutate(sessionId);
  };

  const preMadePlans = [
    {
      id: 1,
      name: "Beginner Plan",
      description: "Perfect for those starting their fitness journey",
      difficulty: "beginner",
      duration: 3,
      workoutsPerWeek: 3,
      color: "from-gym-primary to-green-400",
      badge: "RECOMMENDED"
    },
    {
      id: 2,
      name: "Intermediate Plan",
      description: "Step up your game with challenging routines",
      difficulty: "intermediate",
      duration: 6,
      workoutsPerWeek: 4,
      color: "from-gym-secondary to-blue-400",
      badge: "POPULAR"
    },
    {
      id: 3,
      name: "Advanced Plan",
      description: "Maximum intensity for serious athletes",
      difficulty: "advanced",
      duration: 8,
      workoutsPerWeek: 5,
      color: "from-gym-accent to-purple-400",
      badge: "ELITE"
    }
  ];

  const getDifficultyDots = (difficulty: string) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const level = levels[difficulty as keyof typeof levels] || 1;
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full ${
              dot <= level ? 'bg-gym-primary' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-gym-primary" />
            <span>Workout Planner</span>
          </h1>
          <p className="text-gray-400">Create and manage your workout routines</p>
        </div>
        <Dialog open={newWorkoutOpen} onOpenChange={setNewWorkoutOpen}>
          <DialogTrigger asChild>
            <Button className="gym-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gym-surface border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
            </DialogHeader>
            <WorkoutForm onSubmit={handleCreateWorkout} isLoading={createWorkoutMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gym-surface">
          <TabsTrigger value="plans">Pre-Made Plans</TabsTrigger>
          <TabsTrigger value="sessions">My Workouts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preMadePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-gym-surface border-gray-700 card-hover h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`border-gym-primary text-gym-primary ${
                          plan.badge === 'RECOMMENDED' ? 'bg-gym-primary/20' : 
                          plan.badge === 'POPULAR' ? 'bg-gym-secondary/20' : 'bg-gym-accent/20'
                        }`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span className="text-gym-primary">{plan.duration} weeks</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Workouts/week:</span>
                        <span className="text-gym-primary">{plan.workoutsPerWeek} days</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span>Difficulty:</span>
                        {getDifficultyDots(plan.difficulty)}
                      </div>
                    </div>
                    <Button className="w-full gym-button-primary">
                      Start Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          {sessionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gym-surface border-gray-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userSessions?.map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <WorkoutCard 
                    session={session} 
                    onComplete={() => handleCompleteWorkout(session.id)}
                    isCompleting={completeWorkoutMutation.isPending}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-gym-primary" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Weekly schedule view coming soon!</p>
                <Button className="gym-button-primary">
                  Schedule Workouts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    muscleGroups: [],
    duration: "",
    exercises: [],
    scheduledDate: "",
  });

  const muscleGroupOptions = [
    "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      duration: parseInt(formData.duration),
      exercises: [
        { name: "Sample Exercise", sets: 3, reps: 10, rest: 60 }
      ]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Workout Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Chest & Triceps"
          required
        />
      </div>

      <div>
        <Label htmlFor="muscleGroups">Muscle Groups</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select muscle groups" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroupOptions.map((group) => (
              <SelectItem key={group} value={group.toLowerCase()}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="45"
          min="15"
          max="180"
          required
        />
      </div>

      <div>
        <Label htmlFor="scheduledDate">Scheduled Date</Label>
        <Input
          id="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setFormData({
          name: "",
          muscleGroups: [],
          duration: "",
          exercises: [],
          scheduledDate: "",
        })}>
          Cancel
        </Button>
        <Button type="submit" className="gym-button-primary" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Workout"}
        </Button>
      </div>
    </form>
  );
}
