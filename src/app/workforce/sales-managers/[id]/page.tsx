"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { SalesManagerHeader } from "@/components/workforce/sales-manager-header";
import { SalesManagerOverview } from "@/components/workforce/sales-manager-overview";
import { SalesManagerTeam } from "@/components/workforce/sales-manager-team";
import { SalesManagerPerformance } from "@/components/workforce/sales-manager-performance";
import { SalesManagerActivity } from "@/components/workforce/sales-manager-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permission } from "@/config/permissions";

// Mock data - in real app, fetch from API
const mockSalesManager = {
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
    customerSatisfaction: 4.7,
    monthlyHistory: [
      { month: "Jan", target: 15000000, achievement: 14500000, rate: 97 },
      { month: "Feb", target: 15000000, achievement: 13800000, rate: 92 },
      { month: "Mar", target: 15000000, achievement: 16200000, rate: 108 },
      { month: "Apr", target: 15000000, achievement: 15800000, rate: 105 },
      { month: "May", target: 15000000, achievement: 14100000, rate: 94 },
      { month: "Jun", target: 15000000, achievement: 15600000, rate: 104 },
      { month: "Jul", target: 15000000, achievement: 13900000, rate: 93 },
      { month: "Aug", target: 15000000, achievement: 14200000, rate: 95 },
    ]
  },
  certifications: [
    { 
      id: "1",
      name: "Leadership Training", 
      status: "COMPLETED" as const, 
      completedDate: "2024-03-15T00:00:00Z",
      expiryDate: "2025-03-15T00:00:00Z",
      issuer: "Management Institute"
    },
    { 
      id: "2",
      name: "Sales Management", 
      status: "COMPLETED" as const, 
      completedDate: "2023-12-31T00:00:00Z",
      expiryDate: "2024-12-31T00:00:00Z",
      issuer: "Sales Academy"
    },
    { 
      id: "3",
      name: "Digital Transformation", 
      status: "PENDING" as const, 
      completedDate: null,
      expiryDate: null,
      issuer: "Tech Institute"
    }
  ],
  team: [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      employeeId: "AG001",
      status: "ACTIVE",
      monthlyTarget: 500000,
      monthlyAchievement: 480000,
      achievementRate: 96,
      trainingCompliance: 95,
      lastActivity: "2024-08-23T10:00:00Z"
    },
    {
      id: "2", 
      firstName: "Jane",
      lastName: "Smith",
      employeeId: "AG002",
      status: "ACTIVE",
      monthlyTarget: 450000,
      monthlyAchievement: 510000,
      achievementRate: 113,
      trainingCompliance: 100,
      lastActivity: "2024-08-23T09:30:00Z"
    },
    // Add more team members as needed
  ],
  activities: [
    {
      id: "1",
      type: "TEAM_MEETING",
      description: "Conducted weekly team performance review",
      timestamp: "2024-08-23T10:00:00Z",
      details: {
        attendees: 42,
        duration: 90,
        topics: ["Monthly targets", "Training updates", "New products"]
      }
    },
    {
      id: "2",
      type: "TARGET_REVIEW",
      description: "Updated monthly targets for Q4",
      timestamp: "2024-08-22T14:30:00Z",
      details: {
        oldTarget: 15000000,
        newTarget: 16000000,
        reason: "Market expansion"
      }
    },
    {
      id: "3",
      type: "TRAINING_COMPLETION",
      description: "Completed Digital Transformation certification",
      timestamp: "2024-08-21T16:00:00Z",
      details: {
        certification: "Digital Transformation",
        score: 94,
        validUntil: "2025-08-21"
      }
    }
  ]
};

interface SalesManagerProfilePageProps {
  params: {
    id: string;
  };
}

function SalesManagerProfileContent({ salesManager }: { salesManager: typeof mockSalesManager }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <SalesManagerHeader salesManager={salesManager} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team ({salesManager.teamSize})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SalesManagerOverview salesManager={salesManager} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <SalesManagerTeam 
            salesManagerId={salesManager.id}
            team={salesManager.team} 
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SalesManagerPerformance 
            salesManagerId={salesManager.id}
            performance={salesManager.performance} 
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <SalesManagerActivity 
            salesManagerId={salesManager.id}
            activities={salesManager.activities} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SalesManagerProfilePage({ params }: SalesManagerProfilePageProps) {
  // In a real app, fetch sales manager data based on params.id
  const salesManager = mockSalesManager;
  
  if (!salesManager) {
    notFound();
  }

  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.WORKFORCE_READ]}
    >
      <DashboardShell>
        <SalesManagerProfileContent salesManager={salesManager} />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}