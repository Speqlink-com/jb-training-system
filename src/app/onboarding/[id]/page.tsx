"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { CandidateHeader } from "@/components/onboarding/candidate-header";
import { CandidateOverview } from "@/components/onboarding/candidate-overview";
import { CandidateDocuments } from "@/components/onboarding/candidate-documents";
import { CandidateInterviews } from "@/components/onboarding/candidate-interviews";
import { CandidateTimeline } from "@/components/onboarding/candidate-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permission } from "@/config/permissions";

// Mock candidate data - in real app, fetch from API
const mockCandidate = {
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
    role: "Sales Manager",
    email: "david.kimani@company.com",
    phone: "+254712345678"
  },
  branch: {
    id: "1",
    name: "Nairobi CBD",
    code: "NCB"
  },
  region: "Central",
  education: "Bachelor's Degree in Business Administration",
  experience: "2 years in retail sales at Nakumatt, 1 year as insurance agent trainee at Jubilee Insurance",
  referredBy: "John Doe (Agent AG087)",
  expectedStartDate: "2024-09-01T00:00:00Z",
  documents: {
    cv: { 
      uploaded: true, 
      verified: false, 
      uploadedAt: "2024-08-15T09:30:00Z",
      fileName: "James_Wanjiku_CV.pdf",
      fileSize: "245KB"
    },
    idCopy: { 
      uploaded: true, 
      verified: true, 
      uploadedAt: "2024-08-15T09:32:00Z",
      fileName: "ID_Copy.pdf",
      fileSize: "180KB",
      verifiedAt: "2024-08-16T10:15:00Z",
      verifiedBy: "David Kimani"
    },
    certificates: { 
      uploaded: false, 
      verified: false,
      uploadedAt: null,
      fileName: null,
      fileSize: null
    },
    recommendation: { 
      uploaded: true, 
      verified: true, 
      uploadedAt: "2024-08-15T09:35:00Z",
      fileName: "Recommendation_Letter.pdf",
      fileSize: "156KB",
      verifiedAt: "2024-08-16T10:20:00Z",
      verifiedBy: "David Kimani"
    }
  },
  interviews: [
    {
      id: "1",
      type: "INITIAL_SCREENING",
      scheduledDate: "2024-08-20T10:00:00Z",
      status: "COMPLETED",
      interviewer: "David Kimani",
      interviewerRole: "Sales Manager",
      location: "Nairobi CBD Office",
      duration: 45,
      score: 85,
      notes: "Candidate shows excellent communication skills and genuine enthusiasm for sales. Has relevant retail experience and good understanding of customer service. Recommended for next stage.",
      feedback: {
        communication: 9,
        enthusiasm: 9,
        experience: 7,
        knowledge: 8,
        overall: 8.5
      }
    }
  ],
  nextAction: "Schedule final interview with Regional HOA",
  timeline: [
    {
      id: "1",
      action: "Application submitted",
      description: "Candidate submitted online application with CV and supporting documents",
      timestamp: "2024-08-15T09:00:00Z",
      user: "System",
      type: "APPLICATION"
    },
    {
      id: "2",
      action: "Documents uploaded",
      description: "CV, ID copy, and recommendation letter uploaded successfully",
      timestamp: "2024-08-15T09:35:00Z",
      user: "James Wanjiku",
      type: "DOCUMENT"
    },
    {
      id: "3",
      action: "Application assigned",
      description: "Application assigned to David Kimani (Sales Manager) for review",
      timestamp: "2024-08-16T08:00:00Z",
      user: "System",
      type: "ASSIGNMENT"
    },
    {
      id: "4",
      action: "Initial review completed",
      description: "Documents reviewed and verified. Application approved for interview",
      timestamp: "2024-08-16T14:30:00Z",
      user: "David Kimani",
      type: "REVIEW"
    },
    {
      id: "5",
      action: "Interview scheduled",
      description: "Initial screening interview scheduled for August 20th",
      timestamp: "2024-08-18T11:00:00Z",
      user: "David Kimani",
      type: "INTERVIEW"
    },
    {
      id: "6",
      action: "Interview completed",
      description: "Initial screening completed with score of 85/100. Recommended for final interview",
      timestamp: "2024-08-20T10:45:00Z",
      user: "David Kimani",
      type: "INTERVIEW"
    }
  ],
  notes: [
    {
      id: "1",
      author: "David Kimani",
      authorRole: "Sales Manager",
      content: "Excellent candidate with strong retail background. Shows genuine interest in insurance industry.",
      timestamp: "2024-08-16T14:30:00Z",
      type: "REVIEW"
    },
    {
      id: "2",
      author: "David Kimani",
      authorRole: "Sales Manager", 
      content: "Interview went very well. Candidate demonstrated good product knowledge and sales aptitude. Recommend for final interview with HOA.",
      timestamp: "2024-08-20T11:00:00Z",
      type: "INTERVIEW"
    }
  ]
};

interface CandidateProfilePageProps {
  params: {
    id: string;
  };
}

function CandidateProfileContent({ candidate }: { candidate: typeof mockCandidate }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <CandidateHeader candidate={candidate} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CandidateOverview candidate={candidate} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <CandidateDocuments 
            candidateId={candidate.id}
            documents={candidate.documents} 
          />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <CandidateInterviews 
            candidateId={candidate.id}
            interviews={candidate.interviews}
            candidateName={`${candidate.firstName} ${candidate.lastName}`}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <CandidateTimeline 
            candidateId={candidate.id}
            timeline={candidate.timeline}
            notes={candidate.notes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  // In a real app, fetch candidate data based on params.id
  const candidate = mockCandidate;
  
  if (!candidate) {
    notFound();
  }

  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.WORKFORCE_READ]}
    >
      <DashboardShell>
        <CandidateProfileContent candidate={candidate} />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}