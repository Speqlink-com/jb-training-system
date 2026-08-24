"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { TrainingsTable } from "@/components/training/trainings-table";
import { TrainingFilters } from "@/components/training/training-filters";
import { CreateTrainingDialog } from "@/components/training/create-training-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Permission } from "@/config/permissions";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { 
  GraduationCap, 
  Plus, 
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download
} from "lucide-react";

// Mock training data - replace with API calls
const mockTrainings = [
  {
    id: "1",
    title: "AML & Compliance Training",
    description: "Anti-Money Laundering and compliance regulations for financial services",
    category: "SPECIALISED" as keyof typeof TRAINING_CATEGORIES,
    subCategory: "AML",
    trainer: {
      id: "1",
      firstName: "John",
      lastName: "Mwangi",
      email: "john.mwangi@company.com"
    },
    scheduledDate: "2024-08-28T10:00:00Z",
    duration: 4,
    location: "Nairobi CBD Training Center",
    branchId: "1",
    branch: { id: "1", name: "Nairobi CBD", code: "NCB" },
    expectedManpower: 120,
    actualAttendance: 104,
    attendanceRate: 87,
    productivity: 91,
    averageTicketSize: 143000,
    status: "COMPLETED" as const,
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-28T15:00:00Z",
  },
  {
    id: "2",
    title: "Product Mix Training",
    description: "Comprehensive training on insurance product portfolio and sales techniques",
    category: "EXISTING_TARGETED" as keyof typeof TRAINING_CATEGORIES,
    subCategory: null,
    trainer: {
      id: "2",
      firstName: "Sarah",
      lastName: "Wanjiku", 
      email: "sarah.wanjiku@company.com"
    },
    scheduledDate: "2024-09-05T09:00:00Z",
    duration: 6,
    location: "Westlands Branch",
    branchId: "2",
    branch: { id: "2", name: "Westlands", code: "WLD" },
    expectedManpower: 85,
    actualAttendance: null,
    attendanceRate: null,
    productivity: null,
    averageTicketSize: null,
    status: "SCHEDULED" as const,
    createdAt: "2024-08-10T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
  {
    id: "3",
    title: "New Agent Induction",
    description: "Orientation and basic training program for newly appointed agents",
    category: "NEW_AGENTS" as keyof typeof TRAINING_CATEGORIES,
    subCategory: null,
    trainer: {
      id: "3",
      firstName: "Peter",
      lastName: "Kimani",
      email: "peter.kimani@company.com"
    },
    scheduledDate: "2024-09-10T08:00:00Z",
    duration: 8,
    location: "Head Office Training Facility",
    branchId: null,
    branch: null,
    expectedManpower: 45,
    actualAttendance: null,
    attendanceRate: null,
    productivity: null,
    averageTicketSize: null,
    status: "SCHEDULED" as const,
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-08-25T00:00:00Z",
  },
  {
    id: "4",
    title: "Digital Transformation Workshop",
    description: "Training on digital sales platforms and customer engagement tools",
    category: "ALTERNATIVE_DISTRIBUTION" as keyof typeof TRAINING_CATEGORIES,
    subCategory: "Digital",
    trainer: {
      id: "4",
      firstName: "Grace",
      lastName: "Akinyi",
      email: "grace.akinyi@company.com"
    },
    scheduledDate: "2024-08-20T13:00:00Z",
    duration: 5,
    location: "Virtual (Zoom)",
    branchId: null,
    branch: null,
    expectedManpower: 200,
    actualAttendance: 185,
    attendanceRate: 93,
    productivity: 88,
    averageTicketSize: 165000,
    status: "COMPLETED" as const,
    createdAt: "2024-07-25T00:00:00Z",
    updatedAt: "2024-08-20T18:00:00Z",
  },
];

function TrainingsContent() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    trainer: "",
    branch: "",
    status: "",
    dateRange: { start: "", end: "" },
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalTrainings = mockTrainings.length;
  const scheduledTrainings = mockTrainings.filter(t => t.status === "SCHEDULED").length;
  const completedTrainings = mockTrainings.filter(t => t.status === "COMPLETED").length;
  const averageAttendance = Math.round(
    mockTrainings
      .filter(t => t.attendanceRate !== null)
      .reduce((sum, t) => sum + (t.attendanceRate || 0), 0) / 
    mockTrainings.filter(t => t.attendanceRate !== null).length
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">
            Manage training sessions, track attendance, and monitor effectiveness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Training
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Programs"
          value={totalTrainings.toString()}
          description="All training programs"
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Scheduled"
          value={scheduledTrainings.toString()}
          description="Upcoming sessions"
          icon={Calendar}
        />
        <StatCard
          title="Completed"
          value={completedTrainings.toString()}
          description="Finished sessions"
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Avg Attendance"
          value={`${averageAttendance}%`}
          description="Attendance rate"
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Training Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Training Categories</CardTitle>
          <CardDescription>
            Overview of training programs by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(TRAINING_CATEGORIES).map(([key, value]) => {
              const categoryTrainings = mockTrainings.filter(t => t.category === key);
              return (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{value}</h4>
                    <span className="text-2xl font-bold text-primary">
                      {categoryTrainings.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {categoryTrainings.filter(t => t.status === "SCHEDULED").length} upcoming
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Training Programs</CardTitle>
          <CardDescription>
            Complete list of training sessions with status and attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrainingFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <TrainingsTable 
            trainings={mockTrainings}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Create Training Dialog */}
      <CreateTrainingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

export default function TrainingsPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.TRAININGS_READ]}
    >
      <DashboardShell>
        <TrainingsContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}