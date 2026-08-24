"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Eye, 
  UserCheck, 
  CheckCircle, 
  Users,
  Clock,
  XCircle,
  TrendingUp
} from "lucide-react";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ONBOARDED";
  stage: "APPLICATION_SUBMITTED" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "OFFER_EXTENDED" | "APPLICATION_REJECTED" | "ACTIVE_AGENT";
  applicationDate: string;
  region: string;
}

interface OnboardingPipelineProps {
  candidates: Candidate[];
}

const pipelineStages = [
  {
    id: "APPLICATION_SUBMITTED",
    title: "Applications",
    description: "New submissions",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "UNDER_REVIEW",
    title: "Under Review",
    description: "Being evaluated",
    icon: Eye,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "INTERVIEW_SCHEDULED",
    title: "Interviews",
    description: "Scheduled meetings",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "OFFER_EXTENDED",
    title: "Offers",
    description: "Extended offers",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "ACTIVE_AGENT",
    title: "Active Agents",
    description: "Successfully onboarded",
    icon: UserCheck,
    color: "bg-emerald-100 text-emerald-700",
  },
];

export function OnboardingPipeline({ candidates }: OnboardingPipelineProps) {
  const getCandidatesInStage = (stageId: string) => {
    return candidates.filter(candidate => candidate.stage === stageId);
  };

  const getTotalActiveStages = () => {
    return candidates.filter(c => c.stage !== "APPLICATION_REJECTED").length;
  };

  const getConversionRate = () => {
    const total = candidates.length;
    const onboarded = candidates.filter(c => c.status === "ONBOARDED").length;
    return total > 0 ? Math.round((onboarded / total) * 100) : 0;
  };

  const getRejectedCount = () => {
    return candidates.filter(c => c.status === "REJECTED").length;
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Onboarding Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {pipelineStages.map((stage, index) => {
              const stageIcon = stage.icon;
              const candidatesInStage = getCandidatesInStage(stage.id);
              const count = candidatesInStage.length;
              
              return (
                <div key={stage.id} className="relative">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stage.color} mb-3`}>
                      <stageIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm">{stage.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{stage.description}</p>
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    {count > 0 && (
                      <div className="mt-2 space-y-1">
                        {candidatesInStage.slice(0, 3).map(candidate => (
                          <div key={candidate.id} className="text-xs text-muted-foreground truncate">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                        ))}
                        {candidatesInStage.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{candidatesInStage.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Arrow to next stage */}
                  {index < pipelineStages.length - 1 && (
                    <div className="hidden md:block absolute top-6 right-0 transform translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pipeline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{candidates.length}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{getTotalActiveStages()}</div>
              <div className="text-sm text-muted-foreground">Active in Pipeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{getRejectedCount()}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getConversionRate()}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Pipeline Progress</span>
              <span className="font-medium">{getConversionRate()}% conversion rate</span>
            </div>
            <Progress value={getConversionRate()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stage Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Application Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Pending Review</span>
                </div>
                <Badge variant="secondary">
                  {candidates.filter(c => c.status === "PENDING_REVIEW").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <Badge variant="success">
                  {candidates.filter(c => c.status === "APPROVED").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Onboarded</span>
                </div>
                <Badge variant="success">
                  {candidates.filter(c => c.status === "ONBOARDED").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <Badge variant="destructive">
                  {candidates.filter(c => c.status === "REJECTED").length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(candidates.map(c => c.region))).map(region => {
                const regionCandidates = candidates.filter(c => c.region === region);
                const percentage = Math.round((regionCandidates.length / candidates.length) * 100);
                
                return (
                  <div key={region}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{region}</span>
                      <span className="text-sm text-muted-foreground">{regionCandidates.length}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidates
                .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
                .slice(0, 4)
                .map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{candidate.firstName} {candidate.lastName}</p>
                      <p className="text-xs text-muted-foreground">{candidate.region}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        candidate.status === "ONBOARDED" ? "success" :
                        candidate.status === "APPROVED" ? "secondary" :
                        candidate.status === "REJECTED" ? "destructive" : "outline"
                      }>
                        {candidate.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}