"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ReportFilters } from "@/components/reports/report-filters";
import { PerformanceOverview } from "@/components/reports/performance-overview";
import { TrainingAnalytics } from "@/components/reports/training-analytics";
import { WorkforceMetrics } from "@/components/reports/workforce-metrics";
import { OnboardingStats } from "@/components/reports/onboarding-stats";
import { ExportReports } from "@/components/reports/export-reports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permission } from "@/config/permissions";
import { 
  BarChart3, 
  Download, 
  Filter,
  TrendingUp,
  Users,
  GraduationCap,
  UserCheck,
  Calendar,
  Target,
  Award,
  Activity
} from "lucide-react";

// Mock analytics data
const mockAnalyticsData = {
  performance: {
    totalAgents: 1250,
    activeAgents: 1180,
    monthlyTarget: 450000000,
    monthlyAchievement: 428000000,
    achievementRate: 95,
    avgTicketSize: 185000,
    conversionRate: 24,
    customerSatisfaction: 4.6,
    trends: {
      achievement: [92, 88, 95, 91, 89, 94, 95],
      ticketSize: [175000, 168000, 182000, 179000, 171000, 183000, 185000],
      conversion: [22, 21, 25, 23, 22, 24, 24]
    }
  },
  training: {
    totalSessions: 48,
    completedSessions: 42,
    totalParticipants: 2850,
    averageAttendance: 92,
    averageEffectiveness: 89,
    complianceRate: 94,
    categoriesBreakdown: {
      "AML": 15,
      "PRODUCT_MIX": 12,
      "NEW_AGENTS": 8,
      "SPECIALISED": 6,
      "EXISTING_TARGETED": 4,
      "ALTERNATIVE_DISTRIBUTION": 3
    }
  },
  workforce: {
    totalSalesManagers: 24,
    totalHOAs: 5,
    totalTrainers: 8,
    avgTeamSize: 52,
    topPerformers: [
      { name: "Grace Wanjiru", role: "Sales Manager", performance: 113, region: "Central" },
      { name: "Samuel Mwangi", role: "HOA", performance: 105, region: "Coast" },
      { name: "David Kimani", role: "Sales Manager", performance: 95, region: "Central" }
    ]
  },
  onboarding: {
    totalCandidates: 156,
    activeCandidates: 89,
    approvedCandidates: 34,
    onboardedAgents: 23,
    conversionRate: 67,
    avgProcessingTime: 12,
    pipeline: {
      "APPLICATION_SUBMITTED": 25,
      "UNDER_REVIEW": 18,
      "INTERVIEW_SCHEDULED": 21,
      "OFFER_EXTENDED": 15,
      "ACTIVE_AGENT": 23
    }
  }
};

function ReportsContent() {
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    region: "",
    branch: "",
    reportType: "",
  });
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive performance insights and business intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <ReportFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="workforce" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Workforce
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Onboarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PerformanceOverview data={mockAnalyticsData} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Achievement Overview
                </CardTitle>
                <CardDescription>
                  Monthly performance vs targets across regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {mockAnalyticsData.performance.achievementRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Achievement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        KES {(mockAnalyticsData.performance.monthlyAchievement / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Monthly Sales</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {mockAnalyticsData.performance.conversionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>
                  
                  {/* Trend indicators */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">7-Day Trends</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Achievement Rate</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm font-medium">+3%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Ticket Size</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm font-medium">+6%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Customer Satisfaction</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm font-medium">+0.2</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  Highest achieving teams and individuals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.workforce.topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {performer.role} • {performer.region}
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
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <TrainingAnalytics data={mockAnalyticsData.training} />
        </TabsContent>

        <TabsContent value="workforce" className="space-y-6">
          <WorkforceMetrics data={mockAnalyticsData.workforce} />
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <OnboardingStats data={mockAnalyticsData.onboarding} />
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <ExportReports />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.REPORTS_READ]}
    >
      <DashboardShell>
        <ReportsContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}