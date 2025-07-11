import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Scale, 
  Activity, 
  Plus, 
  Download,
  Calendar,
  BarChart3,
  LineChart,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import ProgressChart from "@/components/ProgressChart";
import { generateProgressReport } from "@/lib/pdfGenerator";

export default function ProgressTracker() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: progressEntries, isLoading } = useQuery({
    queryKey: ["/api/progress"],
  });

  const createProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Success",
        description: "Progress entry added successfully!",
      });
      setNewEntryOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add progress entry",
        variant: "destructive",
      });
    },
  });

  const handleAddProgress = (data: any) => {
    const bmi = data.weight && data.height ? 
      (data.weight / Math.pow(data.height / 100, 2)).toFixed(1) : null;
    
    createProgressMutation.mutate({
      ...data,
      bmi: bmi ? parseFloat(bmi) : null,
      entryDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleGenerateReport = async () => {
    try {
      await generateProgressReport(user, progressEntries || []);
      toast({
        title: "Success",
        description: "Progress report generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const getLatestEntry = () => {
    return progressEntries?.[0] || null;
  };

  const getProgressStats = () => {
    if (!progressEntries || progressEntries.length === 0) return null;

    const latest = progressEntries[0];
    const previous = progressEntries[1];
    
    const weightChange = previous && latest.weight && previous.weight ? 
      latest.weight - previous.weight : 0;
    
    const bmiChange = previous && latest.bmi && previous.bmi ? 
      latest.bmi - previous.bmi : 0;

    return {
      weightChange,
      bmiChange,
      latest,
      previous,
    };
  };

  const stats = getProgressStats();

  const statCards = [
    {
      title: "Current Weight",
      value: stats?.latest?.weight ? `${stats.latest.weight} kg` : "No data",
      change: stats?.weightChange || 0,
      icon: <Scale className="h-6 w-6 text-gym-primary" />,
      color: "text-gym-primary"
    },
    {
      title: "BMI",
      value: stats?.latest?.bmi ? stats.latest.bmi.toFixed(1) : "No data",
      change: stats?.bmiChange || 0,
      icon: <Calculator className="h-6 w-6 text-gym-secondary" />,
      color: "text-gym-secondary"
    },
    {
      title: "Body Fat",
      value: stats?.latest?.bodyFat ? `${stats.latest.bodyFat}%` : "No data",
      change: 0,
      icon: <Target className="h-6 w-6 text-gym-accent" />,
      color: "text-gym-accent"
    },
    {
      title: "Muscle Mass",
      value: stats?.latest?.muscleMass ? `${stats.latest.muscleMass}%` : "No data",
      change: 0,
      icon: <Activity className="h-6 w-6 text-yellow-500" />,
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-gym-primary" />
            <span>Progress Tracker</span>
          </h1>
          <p className="text-gray-400">Track your fitness journey with detailed analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleGenerateReport}
            variant="outline"
            className="border-gym-primary text-gym-primary hover:bg-gym-primary hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
            <DialogTrigger asChild>
              <Button className="gym-button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gym-surface border-gray-700">
              <DialogHeader>
                <DialogTitle>Add Progress Entry</DialogTitle>
              </DialogHeader>
              <ProgressForm onSubmit={handleAddProgress} isLoading={createProgressMutation.isPending} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-gym-surface border-gray-700 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <span className="text-sm text-gray-400">{stat.title}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  {stat.change !== 0 && (
                    <div className={`text-sm flex items-center ${
                      stat.change > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        stat.change > 0 ? 'rotate-0' : 'rotate-180'
                      }`} />
                      {Math.abs(stat.change).toFixed(1)} from last entry
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Goals Progress */}
      <Card className="bg-gym-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-gym-primary" />
            <span>Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weight Loss Goal</span>
                <span className="text-gym-primary">65% Complete</span>
              </div>
              <Progress value={65} className="h-3" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Start: 85kg</span>
                <span>Current: {stats?.latest?.weight || '--'}kg</span>
                <span>Goal: 75kg</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Muscle Gain Goal</span>
                <span className="text-gym-secondary">42% Complete</span>
              </div>
              <Progress value={42} className="h-3" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Start: 15%</span>
                <span>Current: {stats?.latest?.muscleMass || '--'}%</span>
                <span>Goal: 22%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gym-surface">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gym-surface border-gray-700">
              <CardHeader>
                <CardTitle>Weight Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart 
                  data={progressEntries || []} 
                  dataKey="weight" 
                  color="#10b981"
                  title="Weight (kg)"
                />
              </CardContent>
            </Card>

            <Card className="bg-gym-surface border-gray-700">
              <CardHeader>
                <CardTitle>BMI Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart 
                  data={progressEntries || []} 
                  dataKey="bmi" 
                  color="#60a5fa"
                  title="BMI"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-gym-primary" />
                <span>Detailed Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Body Composition</h3>
                  <ProgressChart 
                    data={progressEntries || []} 
                    dataKey="bodyFat" 
                    color="#8b5cf6"
                    title="Body Fat %"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Muscle Mass</h3>
                  <ProgressChart 
                    data={progressEntries || []} 
                    dataKey="muscleMass" 
                    color="#f59e0b"
                    title="Muscle Mass %"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gym-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-gym-accent" />
                <span>Progress History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gym-dark rounded-lg p-4">
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : progressEntries && progressEntries.length > 0 ? (
                <div className="space-y-4">
                  {progressEntries.map((entry: any, index: number) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-gym-dark rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-400">
                          {new Date(entry.entryDate).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className="border-gym-primary text-gym-primary">
                          Entry #{progressEntries.length - index}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {entry.weight && (
                          <div>
                            <div className="text-xs text-gray-400">Weight</div>
                            <div className="text-lg font-semibold">{entry.weight} kg</div>
                          </div>
                        )}
                        {entry.bmi && (
                          <div>
                            <div className="text-xs text-gray-400">BMI</div>
                            <div className="text-lg font-semibold">{entry.bmi.toFixed(1)}</div>
                          </div>
                        )}
                        {entry.bodyFat && (
                          <div>
                            <div className="text-xs text-gray-400">Body Fat</div>
                            <div className="text-lg font-semibold">{entry.bodyFat}%</div>
                          </div>
                        )}
                        {entry.muscleMass && (
                          <div>
                            <div className="text-xs text-gray-400">Muscle Mass</div>
                            <div className="text-lg font-semibold">{entry.muscleMass}%</div>
                          </div>
                        )}
                      </div>
                      {entry.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="text-sm text-gray-300">{entry.notes}</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No progress entries yet</p>
                  <Button 
                    onClick={() => setNewEntryOpen(true)}
                    className="gym-button-primary"
                  >
                    Add Your First Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProgressForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    bodyFat: "",
    muscleMass: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : null,
      notes: formData.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="70.5"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="175"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bodyFat">Body Fat (%)</Label>
          <Input
            id="bodyFat"
            type="number"
            step="0.1"
            value={formData.bodyFat}
            onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
            placeholder="15.5"
          />
        </div>
        <div>
          <Label htmlFor="muscleMass">Muscle Mass (%)</Label>
          <Input
            id="muscleMass"
            type="number"
            step="0.1"
            value={formData.muscleMass}
            onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
            placeholder="35.2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="How are you feeling today?"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="gym-button-primary" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Entry"}
        </Button>
      </div>
    </form>
  );
}
