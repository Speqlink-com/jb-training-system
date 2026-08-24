import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { 
  Activity, 
  FileText, 
  GraduationCap, 
  User, 
  Phone,
  Mail,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface AgentActivityProps {
  agentId: string;
}

// Mock activity data - replace with API call
const mockActivities = [
  {
    id: "1",
    type: "TRAINING_COMPLETED",
    title: "Completed Product Mix Training",
    description: "Successfully completed training with 85% score",
    actor: "System",
    timestamp: "2024-08-15T15:00:00Z",
    metadata: {
      trainingName: "Product Mix Training",
      score: 85,
      trainer: "Sarah Wanjiku"
    }
  },
  {
    id: "2",
    type: "PROFILE_UPDATED", 
    title: "Profile information updated",
    description: "Phone number and emergency contact updated",
    actor: "Jane Doe",
    timestamp: "2024-08-10T10:30:00Z",
    metadata: {
      fields: ["phone", "emergencyContact"]
    }
  },
  {
    id: "3",
    type: "DOCUMENT_UPLOADED",
    title: "Medical certificate uploaded", 
    description: "New medical certificate submitted for review",
    actor: "John Kamau",
    timestamp: "2024-08-08T14:20:00Z",
    metadata: {
      documentName: "Medical Certificate",
      fileName: "medical_certificate.pdf"
    }
  },
  {
    id: "4",
    type: "TRAINING_SCHEDULED",
    title: "AML Training scheduled",
    description: "Enrolled in AML & Compliance Training",
    actor: "Training Department",
    timestamp: "2024-08-05T09:15:00Z",
    metadata: {
      trainingName: "AML & Compliance Training",
      scheduledDate: "2024-08-28T10:00:00Z",
      trainer: "John Mwangi"
    }
  },
  {
    id: "5",
    type: "PERFORMANCE_REVIEW",
    title: "Monthly performance reviewed",
    description: "July performance metrics updated - 112% target achievement",
    actor: "Jane Doe",
    timestamp: "2024-08-01T16:45:00Z", 
    metadata: {
      period: "July 2024",
      targetAchievement: 112,
      production: 4600000
    }
  },
  {
    id: "6",
    type: "CONTACT_ATTEMPTED",
    title: "Phone call attempted",
    description: "Attempted to reach agent regarding pending training",
    actor: "Jane Doe",
    timestamp: "2024-07-30T11:20:00Z",
    metadata: {
      contactMethod: "phone",
      reason: "Training reminder"
    }
  },
  {
    id: "7",
    type: "DOCUMENT_APPROVED",
    title: "Employment contract approved",
    description: "Employment contract reviewed and approved by HR",
    actor: "HR Department", 
    timestamp: "2024-07-25T13:30:00Z",
    metadata: {
      documentName: "Employment Contract",
      approver: "HR Department"
    }
  },
  {
    id: "8",
    type: "AGENT_CREATED",
    title: "Agent profile created",
    description: "New agent record created in the system",
    actor: "Jane Doe",
    timestamp: "2024-07-20T09:00:00Z",
    metadata: {
      agentId: "AGT-004821",
      branch: "Nairobi CBD"
    }
  }
];

export function AgentActivity({ agentId }: AgentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "TRAINING_COMPLETED":
      case "TRAINING_SCHEDULED":
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case "DOCUMENT_UPLOADED":
      case "DOCUMENT_APPROVED":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "PROFILE_UPDATED":
      case "AGENT_CREATED":
        return <User className="h-4 w-4 text-purple-600" />;
      case "CONTACT_ATTEMPTED":
        return <Phone className="h-4 w-4 text-orange-600" />;
      case "PERFORMANCE_REVIEW":
        return <CheckCircle className="h-4 w-4 text-indigo-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "TRAINING_COMPLETED":
      case "DOCUMENT_APPROVED":
        return "border-green-200 bg-green-50";
      case "TRAINING_SCHEDULED":
        return "border-blue-200 bg-blue-50";
      case "DOCUMENT_UPLOADED":
        return "border-yellow-200 bg-yellow-50";
      case "PROFILE_UPDATED":
      case "AGENT_CREATED":
        return "border-purple-200 bg-purple-50";
      case "CONTACT_ATTEMPTED":
        return "border-orange-200 bg-orange-50";
      case "PERFORMANCE_REVIEW":
        return "border-indigo-200 bg-indigo-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const renderMetadata = (activity: any) => {
    switch (activity.type) {
      case "TRAINING_COMPLETED":
        return (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Score: {activity.metadata.score}%</span>
            <span>Trainer: {activity.metadata.trainer}</span>
          </div>
        );
      case "TRAINING_SCHEDULED":
        return (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Date: {formatDate(activity.metadata.scheduledDate, "dd MMM yyyy HH:mm")}</span>
            <span>Trainer: {activity.metadata.trainer}</span>
          </div>
        );
      case "PERFORMANCE_REVIEW":
        return (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Period: {activity.metadata.period}</span>
            <span>Achievement: {activity.metadata.targetAchievement}%</span>
          </div>
        );
      case "DOCUMENT_UPLOADED":
      case "DOCUMENT_APPROVED":
        return (
          <div className="text-xs text-muted-foreground">
            Document: {activity.metadata.documentName}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Complete history of agent interactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{mockActivities.filter(a => a.type.includes("TRAINING")).length}</p>
              <p className="text-sm text-muted-foreground">Training Events</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{mockActivities.filter(a => a.type.includes("DOCUMENT")).length}</p>
              <p className="text-sm text-muted-foreground">Document Events</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{mockActivities.filter(a => a.type.includes("PROFILE") || a.type.includes("AGENT")).length}</p>
              <p className="text-sm text-muted-foreground">Profile Updates</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{mockActivities.filter(a => a.type === "CONTACT_ATTEMPTED").length}</p>
              <p className="text-sm text-muted-foreground">Contact Attempts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Chronological timeline of all agent activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity, index) => (
              <div key={activity.id} className={`relative flex gap-4 p-4 rounded-lg border ${getActivityColor(activity.type)}`}>
                {/* Timeline connector */}
                {index !== mockActivities.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-6 bg-border"></div>
                )}
                
                {/* Activity icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  
                  {renderMetadata(activity)}
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {activity.actor === "System" ? "SY" : getInitials(activity.actor.split(' ')[0] || '', activity.actor.split(' ')[1] || '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      by {activity.actor}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      on {formatDate(activity.timestamp, "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}