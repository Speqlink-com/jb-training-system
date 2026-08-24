"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Crown,
  GraduationCap,
  Target,
  TrendingUp,
  Award,
  Building2,
  UserCheck
} from "lucide-react";

interface WorkforceMetricsProps {
  data: {
    totalSalesManagers: number;
    totalHOAs: number;
    totalTrainers: number;
    avgTeamSize: number;
    topPerformers: Array<{
      name: string;
      role: string;
      performance: number;
      region: string;
    }>;
  };
}

export function WorkforceMetrics({ data }: WorkforceMetricsProps) {
  const { totalSalesManagers, totalHOAs, totalTrainers, avgTeamSize, topPerformers } = data;

  // Mock additional workforce data
  const workforceData = {
    totalWorkforce: totalSalesManagers + totalHOAs + totalTrainers + (totalSalesManagers * avgTeamSize),
    activeWorkforce: Math.round((totalSalesManagers + totalHOAs + totalTrainers + (totalSalesManagers * avgTeamSize)) * 0.95),
    retention: 94,
    satisfaction: 4.3,
    promotions: 18,
    newHires: 23,
    regionalDistribution: {
      "Central": { managers: 8, agents: 420 },
      "Coast": { managers: 6, agents: 185 },
      "Western": { managers: 5, agents: 142 },
      "Eastern": { managers: 3, agents: 98 },
      "Rift Valley": { managers: 2, agents: 75 }
    }
  };

  return (
    <div className="space-y-6">
      {/* Workforce Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Workforce</p>
                <p className="text-2xl font-bold">{workforceData.totalWorkforce}</p>
                <p className="text-sm text-green-600">{workforceData.activeWorkforce} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Management</p>
                <p className="text-2xl font-bold">{totalSalesManagers + totalHOAs}</p>
                <p className="text-sm text-muted-foreground">{totalSalesManagers} SMs + {totalHOAs} HOAs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trainers</p>
                <p className="text-2xl font-bold">{totalTrainers}</p>
                <p className="text-sm text-muted-foreground">Training specialists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Team Size</p>
                <p className="text-2xl font-bold">{avgTeamSize}</p>
                <p className="text-sm text-muted-foreground">Agents per SM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Regional Workforce Distribution
            </CardTitle>
            <CardDescription>
              Workforce allocation across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(workforceData.regionalDistribution).map(([region, data]) => {
                const totalRegional = data.managers + data.agents;
                const percentage = Math.round((totalRegional / workforceData.totalWorkforce) * 100);
                
                return (
                  <div key={region} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{region} Region</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {totalRegional} people
                        </span>
                        <Badge variant="secondary">{percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={percentage * 2} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{data.managers} managers</span>
                      <span>{data.agents} agents</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Highest achieving workforce members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {performer.role} • {performer.region} Region
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{performer.performance}%</p>
                    <p className="text-xs text-muted-foreground">Achievement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workforce Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Workforce Health & Engagement
          </CardTitle>
          <CardDescription>
            Key workforce metrics and satisfaction indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Retention & Satisfaction</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Employee Retention</span>
                    <span className="font-medium">{workforceData.retention}%</span>
                  </div>
                  <Progress value={workforceData.retention} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Job Satisfaction</span>
                    <span className="font-medium">{workforceData.satisfaction}/5.0</span>
                  </div>
                  <Progress value={(workforceData.satisfaction / 5) * 100} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Growth & Development</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Internal Promotions</p>
                    <p className="text-xs text-muted-foreground">This year</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{workforceData.promotions}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">New Hires</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{workforceData.newHires}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Performance Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exceeding Targets</span>
                  <span className="font-medium text-green-600">23%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Meeting Targets</span>
                  <span className="font-medium text-blue-600">61%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Below Targets</span>
                  <span className="font-medium text-yellow-600">12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Under Review</span>
                  <span className="font-medium text-red-600">4%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workforce Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Management Effectiveness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales Managers Performance</span>
              <Badge variant="success">96% avg achievement</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">HOA Regional Coverage</span>
              <Badge variant="success">100% regions covered</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Training Delivery</span>
              <Badge variant="success">92% effectiveness</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity & Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Workforce Utilization</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Management Span</span>
              <span className="font-medium">{avgTeamSize} agents/SM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Training Capacity</span>
              <span className="font-medium">150 sessions/month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}