"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  IdCard,
  UserCheck,
  FileText,
  Clock,
  Target,
  Star
} from "lucide-react";

interface CandidateOverviewProps {
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
    applicationDate: string;
    status: string;
    stage: string;
    assignedTo: {
      id: string;
      name: string;
      role: string;
      email: string;
      phone: string;
    };
    branch: {
      id: string;
      name: string;
      code: string;
    };
    region: string;
    education: string;
    experience: string;
    referredBy: string | null;
    expectedStartDate: string | null;
    nextAction: string;
    documents: {
      cv: { uploaded: boolean; verified: boolean };
      idCopy: { uploaded: boolean; verified: boolean };
      certificates: { uploaded: boolean; verified: boolean };
      recommendation: { uploaded: boolean; verified: boolean };
    };
    interviews: Array<{
      id: string;
      type: string;
      status: string;
      score?: number;
    }>;
  };
}

export function CandidateOverview({ candidate }: CandidateOverviewProps) {
  const getDocumentProgress = () => {
    const docs = Object.values(candidate.documents);
    const uploaded = docs.filter(doc => doc.uploaded).length;
    const verified = docs.filter(doc => doc.verified).length;
    return {
      uploaded: (uploaded / docs.length) * 100,
      verified: (verified / docs.length) * 100,
      uploadedCount: uploaded,
      verifiedCount: verified,
      totalCount: docs.length
    };
  };

  const getInterviewProgress = () => {
    const completed = candidate.interviews.filter(i => i.status === "COMPLETED").length;
    const avgScore = candidate.interviews.length > 0 
      ? candidate.interviews
          .filter(i => i.score)
          .reduce((sum, i) => sum + (i.score || 0), 0) / candidate.interviews.filter(i => i.score).length
      : 0;
    
    return { completed, avgScore };
  };

  const docProgress = getDocumentProgress();
  const interviewProgress = getInterviewProgress();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ID Number</p>
                    <p className="text-sm text-muted-foreground">{candidate.idNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Preferred Location</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.branch.name}, {candidate.region} Region
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Application Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(candidate.applicationDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {candidate.referredBy && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Referred By</p>
                    <p className="text-sm text-muted-foreground">{candidate.referredBy}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Background Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-sm text-muted-foreground">{candidate.education}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Work Experience</p>
                  <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                </div>
              </div>

              {candidate.expectedStartDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Expected Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(candidate.expectedStartDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Assignment & Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Assigned Sales Manager</h4>
                <Badge variant="secondary">{candidate.assignedTo.role}</Badge>
              </div>
              <p className="text-lg font-medium">{candidate.assignedTo.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{candidate.assignedTo.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{candidate.assignedTo.phone}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Next Action Required</p>
                  <p className="text-sm text-muted-foreground">{candidate.nextAction}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Status */}
      <div className="space-y-6">
        {/* Document Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Progress
            </CardTitle>
            <CardDescription>
              Document upload and verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Documents Uploaded</span>
                  <span className="text-sm text-muted-foreground">
                    {docProgress.uploadedCount}/{docProgress.totalCount}
                  </span>
                </div>
                <Progress value={docProgress.uploaded} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Documents Verified</span>
                  <span className="text-sm text-muted-foreground">
                    {docProgress.verifiedCount}/{docProgress.totalCount}
                  </span>
                </div>
                <Progress value={docProgress.verified} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>CV</span>
                <div className="flex gap-2">
                  <Badge variant={candidate.documents.cv.uploaded ? "success" : "outline"} className="text-xs">
                    {candidate.documents.cv.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                  <Badge variant={candidate.documents.cv.verified ? "success" : "outline"} className="text-xs">
                    {candidate.documents.cv.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>ID Copy</span>
                <div className="flex gap-2">
                  <Badge variant={candidate.documents.idCopy.uploaded ? "success" : "outline"} className="text-xs">
                    {candidate.documents.idCopy.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                  <Badge variant={candidate.documents.idCopy.verified ? "success" : "outline"} className="text-xs">
                    {candidate.documents.idCopy.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Certificates</span>
                <div className="flex gap-2">
                  <Badge variant={candidate.documents.certificates.uploaded ? "success" : "outline"} className="text-xs">
                    {candidate.documents.certificates.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                  <Badge variant={candidate.documents.certificates.verified ? "success" : "outline"} className="text-xs">
                    {candidate.documents.certificates.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Recommendation</span>
                <div className="flex gap-2">
                  <Badge variant={candidate.documents.recommendation.uploaded ? "success" : "outline"} className="text-xs">
                    {candidate.documents.recommendation.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                  <Badge variant={candidate.documents.recommendation.verified ? "success" : "outline"} className="text-xs">
                    {candidate.documents.recommendation.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Interview Progress
            </CardTitle>
            <CardDescription>
              Interview completion and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{interviewProgress.completed}</div>
              <div className="text-sm text-muted-foreground">Interviews Completed</div>
            </div>

            {interviewProgress.avgScore > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{Math.round(interviewProgress.avgScore)}</span>
                  <span className="text-muted-foreground">/100</span>
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            )}

            <div className="space-y-2">
              {candidate.interviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">
                    {interview.type.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={interview.status === "COMPLETED" ? "success" : "outline"}>
                      {interview.status}
                    </Badge>
                    {interview.score && (
                      <span className="text-sm font-medium">{interview.score}/100</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Request Documents
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Reassign Candidate
            </Button>
            <Button className="w-full" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Update
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}