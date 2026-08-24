"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { TrainersTable } from "@/components/workforce/trainers-table";
import { TrainerFilters } from "@/components/workforce/trainer-filters";
import { CreateTrainerDialog } from "@/components/workforce/create-trainer-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Permission } from "@/config/permissions";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { 
  GraduationCap, 
  Plus, 
  Users,
  Calendar,
  Award,
  TrendingUp,
  Download,
  BookOpen,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock Trainers data
const mockTrainers = [
  {
    id: "t1",
    firstName: "John",
    lastName: "Mwangi",
    email: "john.mwangi@company.com",
    phone: "+254701111111",
    employeeId: "TR001",
    specializations: ["AML", "SPECIALISED", "EXISTING_TARGETED"],
    dateJoined: "2021-03-10T00:00:00Z",
    status: "ACTIVE" as const,
    totalTrainings: 24,
    activeTrainings: 3,
    completedTrainings: 21,
    totalParticipants: 1250,
    averageRating: 4.7,
    certificationLevel: "Senior Trainer",
    lastActivity: "2024-08-23T10:00:00Z",
    monthlyStats: {
      trainingsScheduled: 4,
      trainingsCompleted: 3,
      participantsTrained: 145,
      averageAttendance: 94,
      averageEffectiveness: 91
    },
    upcomingTrainings: [
      {
        id: "tr1",
        title: "AML & Compliance Training",
        scheduledDate: "2024-08-28T10:00:00Z",
        expectedParticipants: 120,
        location: "Nairobi CBD Training Center"
      },
      {
        id: "tr2",
        title: "Product Knowledge Update",
        scheduledDate: "2024-09-05T09:00:00Z",
        expectedParticipants: 85,
        location: "Westlands Branch"
      }
    ],
    certifications: [
      { name: "Certified Professional Trainer", status: "COMPLETED", expiryDate: "2025-03-10" },
      { name: "AML Specialist", status: "COMPLETED", expiryDate: "2024-12-15" },
      { name: "Digital Learning", status: "IN_PROGRESS", expiryDate: null }
    ]
  },
  {
    id: "t2",
    firstName: "Sarah",
    lastName: "Wanjiku",
    email: "sarah.wanjiku@company.com",
    phone: "+254702222222",
    employeeId: "TR002",
    specializations: ["EXISTING_TARGETED", "NEW_AGENTS", "PRODUCT_MIX"],
    dateJoined: "2022-07-15T00:00:00Z",
    status: "ACTIVE" as const,
    totalTrainings: 18,
    activeTrainings: 2,
    completedTrainings: 16,
    totalParticipants: 920,
    averageRating: 4.8,
    certificationLevel: "Senior Trainer",
    lastActivity: "2024-08-22T16:30:00Z",
    monthlyStats: {
      trainingsScheduled: 3,
      trainingsCompleted: 2,
      participantsTrained: 98,
      averageAttendance: 97,
      averageEffectiveness: 94
    },
    upcomingTrainings: [
      {
        id: "tr3",
        title: "New Agent Induction",
        scheduledDate: "2024-09-10T08:00:00Z",
        expectedParticipants: 45,
        location: "Head Office Training Facility"
      }
    ],
    certifications: [
      { name: "Certified Professional Trainer", status: "COMPLETED", expiryDate: "2025-07-15" },
      { name: "Product Specialist", status: "COMPLETED", expiryDate: "2025-01-20" },
      { name: "Leadership Development", status: "COMPLETED", expiryDate: "2024-11-30" }
    ]
  },
  {
    id: "t3",
    firstName: "Peter",
    lastName: "Kimani",
    email: "peter.kimani@company.com",
    phone: "+254703333333",
    employeeId: "TR003",
    specializations: ["NEW_AGENTS", "ALTERNATIVE_DISTRIBUTION"],
    dateJoined: "2023-01-20T00:00:00Z",
    status: "ACTIVE" as const,
    totalTrainings: 12,
    activeTrainings: 1,
    completedTrainings: 11,
    totalParticipants: 580,
    averageRating: 4.5,
    certificationLevel: "Trainer",
    lastActivity: "2024-08-21T14:15:00Z",
    monthlyStats: {
      trainingsScheduled: 2,
      trainingsCompleted: 1,
      participantsTrained: 52,
      averageAttendance: 89,
      averageEffectiveness: 87
    },
    upcomingTrainings: [
      {
        id: "tr4",
        title: "Digital Transformation Workshop",
        scheduledDate: "2024-09-15T13:00:00Z",
        expectedParticipants: 200,
        location: "Virtual (Zoom)"
      }
    ],
    certifications: [
      { name: "Certified Professional Trainer", status: "IN_PROGRESS", expiryDate: null },
      { name: "Digital Trainer", status: "COMPLETED", expiryDate: "2025-01-20" },
      { name: "New Hire Specialist", status: "COMPLETED", expiryDate: "2024-10-15" }
    ]
  },
  {
    id: "t4",
    firstName: "Grace",
    lastName: "Akinyi",
    email: "grace.akinyi@company.com",
    phone: "+254704444444",
    employeeId: "TR004",
    specializations: ["ALTERNATIVE_DISTRIBUTION", "SPECIALISED"],
    dateJoined: "2022-11-05T00:00:00Z",
    status: "ACTIVE" as const,
    totalTrainings: 15,
    activeTrainings: 2,
    completedTrainings: 13,
    totalParticipants: 750,
    averageRating: 4.6,
    certificationLevel: "Senior Trainer",
    lastActivity: "2024-08-23T11:20:00Z",
    monthlyStats: {
      trainingsScheduled: 3,
      trainingsCompleted: 2,
      participantsTrained: 112,
      averageAttendance: 92,
      averageEffectiveness: 89
    },
    upcomingTrainings: [
      {
        id: "tr5",
        title: "Technology Integration",
        scheduledDate: "2024-09-12T10:00:00Z",
        expectedParticipants: 75,
        location: "Tech Hub"
      }
    ],
    certifications: [
      { name: "Certified Professional Trainer", status: "COMPLETED", expiryDate: "2025-11-05" },
      { name: "Technology Specialist", status: "COMPLETED", expiryDate: "2025-05-15" },
      { name: "Advanced Analytics", status: "PENDING", expiryDate: null }
    ]
  }
];

function TrainersContent() {
  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    status: "",
    certificationLevel: "",
    ratingRange: { min: "", max: "" },
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalTrainers = mockTrainers.length;
  const activeTrainers = mockTrainers.filter(t => t.status === "ACTIVE").length;
  const totalTrainings = mockTrainers.reduce((sum, t) => sum + t.totalTrainings, 0);
  const totalParticipants = mockTrainers.reduce((sum, t) => sum + t.totalParticipants, 0);
  const averageRating = Number(
    (mockTrainers.reduce((sum, t) => sum + t.averageRating, 0) / mockTrainers.length).toFixed(1)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Team</h1>
          <p className="text-muted-foreground">
            Manage trainers, track training delivery, and monitor effectiveness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trainer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Trainers"
          value={totalTrainers.toString()}
          description="Active training team"
          icon={GraduationCap}
        />
        <StatCard
          title="Active Trainers"
          value={activeTrainers.toString()}
          description="Currently available"
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Total Trainings"
          value={totalTrainings.toString()}
          description="Sessions delivered"
          icon={BookOpen}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Participants"
          value={totalParticipants.toString()}
          description="People trained"
          icon={Users}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Avg Rating"
          value={`${averageRating}/5`}
          description="Training quality"
          icon={Award}
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Training Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Training Specializations</CardTitle>
          <CardDescription>
            Trainer expertise across different training categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(TRAINING_CATEGORIES).map(([key, value]) => {
              const specialistCount = mockTrainers.filter(t => 
                t.specializations.includes(key as any)
              ).length;
              
              return (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{value}</h4>
                    <span className="text-2xl font-bold text-primary">
                      {specialistCount}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {specialistCount > 0 ? "Available specialists" : "No specialists"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Training Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Activity</CardTitle>
            <CardDescription>
              Current and upcoming training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrainers
                .filter(trainer => trainer.upcomingTrainings.length > 0)
                .map(trainer => (
                  trainer.upcomingTrainings.map(training => (
                    <div key={training.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{training.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {trainer.firstName} {trainer.lastName} • {training.expectedParticipants} participants
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(training.scheduledDate).toLocaleDateString()} at {training.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {new Date(training.scheduledDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Highest rated trainers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrainers
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 4)
                .map((trainer, index) => (
                  <div key={trainer.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {trainer.firstName} {trainer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {trainer.certificationLevel} • {trainer.totalTrainings} sessions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{trainer.averageRating}/5</p>
                      <p className="text-sm text-muted-foreground">
                        {trainer.totalParticipants} trained
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trainers</CardTitle>
          <CardDescription>
            Complete list of trainers with performance and specialization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrainerFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <TrainersTable 
            trainers={mockTrainers}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Create Trainer Dialog */}
      <CreateTrainerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

export default function TrainersPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.TRAININGS_READ]}
    >
      <DashboardShell>
        <TrainersContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}