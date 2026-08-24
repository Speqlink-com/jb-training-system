"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { SalesManagersTable } from "@/components/workforce/sales-managers-table";
import { SalesManagerFilters } from "@/components/workforce/sales-manager-filters";
import { CreateSalesManagerDialog } from "@/components/workforce/create-sales-manager-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Permission } from "@/config/permissions";
import { 
  Users, 
  Plus, 
  UserCheck,
  Target,
  TrendingUp,
  Award,
  Download,
  Calendar,
  Building2
} from "lucide-react";

// Mock Sales Managers data
const mockSalesManagers = [
  {
    id: "sm1",
    firstName: "David",
    lastName: "Kimani",
    email: "david.kimani@company.com",
    phone: "+254712345678",
    employeeId: "SM001",
    branch: {
      id: "1",
      name: "Nairobi CBD",
      code: "NCB"
    },
    region: "Central",
    dateJoined: "2023-03-15T00:00:00Z",
    status: "ACTIVE" as const,
    teamSize: 45,
    activeAgents: 42,
    monthlyTarget: 15000000,
    monthlyAchievement: 14200000,
    achievementRate: 95,
    trainingCompliance: 98,
    lastLogin: "2024-08-23T08:30:00Z",
    performance: {
      ytdTarget: 135000000,
      ytdAchievement: 128000000,
      ytdRate: 95,
      avgTicketSize: 185000,
      conversionRate: 23,
      customerSatisfaction: 4.7
    },
    certifications: [
      { name: "Leadership Training", status: "COMPLETED", expiryDate: "2025-03-15" },
      { name: "Sales Management", status: "COMPLETED", expiryDate: "2024-12-31" },
      { name: "Digital Transformation", status: "PENDING", expiryDate: null }
    ]
  },
  {
    id: "sm2",
    firstName: "Grace",
    lastName: "Wanjiru",
    email: "grace.wanjiru@company.com",
    phone: "+254723456789",
    employeeId: "SM002",
    branch: {
      id: "2",
      name: "Westlands",
      code: "WLD"
    },
    region: "Central",
    dateJoined: "2022-11-20T00:00:00Z",
    status: "ACTIVE" as const,
    teamSize: 38,
    activeAgents: 35,
    monthlyTarget: 12000000,
    monthlyAchievement: 13500000,
    achievementRate: 113,
    trainingCompliance: 92,
    lastLogin: "2024-08-23T07:15:00Z",
    performance: {
      ytdTarget: 108000000,
      ytdAchievement: 115000000,
      ytdRate: 107,
      avgTicketSize: 205000,
      conversionRate: 28,
      customerSatisfaction: 4.8
    },
    certifications: [
      { name: "Leadership Training", status: "COMPLETED", expiryDate: "2025-11-20" },
      { name: "Sales Management", status: "COMPLETED", expiryDate: "2025-01-15" },
      { name: "Customer Excellence", status: "COMPLETED", expiryDate: "2024-10-30" }
    ]
  },
  {
    id: "sm3",
    firstName: "Joseph",
    lastName: "Mwangi",
    email: "joseph.mwangi@company.com",
    phone: "+254734567890",
    employeeId: "SM003",
    branch: {
      id: "3",
      name: "Mombasa",
      code: "MSA"
    },
    region: "Coast",
    dateJoined: "2023-07-01T00:00:00Z",
    status: "ACTIVE" as const,
    teamSize: 32,
    activeAgents: 30,
    monthlyTarget: 10000000,
    monthlyAchievement: 9800000,
    achievementRate: 98,
    trainingCompliance: 87,
    lastLogin: "2024-08-22T16:45:00Z",
    performance: {
      ytdTarget: 90000000,
      ytdAchievement: 88500000,
      ytdRate: 98,
      avgTicketSize: 175000,
      conversionRate: 25,
      customerSatisfaction: 4.6
    },
    certifications: [
      { name: "Leadership Training", status: "IN_PROGRESS", expiryDate: null },
      { name: "Sales Management", status: "COMPLETED", expiryDate: "2024-09-15" },
      { name: "Regional Management", status: "PENDING", expiryDate: null }
    ]
  }
];

function SalesManagersContent() {
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    branch: "",
    status: "",
    performanceRange: { min: "", max: "" },
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalManagers = mockSalesManagers.length;
  const activeManagers = mockSalesManagers.filter(sm => sm.status === "ACTIVE").length;
  const totalTeamSize = mockSalesManagers.reduce((sum, sm) => sum + sm.teamSize, 0);
  const averagePerformance = Math.round(
    mockSalesManagers.reduce((sum, sm) => sum + sm.achievementRate, 0) / mockSalesManagers.length
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Managers</h1>
          <p className="text-muted-foreground">
            Manage sales managers, track team performance, and monitor targets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Manager
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Managers"
          value={totalManagers.toString()}
          description="Active sales managers"
          icon={Users}
        />
        <StatCard
          title="Active Teams"
          value={activeManagers.toString()}
          description="Currently active"
          icon={UserCheck}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Team Size"
          value={totalTeamSize.toString()}
          description="Total agents managed"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Avg Performance"
          value={`${averagePerformance}%`}
          description="Achievement rate"
          icon={Target}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>
              Sales performance by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(mockSalesManagers.map(sm => sm.region))).map(region => {
                const regionManagers = mockSalesManagers.filter(sm => sm.region === region);
                const regionPerformance = Math.round(
                  regionManagers.reduce((sum, sm) => sum + sm.achievementRate, 0) / regionManagers.length
                );
                const regionTarget = regionManagers.reduce((sum, sm) => sum + sm.monthlyTarget, 0);
                const regionAchievement = regionManagers.reduce((sum, sm) => sum + sm.monthlyAchievement, 0);
                
                return (
                  <div key={region} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{region}</h4>
                      <p className="text-sm text-muted-foreground">
                        {regionManagers.length} managers • {regionManagers.reduce((sum, sm) => sum + sm.teamSize, 0)} agents
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{regionPerformance}%</p>
                      <p className="text-sm text-muted-foreground">
                        KES {(regionAchievement / 1000000).toFixed(1)}M / {(regionTarget / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Highest achieving sales managers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSalesManagers
                .sort((a, b) => b.achievementRate - a.achievementRate)
                .slice(0, 3)
                .map((manager, index) => (
                  <div key={manager.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {manager.firstName} {manager.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {manager.branch.name} • {manager.teamSize} agents
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{manager.achievementRate}%</p>
                      <p className="text-sm text-muted-foreground">
                        KES {(manager.monthlyAchievement / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Managers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sales Managers</CardTitle>
          <CardDescription>
            Complete list of sales managers with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SalesManagerFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <SalesManagersTable 
            salesManagers={mockSalesManagers}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Create Sales Manager Dialog */}
      <CreateSalesManagerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

export default function SalesManagersPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.WORKFORCE_READ]}
    >
      <DashboardShell>
        <SalesManagersContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}