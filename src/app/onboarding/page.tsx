"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { CandidatesTable } from "@/components/onboarding/candidates-table";
import { CandidateFilters } from "@/components/onboarding/candidate-filters";
import { AddCandidateDialog } from "@/components/onboarding/add-candidate-dialog";
import { OnboardingPipeline } from "@/components/onboarding/onboarding-pipeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Permission } from "@/config/permissions";
import { 
  Users, 
  Plus, 
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";

// Mock candidates data
const mockCandidates = [
  {
    id: "c1",
    firstName: "James",
    lastName: "Wanjiku",
    email: "james.wanjiku@gmail.com",
    phone: "+254701234567",
    idNumber: "12345678",
    applicationDate: "2024-08-15T00:00:00Z",
    status: "PENDING_REVIEW" as const,
    stage: "APPLICATION_SUBMITTED" as const,
    assignedTo: {
      id: "sm1",
      name: "David Kimani",
      role: "Sales Manager"
    },
    branch: {
      id: "1",
      name: "Nairobi CBD",
      code: "NCB"
    },
    region: "Central",
    education: "Bachelor's Degree",
    experience: "2 years in sales",
    referredBy: "John Doe (Agent)",
    documents: {
      cv: { uploaded: true, verified: false },
      idCopy: { uploaded: true, verified: true },
      certificates: { uploaded: false, verified: false },
      recommendation: { uploaded: true, verified: true }
    },
    interviews: [
      {
        id: "1",
        type: "INITIAL_SCREENING",
        scheduledDate: "2024-08-20T10:00:00Z",
        status: "COMPLETED",
        interviewer: "David Kimani",
        score: 85,
        notes: "Good communication skills, enthusiastic about sales"
      }
    ],
    nextAction: "Schedule final interview",
    expectedStartDate: "2024-09-01T00:00:00Z",
    timeline: [
      {
        id: "1",
        action: "Application submitted",
        timestamp: "2024-08-15T09:00:00Z",
        user: "System"
      },
      {
        id: "2",
        action: "Initial review completed",
        timestamp: "2024-08-16T14:30:00Z",
        user: "David Kimani"
      },
      {
        id: "3",
        action: "Interview scheduled",
        timestamp: "2024-08-18T11:00:00Z",
        user: "David Kimani"
      }
    ]
  },
  {
    id: "c2",
    firstName: "Mary",
    lastName: "Achieng",
    email: "mary.achieng@gmail.com",
    phone: "+254712345678",
    idNumber: "87654321",
    applicationDate: "2024-08-10T00:00:00Z",
    status: "APPROVED" as const,
    stage: "OFFER_EXTENDED" as const,
    assignedTo: {
      id: "sm2",
      name: "Grace Wanjiru",
      role: "Sales Manager"
    },
    branch: {
      id: "2",
      name: "Westlands",
      code: "WLD"
    },
    region: "Central",
    education: "Diploma in Business",
    experience: "3 years in insurance",
    referredBy: null,
    documents: {
      cv: { uploaded: true, verified: true },
      idCopy: { uploaded: true, verified: true },
      certificates: { uploaded: true, verified: true },
      recommendation: { uploaded: true, verified: true }
    },
    interviews: [
      {
        id: "1",
        type: "INITIAL_SCREENING",
        scheduledDate: "2024-08-12T14:00:00Z",
        status: "COMPLETED",
        interviewer: "Grace Wanjiru",
        score: 92,
        notes: "Excellent candidate with relevant experience"
      },
      {
        id: "2",
        type: "FINAL_INTERVIEW",
        scheduledDate: "2024-08-18T10:00:00Z",
        status: "COMPLETED",
        interviewer: "Regional HOA",
        score: 88,
        notes: "Strong technical knowledge, good cultural fit"
      }
    ],
    nextAction: "Await offer acceptance",
    expectedStartDate: "2024-09-02T00:00:00Z",
    timeline: [
      {
        id: "1",
        action: "Application submitted",
        timestamp: "2024-08-10T10:30:00Z",
        user: "System"
      },
      {
        id: "2",
        action: "Documents verified",
        timestamp: "2024-08-11T15:20:00Z",
        user: "Grace Wanjiru"
      },
      {
        id: "3",
        action: "Final interview completed",
        timestamp: "2024-08-18T11:00:00Z",
        user: "Regional HOA"
      },
      {
        id: "4",
        action: "Offer extended",
        timestamp: "2024-08-20T09:00:00Z",
        user: "Grace Wanjiru"
      }
    ]
  },
  {
    id: "c3",
    firstName: "Peter",
    lastName: "Mwangi",
    email: "peter.mwangi@gmail.com",
    phone: "+254723456789",
    idNumber: "11223344",
    applicationDate: "2024-08-18T00:00:00Z",
    status: "REJECTED" as const,
    stage: "APPLICATION_REJECTED" as const,
    assignedTo: {
      id: "sm3",
      name: "Joseph Mwangi",
      role: "Sales Manager"
    },
    branch: {
      id: "3",
      name: "Mombasa",
      code: "MSA"
    },
    region: "Coast",
    education: "High School Certificate",
    experience: "No relevant experience",
    referredBy: null,
    documents: {
      cv: { uploaded: true, verified: true },
      idCopy: { uploaded: false, verified: false },
      certificates: { uploaded: false, verified: false },
      recommendation: { uploaded: false, verified: false }
    },
    interviews: [
      {
        id: "1",
        type: "INITIAL_SCREENING",
        scheduledDate: "2024-08-21T15:00:00Z",
        status: "COMPLETED",
        interviewer: "Joseph Mwangi",
        score: 45,
        notes: "Lacks necessary experience and qualifications"
      }
    ],
    nextAction: "Application closed",
    expectedStartDate: null,
    timeline: [
      {
        id: "1",
        action: "Application submitted",
        timestamp: "2024-08-18T16:45:00Z",
        user: "System"
      },
      {
        id: "2",
        action: "Initial screening failed",
        timestamp: "2024-08-21T16:00:00Z",
        user: "Joseph Mwangi"
      },
      {
        id: "3",
        action: "Application rejected",
        timestamp: "2024-08-21T16:30:00Z",
        user: "Joseph Mwangi"
      }
    ]
  },
  {
    id: "c4",
    firstName: "Sarah",
    lastName: "Njeri",
    email: "sarah.njeri@gmail.com",
    phone: "+254734567890",
    idNumber: "55667788",
    applicationDate: "2024-08-20T00:00:00Z",
    status: "ONBOARDED" as const,
    stage: "ACTIVE_AGENT" as const,
    assignedTo: {
      id: "sm1",
      name: "David Kimani",
      role: "Sales Manager"
    },
    branch: {
      id: "1",
      name: "Nairobi CBD",
      code: "NCB"
    },
    region: "Central",
    education: "Bachelor's Degree in Business",
    experience: "5 years in financial services",
    referredBy: "Regional HOA",
    documents: {
      cv: { uploaded: true, verified: true },
      idCopy: { uploaded: true, verified: true },
      certificates: { uploaded: true, verified: true },
      recommendation: { uploaded: true, verified: true }
    },
    interviews: [
      {
        id: "1",
        type: "INITIAL_SCREENING",
        scheduledDate: "2024-08-21T09:00:00Z",
        status: "COMPLETED",
        interviewer: "David Kimani",
        score: 95,
        notes: "Outstanding candidate with excellent background"
      },
      {
        id: "2",
        type: "FINAL_INTERVIEW",
        scheduledDate: "2024-08-22T14:00:00Z",
        status: "COMPLETED",
        interviewer: "Regional HOA",
        score: 93,
        notes: "Perfect fit for the organization"
      }
    ],
    nextAction: "Begin agent training",
    expectedStartDate: "2024-08-25T00:00:00Z",
    agentId: "AG123",
    timeline: [
      {
        id: "1",
        action: "Application submitted",
        timestamp: "2024-08-20T08:15:00Z",
        user: "System"
      },
      {
        id: "2",
        action: "Fast-tracked for interview",
        timestamp: "2024-08-20T10:00:00Z",
        user: "David Kimani"
      },
      {
        id: "3",
        action: "Agent profile created",
        timestamp: "2024-08-23T09:00:00Z",
        user: "System"
      },
      {
        id: "4",
        action: "Onboarding completed",
        timestamp: "2024-08-23T16:00:00Z",
        user: "David Kimani"
      }
    ]
  }
];

function OnboardingContent() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    stage: "",
    region: "",
    branch: "",
    assignedTo: "",
    dateRange: { start: "", end: "" },
  });
  const [showAddDialog, setShowAddDialog] = useState(false);

  const totalCandidates = mockCandidates.length;
  const pendingReview = mockCandidates.filter(c => c.status === "PENDING_REVIEW").length;
  const approved = mockCandidates.filter(c => c.status === "APPROVED").length;
  const onboarded = mockCandidates.filter(c => c.status === "ONBOARDED").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Joiners Onboarding</h1>
          <p className="text-muted-foreground">
            Manage candidate applications, interviews, and agent onboarding process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Pipeline
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Candidates"
          value={totalCandidates.toString()}
          description="All applications"
          icon={Users}
        />
        <StatCard
          title="Pending Review"
          value={pendingReview.toString()}
          description="Awaiting decision"
          icon={Clock}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Approved"
          value={approved.toString()}
          description="Ready to onboard"
          icon={CheckCircle}
          trend={{ value: 1, isPositive: true }}
        />
        <StatCard
          title="Onboarded"
          value={onboarded.toString()}
          description="Active agents"
          icon={UserCheck}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Onboarding Pipeline */}
      <OnboardingPipeline candidates={mockCandidates} />

      {/* Monthly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Applications</CardTitle>
            <CardDescription>
              New candidate applications by region this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(mockCandidates.map(c => c.region))).map(region => {
                const regionCandidates = mockCandidates.filter(c => c.region === region);
                const regionApproved = regionCandidates.filter(c => c.status === "APPROVED" || c.status === "ONBOARDED").length;
                
                return (
                  <div key={region} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{region} Region</h4>
                      <p className="text-sm text-muted-foreground">
                        {regionCandidates.length} applications • {regionApproved} approved
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{regionCandidates.length}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((regionApproved / regionCandidates.length) * 100)}% approval rate
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest onboarding activities and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCandidates
                .flatMap(candidate => 
                  candidate.timeline.map(event => ({
                    ...event,
                    candidateName: `${candidate.firstName} ${candidate.lastName}`,
                    candidateId: candidate.id
                  }))
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5)
                .map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-1 bg-primary/10 rounded-full mt-1">
                      <FileText className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.candidateName} • {activity.user}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            Complete list of candidates with application status and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CandidateFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <CandidatesTable 
            candidates={mockCandidates}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.WORKFORCE_READ]}
    >
      <DashboardShell>
        <OnboardingContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}