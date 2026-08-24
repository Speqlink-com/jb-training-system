import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, formatDate, formatCurrency, getComplianceColor } from "@/lib/utils";
import { 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Edit,
  FileText,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface AgentHeaderProps {
  agent: {
    id: string;
    agentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    branch: { name: string; code: string };
    sm: { firstName: string; lastName: string };
    hoa: { firstName: string; lastName: string };
    appointmentDate: string;
    isActive: boolean;
    production?: {
      monthlyProduction: number;
      productivity: number;
      targetAchievement: number;
    };
    trainingCompliance: number;
    pendingTrainings: number;
    completedTrainings: number;
  };
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const getComplianceStatus = (compliance: number) => {
    if (compliance >= 95) return { label: "Excellent", variant: "success" as const };
    if (compliance >= 85) return { label: "Good", variant: "secondary" as const };
    if (compliance >= 70) return { label: "Needs Improvement", variant: "warning" as const };
    return { label: "Critical", variant: "destructive" as const };
  };

  const complianceStatus = getComplianceStatus(agent.trainingCompliance);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Agent Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {getInitials(agent.firstName, agent.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {agent.firstName} {agent.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant={agent.isActive ? "success" : "secondary"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={complianceStatus.variant}>
                    {complianceStatus.label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono">{agent.agentId}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{agent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{agent.branch.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Sales Manager: </span>
                  <span className="font-medium">
                    {agent.sm.firstName} {agent.sm.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">HOA: </span>
                  <span className="font-medium">
                    {agent.hoa.firstName} {agent.hoa.lastName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Appointed: </span>
                <span className="font-medium">{formatDate(agent.appointmentDate)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:text-right">
              {agent.production && (
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(agent.production.monthlyProduction)}
                  </p>
                  <p className="text-sm text-muted-foreground">Monthly Production</p>
                  <div className="flex items-center justify-start lg:justify-end gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {agent.production.targetAchievement}% of target
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className={`text-2xl font-bold ${getComplianceColor(agent.trainingCompliance)}`}>
                  {agent.trainingCompliance}%
                </p>
                <p className="text-sm text-muted-foreground">Training Compliance</p>
                <div className="flex items-center justify-start lg:justify-end gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {agent.completedTrainings}/{agent.completedTrainings + agent.pendingTrainings} completed
                  </span>
                  {agent.pendingTrainings > 0 && (
                    <>
                      <AlertCircle className="h-3 w-3 text-yellow-600 ml-1" />
                      <span className="text-xs text-yellow-600">
                        {agent.pendingTrainings} pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    View Training History
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Performance Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}