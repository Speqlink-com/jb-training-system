import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getStatusColor } from "@/lib/utils";
import { 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  FileText
} from "lucide-react";

interface AgentTrainingsProps {
  agentId: string;
}

// Mock training data - replace with API call
const mockTrainings = [
  {
    id: "1",
    title: "AML & Compliance Training",
    category: "Specialised Training",
    trainer: "John Mwangi",
    scheduledDate: "2024-08-28T10:00:00Z",
    duration: 4,
    location: "Nairobi CBD",
    status: "SCHEDULED",
    attendance: null,
    score: null,
    completedDate: null,
  },
  {
    id: "2",
    title: "Product Mix Training", 
    category: "Existing / Experienced Targeted Training",
    trainer: "Sarah Wanjiku",
    scheduledDate: "2024-08-15T09:00:00Z",
    duration: 6,
    location: "Nairobi CBD", 
    status: "COMPLETED",
    attendance: "Present",
    score: 85,
    completedDate: "2024-08-15T15:00:00Z",
  },
  {
    id: "3",
    title: "Sales Techniques Workshop",
    category: "Post-Training Handholding",
    trainer: "Peter Kimani",
    scheduledDate: "2024-07-20T14:00:00Z", 
    duration: 3,
    location: "Nairobi CBD",
    status: "COMPLETED",
    attendance: "Present",
    score: 92,
    completedDate: "2024-07-20T17:00:00Z",
  },
  {
    id: "4",
    title: "Customer Service Excellence",
    category: "Branch Training",
    trainer: "Grace Akinyi",
    scheduledDate: "2024-07-10T11:00:00Z",
    duration: 4,
    location: "Nairobi CBD",
    status: "COMPLETED", 
    attendance: "Present",
    score: 78,
    completedDate: "2024-07-10T15:00:00Z",
  },
  {
    id: "5",
    title: "Digital Transformation",
    category: "Alternative Distribution Training",
    trainer: "Michael Ochieng",
    scheduledDate: "2024-09-05T13:00:00Z",
    duration: 5,
    location: "Virtual",
    status: "SCHEDULED",
    attendance: null,
    score: null,
    completedDate: null,
  },
];

export function AgentTrainings({ agentId }: AgentTrainingsProps) {
  const completedTrainings = mockTrainings.filter(t => t.status === "COMPLETED");
  const upcomingTrainings = mockTrainings.filter(t => t.status === "SCHEDULED");
  const averageScore = completedTrainings.length > 0 
    ? Math.round(completedTrainings.reduce((sum, t) => sum + (t.score || 0), 0) / completedTrainings.length)
    : 0;
  const compliance = Math.round((completedTrainings.length / mockTrainings.length) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return null;
    if (score >= 90) return <Badge variant="success">{score}%</Badge>;
    if (score >= 80) return <Badge variant="secondary">{score}%</Badge>;
    if (score >= 70) return <Badge variant="warning">{score}%</Badge>;
    return <Badge variant="destructive">{score}%</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockTrainings.length}</p>
                <p className="text-sm text-muted-foreground">Total Trainings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedTrainings.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingTrainings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Training Compliance
            </span>
            <span className="text-2xl font-bold">{compliance}%</span>
          </CardTitle>
          <CardDescription>
            Overall training completion rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={compliance} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{completedTrainings.length} completed</span>
            <span>{upcomingTrainings.length} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Trainings */}
      {upcomingTrainings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Trainings
            </CardTitle>
            <CardDescription>
              Scheduled training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrainings.map((training) => (
                <div key={training.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{training.title}</p>
                    <p className="text-sm text-muted-foreground">{training.category}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(training.scheduledDate, "dd MMM yyyy HH:mm")}</span>
                      <span>{training.duration}h duration</span>
                      <span>{training.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(training.status)}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training History */}
      <Card>
        <CardHeader>
          <CardTitle>Training History</CardTitle>
          <CardDescription>
            Complete record of all training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{training.title}</p>
                      <p className="text-sm text-muted-foreground">{training.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{training.category}</Badge>
                  </TableCell>
                  <TableCell>{training.trainer}</TableCell>
                  <TableCell>
                    {formatDate(training.scheduledDate, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{training.duration}h</TableCell>
                  <TableCell>
                    {getStatusBadge(training.status)}
                  </TableCell>
                  <TableCell>
                    {getScoreBadge(training.score)}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}