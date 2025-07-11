import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import WorkoutPlanner from "@/pages/WorkoutPlanner";
import NutritionPlanner from "@/pages/NutritionPlanner";
import ProgressTracker from "@/pages/ProgressTracker";
import AdminPanel from "@/pages/AdminPanel";
import Layout from "@/components/Layout";
import Watermark from "@/components/Watermark";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Layout>
          <Route path="/" component={Dashboard} />
          <Route path="/workouts" component={WorkoutPlanner} />
          <Route path="/nutrition" component={NutritionPlanner} />
          <Route path="/progress" component={ProgressTracker} />
          <Route path="/admin" component={AdminPanel} />
        </Layout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gym-dark text-white">
          <PWAInstallPrompt />
          <Toaster />
          <Router />
          <Watermark />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
