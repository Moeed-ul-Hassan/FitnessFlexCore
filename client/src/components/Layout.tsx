import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Dumbbell, 
  Home, 
  Target, 
  Apple, 
  TrendingUp, 
  Shield, 
  Menu,
  Bell,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Workouts", href: "/workouts", icon: Dumbbell },
    { name: "Nutrition", href: "/nutrition", icon: Apple },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    ...(user?.isAdmin ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gym-dark">
      {/* Navigation Header */}
      <nav className="bg-gym-surface/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Dumbbell className="h-8 w-8 text-gym-primary" />
                <span className="text-2xl font-bold gradient-text">GYMISCTIC</span>
              </Link>
              <Badge variant="outline" className="border-gym-primary text-gym-primary text-xs">
                WHITE-LABEL
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-gym-primary bg-gym-primary/10'
                      : 'text-gray-300 hover:text-white hover:bg-gym-dark/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gym-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gym-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-gray-400">
                    Level {user?.level || 1} • {user?.points || 0} pts
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gym-surface border-gray-700 w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-8">
                    <Dumbbell className="h-8 w-8 text-gym-primary" />
                    <span className="text-2xl font-bold gradient-text">GYMISCTIC</span>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-8 p-4 bg-gym-dark rounded-lg">
                    <div className="w-12 h-12 bg-gym-primary rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {user?.level || 1} • {user?.points || 0} pts
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="flex-1 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'text-gym-primary bg-gym-primary/10'
                            : 'text-gray-300 hover:text-white hover:bg-gym-dark/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="pt-4 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-white mb-2"
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                      <Badge variant="outline" className="ml-auto border-gym-primary text-gym-primary">
                        3
                      </Badge>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
