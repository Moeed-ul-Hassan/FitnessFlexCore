import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Apple, 
  DollarSign, 
  Target, 
  Clock,
  Utensils,
  Plus
} from "lucide-react";

interface MealCardProps {
  plan: {
    id: number;
    name: string;
    description: string;
    goal: string;
    budget: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    meals: any[];
  };
  onSelect?: (planId: number) => void;
}

export default function MealCard({ plan, onSelect }: MealCardProps) {
  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss':
        return 'border-red-500 text-red-500';
      case 'muscle_gain':
        return 'border-gym-primary text-gym-primary';
      case 'maintenance':
        return 'border-gym-secondary text-gym-secondary';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low':
        return 'border-green-500 text-green-500';
      case 'medium':
        return 'border-yellow-500 text-yellow-500';
      case 'high':
        return 'border-red-500 text-red-500';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  const formatGoal = (goal: string) => {
    return goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatBudget = (budget: string) => {
    return budget.charAt(0).toUpperCase() + budget.slice(1);
  };

  const getMealCount = () => {
    return plan.meals?.length || 0;
  };

  return (
    <Card className="bg-gym-surface border-gray-700 card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Apple className="h-5 w-5 text-gym-secondary" />
            <span>{plan.name}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getGoalColor(plan.goal)}>
              {formatGoal(plan.goal)}
            </Badge>
            <Badge variant="outline" className={getBudgetColor(plan.budget)}>
              {formatBudget(plan.budget)}
            </Badge>
          </div>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gym-dark p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-gym-secondary mb-1">
              {plan.totalCalories}
            </div>
            <div className="text-xs text-gray-400">Calories</div>
          </div>
          <div className="bg-gym-dark p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-gym-primary mb-1">
              {plan.totalProtein}g
            </div>
            <div className="text-xs text-gray-400">Protein</div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400">Macros Breakdown</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-gym-primary">
                {plan.totalProtein}g
              </div>
              <div className="text-xs text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gym-secondary">
                {plan.totalCarbs}g
              </div>
              <div className="text-xs text-gray-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gym-accent">
                {plan.totalFats}g
              </div>
              <div className="text-xs text-gray-400">Fats</div>
            </div>
          </div>
        </div>

        {/* Meal Information */}
        <div className="flex items-center justify-between p-3 bg-gym-dark rounded-lg">
          <div className="flex items-center space-x-2">
            <Utensils className="h-4 w-4 text-gym-primary" />
            <span className="text-sm">Meals included</span>
          </div>
          <span className="text-sm font-semibold">{getMealCount()} meals</span>
        </div>

        {/* Budget Estimate */}
        <div className="flex items-center justify-between p-3 bg-gym-dark rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gym-secondary" />
            <span className="text-sm">Daily budget</span>
          </div>
          <span className="text-sm font-semibold">
            {plan.budget === 'low' ? '<$10' : 
             plan.budget === 'medium' ? '$10-20' : 
             '$20+'}
          </span>
        </div>

        {/* Meal Schedule Preview */}
        {plan.meals && plan.meals.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Today's Schedule</div>
            <div className="space-y-1">
              {['Breakfast', 'Lunch', 'Dinner'].map((mealType, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gym-dark rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gym-primary rounded-full"></div>
                    <span>{mealType}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {index === 0 ? '08:00' : index === 1 ? '12:00' : '18:00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={() => onSelect?.(plan.id)}
            className="w-full gym-button-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Use This Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
