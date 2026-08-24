"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { AgentHeader } from "@/components/workforce/agent-header";
import { AgentOverview } from "@/components/workforce/agent-overview";
import { AgentTrainings } from "@/components/workforce/agent-trainings";
import { AgentPerformance } from "@/components/workforce/agent-performance";
import { AgentDocuments } from "@/components/workforce/agent-documents";
import { AgentActivity } from "@/components/workforce/agent-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Permission } from "@/config/permissions";

// Mock agent data - replace with API call
const mockAgent = {
  id: "1",
  agentId: "AGT-004821",
  firstName: "John",
  lastName: "Kamau",
  email: "john.kamau@company.com",
  phone: "+254712345678",
  nationalId: "12345678",
  kraPin: "A001234567P",
  branch: { 
    id: "1", 
    name: "Nairobi CBD", 
    code: "NCB",
    address: "Kenyatta Avenue, Nairobi"
  },
  sm: { 
    id: "1", 
    firstName: "Jane", 
    lastName: "Doe",
    email: "jane.doe@company.com",
    phone: "+254712345677"
  },
  hoa: { 
    id: "1", 
    firstName: "Peter", 
    lastName: "Mwangi",
    email: "peter.mwangi@company.com", 
    phone: "+254712345676"
  },
  appointmentDate: "2025-01-12",
  probationEndDate: "2025-07-12",
  contractType: "Permanent",
  isActive: true,
  production: { 
    monthlyProduction: 4800000, 
    averageTicketSize: 185000, 
    productivity: 94,
    ytdProduction: 28800000,
    targetAchievement: 112
  },
  trainingCompliance: 89,
  pendingTrainings: 2,
  completedTrainings: 17,
  totalTrainings: 19,
  lastTrainingDate: "2024-08-15",
  nextTrainingDate: "2024-08-28",
  createdAt: "2024-12-01T00:00:00Z",
  updatedAt: "2024-08-23T00:00:00Z",
  address: {
    street: "123 Moi Avenue",
    city: "Nairobi", 
    county: "Nairobi",
    postalCode: "00100"
  },
  emergencyContact: {
    name: "Jane Kamau",
    relationship: "Spouse",
    phone: "+254712345681"
  },
  bankDetails: {
    accountNumber: "1234567890",
    bankName: "KCB Bank",
    branchCode: "001"
  }
};

function AgentProfileContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, fetch agent data based on params.id
  const agent = mockAgent;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/agents">Agents</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{agent.firstName} {agent.lastName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Agent Header */}
      <AgentHeader agent={agent} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trainings">Trainings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AgentOverview agent={agent} />
        </TabsContent>

        <TabsContent value="trainings">
          <AgentTrainings agentId={agent.id} />
        </TabsContent>

        <TabsContent value="performance">
          <AgentPerformance agent={agent} />
        </TabsContent>

        <TabsContent value="attendance">
          <div className="text-center py-12 text-muted-foreground">
            Attendance tracking component coming soon...
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <AgentDocuments agentId={agent.id} />
        </TabsContent>

        <TabsContent value="activity">
          <AgentActivity agentId={agent.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AgentProfilePage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.AGENTS_READ]}
    >
      <DashboardShell>
        <AgentProfileContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}