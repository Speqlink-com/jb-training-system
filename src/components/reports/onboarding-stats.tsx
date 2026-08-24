"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Target,
  CheckCircle
} from "lucide-react";

interface OnboardingStatsProps {
  data: {
    totalCandidates: number;
    activeCandidates: number;
    approvedCandidates: number;
    onboardedAgents: number;
    conversionRate: number;
    avgProcessingTime: number;
    pipeline: {
      APPLICATION_SUBMITTED: number;
      UNDER_REVIEW: number;
      INTERVIEW_SCHEDULED: number;
      OFFER_EXTENDED: number;
      ACTIVE_AGENT: number;
    };
  };
}

export function OnboardingStats({ data }: OnboardingStatsProps) {
  const {
    totalCandidates,
    activeCandidates,
    approvedCandidates,
    onboardedAgents,
    conversionRate,
    avgProcessingTime,
    pipeline
  } = data;

  // Calculate pipeline metrics
  const pipelineStages = [
    { key: "APPLICATION_SUBMITTED", label: "Applications", icon: FileText, color: "bg-blue-100 text-blue-700" },
    { key: "UNDER_REVIEW", label: "Under Review", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    { key: "INTERVIEW_SCHEDULED", label: "Interviews", icon: Users, color: "bg-purple-100 text-purple-700" },
    { key: "OFFER_EXTENDED", label: "Offers", icon: CheckCircle, color: "bg-green-100 text-green-700" },
    { key: "ACTIVE_AGENT", label: "Onboarded", icon: UserCheck, color: "bg-emerald-100 text-emerald-700" }
  ];

  const totalInPipeline = Object.values(pipeline).reduce((sum, count) => sum + count, 0);

  // Mock additional onboarding metrics
  const additionalMetrics = {
    documentVerificationRate: 94,
    interviewShowRate: 87,
    offerAcceptanceRate: 92,
    timeToOnboard: 18,
    rejectionRate: 15,
    monthlyTarget: 25,
    qualityScore: 4.2
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">{totalCandidates}</p>
                <p className="text-sm text-green-600">{activeCandidates} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-sm text-green-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold">{avgProcessingTime}d</p>
                <p className="text-sm text-muted-foreground">Days to onboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <UserCheck className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{onboardedAgents}</p>
                <p className="text-sm text-muted-foreground">New agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Onboarding Pipeline
          </CardTitle>
          <CardDescription>
            Current candidates distribution across onboarding stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage, index) => {
              const count = pipeline[stage.key as keyof typeof pipeline];
              const percentage = totalInPipeline > 0 ? Math.round((count / totalInPipeline) * 100) : 0;
              const StageIcon = stage.icon;
              
              return (
                <div key={stage.key} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stage.color} mb-3`}>
                    <StageIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{stage.label}</h3>
                  <div className="text-3xl font-bold text-primary mb-1">{count}</div>
                  <div className="text-sm text-muted-foreground">{percentage}% of total</div>
                  
                  {index < pipelineStages.length - 1 && (
                    <div className="hidden md:block mt-4">
                      <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent mx-auto"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Efficiency Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Process Efficiency
            </CardTitle>
            <CardDescription>
              Key efficiency metrics and bottlenecks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document Verification</span>
                <span className="text-sm text-muted-foreground">{additionalMetrics.documentVerificationRate}%</span>
              </div>
              <Progress value={additionalMetrics.documentVerificationRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interview Show Rate</span>
                <span className="text-sm text-muted-foreground">{additionalMetrics.interviewShowRate}%</span>
              </div>
              <Progress value={additionalMetrics.interviewShowRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offer Acceptance</span>
                <span className="text-sm text-muted-foreground">{additionalMetrics.offerAcceptanceRate}%</span>
              </div>
              <Progress value={additionalMetrics.offerAcceptanceRate} className="h-2" />
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span>Overall Efficiency</span>
                <Badge variant="success">Excellent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline Metrics
            </CardTitle>
            <CardDescription>
              Processing times and monthly targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{avgProcessingTime}</div>
                <div className="text-sm text-muted-foreground">Days Average</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{additionalMetrics.timeToOnboard}</div>
                <div className="text-sm text-muted-foreground">Target Days</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Target</span>
                <span className="font-medium">{additionalMetrics.monthlyTarget} new agents</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Achievement</span>
                <span className="font-medium text-green-600">{onboardedAgents} ({Math.round((onboardedAgents / additionalMetrics.monthlyTarget) * 100)}%)</span>
              </div>
              <Progress value={(onboardedAgents / additionalMetrics.monthlyTarget) * 100} className="h-2" />
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Quality Score</span>
                <Badge variant="success">{additionalMetrics.qualityScore}/5.0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Onboarding Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Onboarding Performance</CardTitle>
          <CardDescription>
            Candidate intake and conversion by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Central", "Coast", "Western"].map((region, index) => {
              const regionCandidates = Math.floor(totalCandidates * [0.4, 0.35, 0.25][index]);
              const regionOnboarded = Math.floor(onboardedAgents * [0.5, 0.3, 0.2][index]);
              const regionConversion = Math.round((regionOnboarded / regionCandidates) * 100);
              
              return (
                <div key={region} className="space-y-3">
                  <h4 className="font-medium">{region} Region</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Applications</span>
                      <span className="font-medium">{regionCandidates}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Onboarded</span>
                      <span className="font-medium text-green-600">{regionOnboarded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <Badge variant={regionConversion > 65 ? "success" : "secondary"}>
                        {regionConversion}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}