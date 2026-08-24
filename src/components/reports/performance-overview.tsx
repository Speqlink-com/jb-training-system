"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  DollarSign,
  Activity,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface PerformanceOverviewProps {
  data: {
    performance: {
      totalAgents: number;
      activeAgents: number;
      monthlyTarget: number;
      monthlyAchievement: number;
      achievementRate: number;
      avgTicketSize: number;
      conversionRate: number;
      customerSatisfaction: number;
      trends: {
        achievement: number[];
        ticketSize: number[];
        conversion: number[];
      };
    };
    training: {
      totalSessions: number;
      completedSessions: number;
      averageAttendance: number;
      complianceRate: number;
    };
    onboarding: {
      totalCandidates: number;
      onboardedAgents: number;
      conversionRate: number;
    };
    workforce: {
      totalSalesManagers: number;
      totalHOAs: number;
      totalTrainers: number;
    };
  };
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const { performance, training, onboarding, workforce } = data;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    return `KES ${(amount / 1000).toFixed(0)}K`;
  };

  const getTrend = (values: number[]) => {
    if (values.length < 2) return { direction: "neutral", percentage: 0 };
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      percentage: Math.abs(change)
    };
  };

  const achievementTrend = getTrend(performance.trends.achievement);
  const ticketSizeTrend = getTrend(performance.trends.ticketSize);
  const conversionTrend = getTrend(performance.trends.conversion);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Achievement"
          value={`${performance.achievementRate}%`}
          description={formatCurrency(performance.monthlyAchievement)}
          icon={Target}
          trend={{
            value: achievementTrend.percentage,
            isPositive: achievementTrend.direction === "up"
          }}
        />
        <StatCard
          title="Active Agents"
          value={performance.activeAgents.toString()}
          description={`${performance.totalAgents} total agents`}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Avg Ticket Size"
          value={formatCurrency(performance.avgTicketSize)}
          description="Per transaction"
          icon={DollarSign}
          trend={{
            value: ticketSizeTrend.percentage,
            isPositive: ticketSizeTrend.direction === "up"
          }}
        />
        <StatCard
          title="Customer Satisfaction"
          value={`${performance.customerSatisfaction}/5`}
          description="Overall rating"
          icon={Star}
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Performance Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Performance Trends
            </CardTitle>
            <CardDescription>
              7-day performance metrics comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Achievement Rate Trend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Achievement Rate</span>
                  <div className="flex items-center gap-1">
                    {achievementTrend.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      achievementTrend.direction === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {achievementTrend.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={performance.achievementRate} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {performance.achievementRate}%</span>
                  <span>Target: 100%</span>
                </div>
              </div>

              {/* Conversion Rate Trend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <div className="flex items-center gap-1">
                    {conversionTrend.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      conversionTrend.direction === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {conversionTrend.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={performance.conversionRate * 4} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {performance.conversionRate}%</span>
                  <span>Industry: 22%</span>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {performance.trends.achievement[performance.trends.achievement.length - 1]}%
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(performance.trends.ticketSize[performance.trends.ticketSize.length - 1])}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Ticket</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.trends.conversion[performance.trends.conversion.length - 1]}%
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Training Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Training Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="text-sm font-medium">{training.complianceRate}%</span>
                </div>
                <Progress value={training.complianceRate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attendance Rate</span>
                  <span className="text-sm font-medium">{training.averageAttendance}%</span>
                </div>
                <Progress value={training.averageAttendance} className="h-2" />
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions Completed</span>
                  <span className="text-sm font-medium">
                    {training.completedSessions}/{training.totalSessions}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workforce Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Workforce Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sales Managers</span>
                <span className="text-lg font-bold">{workforce.totalSalesManagers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Head of Agencies</span>
                <span className="text-lg font-bold">{workforce.totalHOAs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Trainers</span>
                <span className="text-lg font-bold">{workforce.totalTrainers}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Joiners (MTD)</span>
                  <span className="text-lg font-bold text-green-600">
                    {onboarding.onboardedAgents}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Target</p>
                <p className="text-2xl font-bold">{formatCurrency(performance.monthlyTarget)}</p>
                <p className="text-sm text-green-600">
                  {formatCurrency(performance.monthlyAchievement)} achieved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent Productivity</p>
                <p className="text-2xl font-bold">
                  {Math.round((performance.activeAgents / performance.totalAgents) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {performance.activeAgents} of {performance.totalAgents} active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Health</p>
                <p className="text-2xl font-bold">{onboarding.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">
                  Candidate conversion rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}