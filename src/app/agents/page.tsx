"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { AgentsTable } from "@/components/workforce/agents-table";
import { AgentsFilters } from "@/components/workforce/agents-filters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Permission } from "@/config/permissions";
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Download
} from "lucide-react";

// Mock data for agents - replace with API calls
const mockAgents = [
  {
    id: "1",
    agentId: "AGT-004821",
    firstName: "John",
    lastName: "Kamau",
    email: "john.kamau@company.com",
    phone: "+254712345678",
    branch: { id: "1", name: "Nairobi CBD", code: "NCB" },
    sm: { id: "1", firstName: "Jane", lastName: "Doe" },
    hoa: { id: "1", firstName: "Peter", lastName: "Mwangi" },
    appointmentDate: "2025-01-12",
    isActive: true,
    production: { monthlyProduction: 4800000, averageTicketSize: 185000, productivity: 94 },
    trainingCompliance: 89,
    pendingTrainings: 2,
    createdAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "2", 
    agentId: "AGT-004822",
    firstName: "Mary",
    lastName: "Wanjiku",
    email: "mary.wanjiku@company.com",
    phone: "+254712345679",
    branch: { id: "1", name: "Nairobi CBD", code: "NCB" },
    sm: { id: "1", firstName: "Jane", lastName: "Doe" },
    hoa: { id: "1", firstName: "Peter", lastName: "Mwangi" },
    appointmentDate: "2024-11-20",
    isActive: true,
    production: { monthlyProduction: 3900000, averageTicketSize: 175000, productivity: 91 },
    trainingCompliance: 95,
    pendingTrainings: 1,
    createdAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "3",
    agentId: "AGT-004823", 
    firstName: "Brian",
    lastName: "Otieno",
    email: "brian.otieno@company.com",
    phone: "+254712345680",
    branch: { id: "2", name: "Westlands", code: "WLD" },
    sm: { id: "2", firstName: "James", lastName: "Ochieng" },
    hoa: { id: "1", firstName: "Peter", lastName: "Mwangi" },
    appointmentDate: "2024-10-15",
    isActive: true,
    production: { monthlyProduction: 3200000, averageTicketSize: 160000, productivity: 84 },
    trainingCompliance: 78,
    pendingTrainings: 4,
    createdAt: "2024-10-01T00:00:00Z",
  },
];

function AgentsContent() {
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    sm: "", 
    hoa: "",
    compliance: "",
  });

  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(a => a.isActive).length;
  const averageCompliance = Math.round(
    mockAgents.reduce((sum, agent) => sum + agent.trainingCompliance, 0) / totalAgents
  );
  const lowComplianceAgents = mockAgents.filter(a => a.trainingCompliance < 85).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor agent performance and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Agents"
          value={totalAgents.toString()}
          description="Active and inactive agents"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Agents"
          value={activeAgents.toString()}
          description="Currently active"
          icon={CheckCircle}
        />
        <StatCard
          title="Avg Compliance"
          value={`${averageCompliance}%`}
          description="Training compliance rate"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Low Compliance"
          value={lowComplianceAgents.toString()}
          description="Below 85% compliance"
          icon={AlertTriangle}
          trend={{ value: -1, isPositive: true }}
        />
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Directory</CardTitle>
          <CardDescription>
            View and manage all agents in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AgentsFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <AgentsTable 
            agents={mockAgents}
            filters={filters}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.AGENTS_READ]}
    >
      <DashboardShell>
        <AgentsContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}