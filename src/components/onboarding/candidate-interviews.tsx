"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  Plus,
  Edit
} from "lucide-react";

interface CandidateInterviewsProps {
  candidateId: string;
  candidateName: string;
  interviews: Array<{
    id: string;
    type: string;
    scheduledDate: string;
    status: string;
    interviewer: string;
    interviewerRole: string;
    location: string;
    duration: number;
    score?: number;
    notes: string;
    feedback?: {
      communication: number;
      enthusiasm: number;
      experience: number;
      knowledge: number;
      overall: number;
    };
  }>;
}

export function CandidateInterviews({ candidateId, candidateName, interviews }: CandidateInterviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview History</h2>
          <p className="text-muted-foreground">Interview sessions and feedback for {candidateName}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <Card key={interview.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {interview.type.replace("_", " ")}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(interview.scheduledDate, "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {interview.duration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {interview.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={interview.status === "COMPLETED" ? "success" : "secondary"}>
                    {interview.status}
                  </Badge>
                  {interview.score && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{interview.score}/100</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Interviewer</p>
                  <p className="text-sm text-muted-foreground">
                    {interview.interviewer} ({interview.interviewerRole})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Interview Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(interview.scheduledDate, "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>

              {interview.feedback && (
                <div>
                  <p className="text-sm font-medium mb-3">Performance Ratings</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{interview.feedback.communication}</div>
                      <div className="text-xs text-muted-foreground">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{interview.feedback.enthusiasm}</div>
                      <div className="text-xs text-muted-foreground">Enthusiasm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{interview.feedback.experience}</div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{interview.feedback.knowledge}</div>
                      <div className="text-xs text-muted-foreground">Knowledge</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{interview.feedback.overall}</div>
                      <div className="text-xs text-muted-foreground">Overall</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Interview Notes</p>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm">{interview.notes}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {interviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Interviews Scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Schedule the first interview to begin the evaluation process.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}