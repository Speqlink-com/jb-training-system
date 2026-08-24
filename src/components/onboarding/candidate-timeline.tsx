"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  Calendar,
  MessageSquare,
  Plus
} from "lucide-react";

interface CandidateTimelineProps {
  candidateId: string;
  timeline: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    user: string;
    type: string;
  }>;
  notes: Array<{
    id: string;
    author: string;
    authorRole: string;
    content: string;
    timestamp: string;
    type: string;
  }>;
}

export function CandidateTimeline({ candidateId, timeline, notes }: CandidateTimelineProps) {
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return <FileText className="h-4 w-4" />;
      case "DOCUMENT":
        return <FileText className="h-4 w-4" />;
      case "ASSIGNMENT":
        return <Users className="h-4 w-4" />;
      case "REVIEW":
        return <CheckCircle className="h-4 w-4" />;
      case "INTERVIEW":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return "bg-blue-100 text-blue-700";
      case "DOCUMENT":
        return "bg-green-100 text-green-700";
      case "ASSIGNMENT":
        return "bg-purple-100 text-purple-700";
      case "REVIEW":
        return "bg-orange-100 text-orange-700";
      case "INTERVIEW":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Combine timeline and notes, sort by timestamp
  const combinedEvents = [
    ...timeline.map(item => ({ ...item, eventType: "timeline" })),
    ...notes.map(item => ({ 
      ...item, 
      eventType: "note",
      action: "Note added",
      description: item.content,
      user: item.author,
      type: "NOTE"
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Timeline</h2>
          <p className="text-muted-foreground">Complete history of candidate interactions and progress</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="space-y-4">
        {combinedEvents.map((event, index) => (
          <Card key={`${event.eventType}-${event.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getTypeColor(event.type)}`}>
                  {event.eventType === "note" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    getTimelineIcon(event.type)
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.action}</h4>
                    <div className="flex items-center gap-2">
                      {event.eventType === "note" && (
                        <Badge variant="outline" className="text-xs">
                          {(event as any).authorRole || "Note"}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.timestamp, "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {event.user.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{event.user}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs ml-2">Latest</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {combinedEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
              <p className="text-muted-foreground">
                Activity will appear here as the candidate progresses through the onboarding process.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}