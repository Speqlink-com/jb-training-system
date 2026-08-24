import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  TrendingUp, 
  Target, 
  GraduationCap, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building2,
  User
} from "lucide-react";

interface AgentOverviewProps {
  agent: {
    id: string;
    agentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId?: string;
    kraPin?: string;
    branch: { 
      name: string; 
      code: string;
      address?: string;
    };
    sm: { 
      firstName: string; 
      lastName: string;
      email?: string;
      phone?: string;
    };
    hoa: { 
      firstName: string; 
      lastName: string;
      email?: string;
      phone?: string;
    };
    appointmentDate: string;
    probationEndDate?: string;
    contractType?: string;
    isActive: boolean;
    production?: {
      monthlyProduction: number;
      averageTicketSize: number;
      productivity: number;
      ytdProduction?: number;
      targetAchievement?: number;
    };
    trainingCompliance: number;
    pendingTrainings: number;
    completedTrainings: number;
    totalTrainings: number;
    lastTrainingDate?: string;
    nextTrainingDate?: string;
    address?: {
      street: string;
      city: string;
      county: string;
      postalCode: string;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
    bankDetails?: {
      accountNumber: string;
      bankName: string;
      branchCode: string;
    };
  };
}

export function AgentOverview({ agent }: AgentOverviewProps) {
  const performanceData = [
    {
      title: "Monthly Production",
      value: agent.production ? formatCurrency(agent.production.monthlyProduction) : "No data",
      description: "Current month performance",
      icon: TrendingUp,
      trend: agent.production ? { value: 12, isPositive: true } : undefined,
    },
    {
      title: "Average Ticket Size",
      value: agent.production ? formatCurrency(agent.production.averageTicketSize) : "No data",
      description: "Per transaction average",
      icon: Target,
    },
    {
      title: "Training Progress",
      value: `${agent.completedTrainings}/${agent.totalTrainings}`,
      description: `${agent.trainingCompliance}% compliance`,
      icon: GraduationCap,
    },
    {
      title: "Productivity",
      value: agent.production ? `${agent.production.productivity}%` : "No data",
      description: "Performance rating",
      icon: CheckCircle,
      trend: agent.production ? { value: 5, isPositive: true } : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Metrics */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Training Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Training Status
            </CardTitle>
            <CardDescription>
              Current training compliance and upcoming sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Training Compliance</span>
              <span className="text-sm text-muted-foreground">
                {agent.trainingCompliance}%
              </span>
            </div>
            <Progress value={agent.trainingCompliance} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{agent.completedTrainings}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{agent.pendingTrainings}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>

            {agent.pendingTrainings > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {agent.pendingTrainings} training sessions require attention
                </span>
              </div>
            )}

            {agent.nextTrainingDate && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Next Training</span>
                </div>
                <span className="text-sm text-blue-700">
                  {formatDate(agent.nextTrainingDate)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agent ID:</span>
                <span className="font-mono">{agent.agentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{agent.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{agent.phone}</span>
              </div>
              {agent.nationalId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">National ID:</span>
                  <span className="font-mono">{agent.nationalId}</span>
                </div>
              )}
              {agent.kraPin && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KRA PIN:</span>
                  <span className="font-mono">{agent.kraPin}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Appointed:</span>
                <span>{formatDate(agent.appointmentDate)}</span>
              </div>
              {agent.probationEndDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Probation Ends:</span>
                  <span>{formatDate(agent.probationEndDate)}</span>
                </div>
              )}
              {agent.contractType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract:</span>
                  <Badge variant="outline">{agent.contractType}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Work Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{agent.branch.name}</p>
                <p className="text-muted-foreground">{agent.branch.code}</p>
                {agent.branch.address && (
                  <p className="text-muted-foreground">{agent.branch.address}</p>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-muted-foreground mb-2">Reporting Structure:</p>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">Sales Manager</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.sm.firstName} {agent.sm.lastName}
                    </p>
                    {agent.sm.email && (
                      <p className="text-xs text-muted-foreground">{agent.sm.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">HOA</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.hoa.firstName} {agent.hoa.lastName}
                    </p>
                    {agent.hoa.email && (
                      <p className="text-xs text-muted-foreground">{agent.hoa.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        {agent.emergencyContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{agent.emergencyContact.name}</p>
                <p className="text-muted-foreground">{agent.emergencyContact.relationship}</p>
                <p className="text-muted-foreground">{agent.emergencyContact.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}