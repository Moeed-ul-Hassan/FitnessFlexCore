import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Apple, 
  Target, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Utensils,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MealCard from "@/components/MealCard";

export default function NutritionPlanner() {
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTab, setSelectedTab] = useState("plans");

  const { data: mealPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/meal-plans", selectedGoal, selectedBudget],
    enabled: !!selectedGoal && !!selectedBudget,
  });

  const { data: userMealLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/meal-logs"],
  });

  const logMealMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/meal-logs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-logs"] });
      toast({
        title: "Success",
        description: "Meal logged successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log meal",
        variant: "destructive",
      });
    },
  });

  const todayDate = new Date().toISOString().split('T')[0];
  const todayMealLogs = userMealLogs?.filter((log: any) => log.logDate === todayDate) || [];

  const mealTypes = [
    { id: "breakfast", name: "Breakfast", icon: "🌅", time: "07:00" },
    { id: "lunch", name: "Lunch", icon: "🌞", time: "12:00" },
    { id: "dinner", name: "Dinner", icon: "🌙", time: "19:00" },
    { id: "snack", name: "Snack", icon: "🍎", time: "15:00" },
  ];

  const goalOptions = [
    { 
      value: "weight_loss", 
      label: "Weight Loss", 
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Reduce calories, increase protein"
    },
    { 
      value: "muscle_gain", 
      label: "Muscle Gain", 
      icon: <Target className="h-4 w-4" />,
      description: "High protein, moderate calories"
    },
    { 
      value: "maintenance", 
      label: "Maintenance", 
      icon: <Apple className="h-4 w-4" />,
      description: "Balanced nutrition, steady weight"
    },
  ];

  const budgetOptions = [
    { 
      value: "low", 
      label: "Low Budget", 
      icon: <DollarSign className="h-4 w-4" />,
      description: "Under $10/day"
    },
    { 
      value: "medium", 
      label: "Medium Budget", 
      icon: <DollarSign className="h-4 w-4" />,
      description: "$10-20/day"
    },
    { 
      value: "high", 
      label: "High Budget", 
      icon: <DollarSign className="h-4 w-4" />,
      description: "$20+/day"
    },
  ];

  const handleLogMeal = (mealType: string, mealPlanId?: number) => {
    logMealMutation.mutate({
      mealType,
      mealPlanId,
      logDate: todayDate,
      consumed: true,
    });
  };

  const getMealStatus = (mealType: string) => {
    return todayMealLogs.find((log: any) => log.mealType === mealType && log.consumed);
  };

  const calculateDailyTotals = () => {
    // Mock calculation - in real app, this would be based on consumed meals
    return {
      calories: 1847,
      protein: 125,
      carbs: 180,
      fats: 65,
    };
  };

  const dailyTotals = calculateDailyTotals();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Apple className="h-8 w-8 text-gym-secondary" />
            <span>Nutrition Planner</span>
          </h1>
          <p className="text-gray-400">Plan your meals based on your goals and budget</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-gym-secondary text-gym-secondary">
            <Utensils className="h-3 w-3 mr-1" />
            {dailyTotals.calories} kcal today
          </Badge>
        </div>
      </div>

      {/* Goal and Budget Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gym-surface border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-gym-primary" />
              <span>Your Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <div
                  key={goal.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedGoal === goal.value
                      ? 'border-gym-primary bg-gym-primary/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedGoal(goal.value)}
                >
                  <div className="flex items-center space-x-3">
                    {goal.icon}
                    <div>
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-sm text-gray-400">{goal.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gym-surface border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-gym-secondary" />
              <span>Budget Range</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetOptions.map((budget) => (
                <div
                  key={budget.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBudget === budget.value
                      ? 'border-gym-secondary bg-gym-secondary/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedBudget(budget.value)}
                >
                  <div className="flex items-center space-x-3">
                    {budget.icon}
                    <div>
                      <div className="font-medium">{budget.label}</div>
                      <div className="text-sm text-gray-400">{budget.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Nutrition Overview */}
      <Card className="bg-gym-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-gym-accent" />
            <span>Today's Nutrition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gym-secondary mb-2">
                {dailyTotals.calories}
              </div>
              <div className="text-sm text-gray-400">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gym-primary mb-2">
                {dailyTotals.protein}g
              </div>
              <div className="text-sm text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gym-accent mb-2">
                {dailyTotals.carbs}g
              </div>
              <div className="text-sm text-gray-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {dailyTotals.fats}g
              </div>
              <div className="text-sm text-gray-400">Fats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gym-surface">
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="today">Today's Meals</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {!selectedGoal || !selectedBudget ? (
            <Card className="bg-gym-surface border-gray-700">
              <CardContent className="p-8 text-center">
                <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Please select your goal and budget to view meal plans
                </p>
              </CardContent>
            </Card>
          ) : plansLoading ? (
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
              {mealPlans?.map((plan: any, index: number) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <MealCard plan={plan} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mealTypes.map((meal, index) => {
              const isCompleted = getMealStatus(meal.id);
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`bg-gym-surface border-gray-700 card-hover ${
                    isCompleted ? 'border-gym-primary' : ''
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span className="text-2xl">{meal.icon}</span>
                          <span>{meal.name}</span>
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="h-6 w-6 text-gym-primary" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        <Clock className="h-4 w-4 inline mr-1" />
                        Recommended time: {meal.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isCompleted ? (
                        <div className="text-center py-4">
                          <CheckCircle2 className="h-12 w-12 text-gym-primary mx-auto mb-2" />
                          <p className="text-gym-primary font-medium">Completed</p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Button
                            onClick={() => handleLogMeal(meal.id)}
                            className="gym-button-primary"
                            disabled={logMealMutation.isPending}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Log Meal
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-gym-accent" />
                <span>Meal History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Meal history tracking coming soon!</p>
                <Button className="gym-button-primary">
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
