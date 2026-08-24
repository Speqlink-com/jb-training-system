"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { HOAsTable } from "@/components/workforce/hoas-table";
import { HOAFilters } from "@/components/workforce/hoa-filters";
import { CreateHOADialog } from "@/components/workforce/create-hoa-dialog";
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
  Crown,
  Building2,
  MapPin
} from "lucide-react";

// Mock HOAs data
const mockHOAs = [
  {
    id: "hoa1",
    firstName: "Margaret",
    lastName: "Wanjiku",
    email: "margaret.wanjiku@company.com",
    phone: "+254711111111",
    employeeId: "HOA001",
    region: "Central",
    dateJoined: "2022-01-15T00:00:00Z",
    status: "ACTIVE" as const,
    salesManagersCount: 8,
    totalTeamSize: 320,
    activeAgents: 298,
    monthlyTarget: 120000000,
    monthlyAchievement: 115000000,
    achievementRate: 96,
    trainingCompliance: 95,
    lastLogin: "2024-08-23T07:00:00Z",
    branches: [
      { id: "1", name: "Nairobi CBD", code: "NCB" },
      { id: "2", name: "Westlands", code: "WLD" },
      { id: "7", name: "Karen", code: "KRN" },
      { id: "8", name: "Thika", code: "THK" }
    ],
    performance: {
      ytdTarget: 1080000000,
      ytdAchievement: 1035000000,
      ytdRate: 96,
      avgTicketSize: 195000,
      conversionRate: 25,
      customerSatisfaction: 4.6
    },
    certifications: [
      { name: "Regional Leadership", status: "COMPLETED", expiryDate: "2025-01-15" },
      { name: "Strategic Management", status: "COMPLETED", expiryDate: "2024-11-30" },
      { name: "Digital Leadership", status: "IN_PROGRESS", expiryDate: null }
    ]
  },
  {
    id: "hoa2",
    firstName: "Samuel",
    lastName: "Mwangi",
    email: "samuel.mwangi@company.com",
    phone: "+254722222222",
    employeeId: "HOA002",
    region: "Coast",
    dateJoined: "2022-06-01T00:00:00Z",
    status: "ACTIVE" as const,
    salesManagersCount: 6,
    totalTeamSize: 185,
    activeAgents: 172,
    monthlyTarget: 75000000,
    monthlyAchievement: 79000000,
    achievementRate: 105,
    trainingCompliance: 92,
    lastLogin: "2024-08-22T18:30:00Z",
    branches: [
      { id: "3", name: "Mombasa", code: "MSA" },
      { id: "9", name: "Malindi", code: "MAL" },
      { id: "10", name: "Kilifi", code: "KLF" }
    ],
    performance: {
      ytdTarget: 675000000,
      ytdAchievement: 710000000,
      ytdRate: 105,
      avgTicketSize: 165000,
      conversionRate: 28,
      customerSatisfaction: 4.7
    },
    certifications: [
      { name: "Regional Leadership", status: "COMPLETED", expiryDate: "2025-06-01" },
      { name: "Coastal Markets", status: "COMPLETED", expiryDate: "2025-03-15" },
      { name: "Strategic Management", status: "PENDING", expiryDate: null }
    ]
  },
  {
    id: "hoa3",
    firstName: "Grace",
    lastName: "Achieng",
    email: "grace.achieng@company.com",
    phone: "+254733333333",
    employeeId: "HOA003",
    region: "Western",
    dateJoined: "2023-02-20T00:00:00Z",
    status: "ACTIVE" as const,
    salesManagersCount: 5,
    totalTeamSize: 142,
    activeAgents: 138,
    monthlyTarget: 55000000,
    monthlyAchievement: 52000000,
    achievementRate: 95,
    trainingCompliance: 89,
    lastLogin: "2024-08-23T08:45:00Z",
    branches: [
      { id: "5", name: "Kisumu", code: "KSM" },
      { id: "11", name: "Kakamega", code: "KAK" },
      { id: "12", name: "Bungoma", code: "BNG" }
    ],
    performance: {
      ytdTarget: 495000000,
      ytdAchievement: 475000000,
      ytdRate: 96,
      avgTicketSize: 145000,
      conversionRate: 22,
      customerSatisfaction: 4.5
    },
    certifications: [
      { name: "Regional Leadership", status: "IN_PROGRESS", expiryDate: null },
      { name: "Western Markets", status: "COMPLETED", expiryDate: "2024-10-20" },
      { name: "Team Development", status: "COMPLETED", expiryDate: "2025-02-20" }
    ]
  }
];

function HOAsContent() {
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    status: "",
    performanceRange: { min: "", max: "" },
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalHOAs = mockHOAs.length;
  const activeHOAs = mockHOAs.filter(hoa => hoa.status === "ACTIVE").length;
  const totalSalesManagers = mockHOAs.reduce((sum, hoa) => sum + hoa.salesManagersCount, 0);
  const totalTeamSize = mockHOAs.reduce((sum, hoa) => sum + hoa.totalTeamSize, 0);
  const averagePerformance = Math.round(
    mockHOAs.reduce((sum, hoa) => sum + hoa.achievementRate, 0) / mockHOAs.length
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Head of Agencies (HOAs)</h1>
          <p className="text-muted-foreground">
            Manage regional leaders, track multi-branch performance, and oversee sales operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add HOA
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total HOAs"
          value={totalHOAs.toString()}
          description="Regional leaders"
          icon={Crown}
        />
        <StatCard
          title="Sales Managers"
          value={totalSalesManagers.toString()}
          description="Under HOA supervision"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Agents"
          value={totalTeamSize.toString()}
          description="Across all regions"
          icon={Building2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Avg Performance"
          value={`${averagePerformance}%`}
          description="Regional achievement"
          icon={Target}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Regional Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>
              Performance comparison across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHOAs.map(hoa => {
                const targetInM = hoa.monthlyTarget / 1000000;
                const achievementInM = hoa.monthlyAchievement / 1000000;
                
                return (
                  <div key={hoa.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{hoa.region} Region</h4>
                      <p className="text-sm text-muted-foreground">
                        {hoa.firstName} {hoa.lastName} • {hoa.salesManagersCount} SMs • {hoa.totalTeamSize} agents
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{hoa.achievementRate}%</p>
                      <p className="text-sm text-muted-foreground">
                        KES {achievementInM.toFixed(1)}M / {targetInM.toFixed(1)}M
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
            <CardTitle>Top Performing Regions</CardTitle>
            <CardDescription>
              Highest achieving HOAs this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHOAs
                .sort((a, b) => b.achievementRate - a.achievementRate)
                .map((hoa, index) => (
                  <div key={hoa.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {hoa.firstName} {hoa.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hoa.region} Region • {hoa.totalTeamSize} agents
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{hoa.achievementRate}%</p>
                      <p className="text-sm text-muted-foreground">
                        KES {(hoa.monthlyAchievement / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Coverage</CardTitle>
          <CardDescription>
            Branch distribution and coverage by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockHOAs.map(hoa => (
              <div key={hoa.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{hoa.region} Region</h4>
                  <div className="text-right">
                    <p className="text-sm font-medium">{hoa.branches.length} branches</p>
                    <p className="text-xs text-muted-foreground">{hoa.totalTeamSize} agents</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {hoa.branches.map(branch => (
                    <div key={branch.id} className="flex items-center justify-between text-sm">
                      <span>{branch.name}</span>
                      <span className="text-muted-foreground">({branch.code})</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">HOA:</span>
                    <span className="font-medium">{hoa.firstName} {hoa.lastName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* HOAs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Head of Agencies</CardTitle>
          <CardDescription>
            Complete list of HOAs with regional performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <HOAFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <HOAsTable 
            hoas={mockHOAs}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Create HOA Dialog */}
      <CreateHOADialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

export default function HOAsPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.WORKFORCE_READ]}
    >
      <DashboardShell>
        <HOAsContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}