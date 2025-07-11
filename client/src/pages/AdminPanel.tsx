import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Award, 
  Quote,
  Plus,
  Settings,
  BarChart3,
  Activity,
  Crown,
  Palette,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminPanel() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newAchievementOpen, setNewAchievementOpen] = useState(false);
  const [newQuoteOpen, setNewQuoteOpen] = useState(false);

  // Redirect if not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-gym-surface border-gray-700 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: allUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: quotes } = useQuery({
    queryKey: ["/api/motivation-quotes"],
  });

  const createAchievementMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/achievements", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      toast({
        title: "Success",
        description: "Achievement created successfully!",
      });
      setNewAchievementOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create achievement",
        variant: "destructive",
      });
    },
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/motivation-quotes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motivation-quotes"] });
      toast({
        title: "Success",
        description: "Quote created successfully!",
      });
      setNewQuoteOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create quote",
        variant: "destructive",
      });
    },
  });

  const handleCreateAchievement = (data: any) => {
    createAchievementMutation.mutate(data);
  };

  const handleCreateQuote = (data: any) => {
    createQuoteMutation.mutate(data);
  };

  const statCards = [
    {
      title: "Total Users",
      value: adminStats?.totalUsers || 0,
      description: "+12% this month",
      icon: <Users className="h-8 w-8 text-gym-primary" />,
      color: "from-gym-primary to-green-400"
    },
    {
      title: "Active Users",
      value: adminStats?.activeUsers || 0,
      description: "This week",
      icon: <Activity className="h-8 w-8 text-gym-secondary" />,
      color: "from-gym-secondary to-blue-400"
    },
    {
      title: "Engagement Rate",
      value: "94%",
      description: "Average weekly",
      icon: <TrendingUp className="h-8 w-8 text-gym-accent" />,
      color: "from-gym-accent to-purple-400"
    },
    {
      title: "Goals Achieved",
      value: "356",
      description: "This month",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      color: "from-yellow-500 to-orange-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Shield className="h-8 w-8 text-gym-primary" />
            <span>Admin Panel</span>
          </h1>
          <p className="text-gray-400">Manage your fitness platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-gym-primary text-gym-primary">
            <Shield className="h-3 w-3 mr-1" />
            Admin Only
          </Badge>
          <Button className="gym-button-primary">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-gym-surface border-gray-700 card-hover">
              <CardContent className="p-6 text-center">
                <div className="mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gym-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-2">{stat.title}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 bg-gym-surface">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gym-surface border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-gym-primary" />
                  <span>User Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Activity charts coming soon!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gym-surface border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-gym-secondary" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements?.slice(0, 5).map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gym-dark rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-400">{achievement.description}</div>
                      </div>
                      <Badge variant="outline" className="border-gym-primary text-gym-primary">
                        {achievement.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-gym-primary" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers?.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gym-primary rounded-full flex items-center justify-center">
                              {user.firstName?.[0] || '?'}
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              {user.isAdmin && (
                                <Badge variant="outline" className="border-gym-primary text-gym-primary text-xs">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.points?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gym-secondary text-gym-secondary">
                            Level {user.level || 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span>{user.currentStreak || 0}</span>
                            <span className="text-orange-500">🔥</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-gym-accent" />
                  <span>Achievement Management</span>
                </span>
                <Dialog open={newAchievementOpen} onOpenChange={setNewAchievementOpen}>
                  <DialogTrigger asChild>
                    <Button className="gym-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      New Achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gym-surface border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Create New Achievement</DialogTitle>
                    </DialogHeader>
                    <AchievementForm onSubmit={handleCreateAchievement} isLoading={createAchievementMutation.isPending} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements?.map((achievement: any) => (
                  <div key={achievement.id} className="p-4 bg-gym-dark rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-400">{achievement.description}</div>
                      </div>
                      <Badge variant="outline" className={`${
                        achievement.rarity === 'legendary' ? 'border-yellow-500 text-yellow-500' :
                        achievement.rarity === 'epic' ? 'border-purple-500 text-purple-500' :
                        achievement.rarity === 'rare' ? 'border-blue-500 text-blue-500' :
                        'border-green-500 text-green-500'
                      }`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Type: {achievement.type}</span>
                      <span>{achievement.points} points</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Quote className="h-6 w-6 text-gym-primary" />
                  <span>Motivation Quotes</span>
                </span>
                <Dialog open={newQuoteOpen} onOpenChange={setNewQuoteOpen}>
                  <DialogTrigger asChild>
                    <Button className="gym-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      New Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gym-surface border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Add New Quote</DialogTitle>
                    </DialogHeader>
                    <QuoteForm onSubmit={handleCreateQuote} isLoading={createQuoteMutation.isPending} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotes?.map((quote: any) => (
                  <div key={quote.id} className="p-4 bg-gym-dark rounded-lg">
                    <blockquote className="text-lg italic mb-2">
                      "{quote.quote}"
                    </blockquote>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">— {quote.author}</div>
                      <Badge variant="outline" className="border-gym-primary text-gym-primary">
                        {quote.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-6 w-6 text-gym-accent" />
                <span>White-Label Branding</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Brand customization coming soon!</p>
                <p className="text-sm text-gray-500">
                  Configure colors, logos, and custom styling for your white-label deployment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    type: "",
    points: "",
    rarity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      points: parseInt(formData.points),
      requirement: { type: formData.type, value: 1 },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Achievement Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="First Workout"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Complete your first workout"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon">Icon (Emoji)</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🏋️"
            required
          />
        </div>
        <div>
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            placeholder="100"
            min="10"
            max="1000"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 bg-gym-dark border border-gray-600 rounded-lg"
            required
          >
            <option value="">Select type</option>
            <option value="workout">Workout</option>
            <option value="streak">Streak</option>
            <option value="progress">Progress</option>
            <option value="consistency">Consistency</option>
            <option value="special">Special</option>
          </select>
        </div>
        <div>
          <Label htmlFor="rarity">Rarity</Label>
          <select
            id="rarity"
            value={formData.rarity}
            onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
            className="w-full p-2 bg-gym-dark border border-gray-600 rounded-lg"
            required
          >
            <option value="">Select rarity</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="gym-button-primary" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Achievement"}
        </Button>
      </div>
    </form>
  );
}

function QuoteForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Input
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="Success isn't always about greatness..."
          required
        />
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Dwayne Johnson"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 bg-gym-dark border border-gray-600 rounded-lg"
          required
        >
          <option value="">Select category</option>
          <option value="general">General</option>
          <option value="workout">Workout</option>
          <option value="nutrition">Nutrition</option>
          <option value="mindset">Mindset</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="gym-button-primary" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Quote"}
        </Button>
      </div>
    </form>
  );
}
