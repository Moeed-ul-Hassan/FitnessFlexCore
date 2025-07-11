import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Target, TrendingUp, Crown, Shield, Smartphone } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: <Dumbbell className="h-8 w-8 text-gym-primary" />,
      title: "Workout Planner",
      description: "Create personalized workout routines with muscle group targeting and pre-made plans."
    },
    {
      icon: <Target className="h-8 w-8 text-gym-secondary" />,
      title: "Nutrition Tracking",
      description: "Budget-based meal planning with calorie and macro tracking for your goals."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-gym-accent" />,
      title: "Progress Analytics",
      description: "Visual charts and BMI tracking to monitor your fitness journey."
    },
    {
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      title: "Gamification",
      description: "Earn points, unlock achievements, and maintain workout streaks."
    },
    {
      icon: <Shield className="h-8 w-8 text-gym-primary" />,
      title: "White-Label Ready",
      description: "Fully customizable branding for gym owners and personal trainers."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-gym-secondary" />,
      title: "PWA Support",
      description: "Install as an app on any device with offline functionality."
    }
  ];

  return (
    <div className="min-h-screen bg-gym-dark text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gym-primary/20 to-gym-secondary/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <Dumbbell className="h-16 w-16 text-gym-primary" />
              <h1 className="text-6xl md:text-8xl font-bold gradient-text">
                GYMISCTIC
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Professional fitness management platform for gym owners, personal trainers, and health coaches. 
              White-label ready with gamification and PWA support.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Button
                onClick={handleLogin}
                className="gym-button-primary text-lg px-8 py-4 h-auto"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-gym-primary text-gym-primary hover:bg-gym-primary hover:text-white text-lg px-8 py-4 h-auto"
              >
                View Demo
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {["PWA Ready", "White-Label", "Multi-Client", "Gamification"].map((badge, index) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="bg-gym-primary/20 text-gym-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  ✓ {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive fitness management tools designed for modern fitness professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gym-surface border-gray-700 h-full card-hover">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gym-primary to-gym-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Fitness Business?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of fitness professionals using GYMISCTIC to grow their business
            </p>
            <Button
              onClick={handleLogin}
              className="bg-white text-gym-primary hover:bg-gray-100 text-lg px-8 py-4 h-auto font-bold"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gym-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Dumbbell className="h-8 w-8 text-gym-primary" />
              <span className="text-2xl font-bold gradient-text">GYMISCTIC</span>
            </div>
            <p className="text-gray-400">
              Professional fitness management platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
