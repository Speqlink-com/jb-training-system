"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Role } from "@/config/permissions";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  FileText,
  Bell,
  ArrowRight
} from "lucide-react";

function DashboardContent() {
  const { user, hasRole } = useAuth();

  if (!user) return null;

  const getRoleBasedStats = () => {
    switch (user.role) {
      case Role.AGENT:
        return [
          { title: "My Trainings", value: "5", description: "Completed this month", icon: GraduationCap, trend: { value: 2, isPositive: true } },
          { title: "Pending Trainings", value: "2", description: "Need to complete", icon: Calendar, trend: { value: -1, isPositive: true } },
          { title: "Compliance", value: "89%", description: "Training compliance", icon: CheckCircle, trend: { value: 5, isPositive: true } },
          { title: "My Production", value: "KES 4.8M", description: "This month", icon: TrendingUp, trend: { value: 12, isPositive: true } },
        ];
      
      case Role.SALES_MANAGER:
        return [
          { title: "My Agents", value: "48", description: "Under management", icon: Users, trend: { value: 3, isPositive: true } },
          { title: "Team Production", value: "KES 31.4M", description: "Monthly total", icon: TrendingUp, trend: { value: 8, isPositive: true } },
          { title: "Training Compliance", value: "94%", description: "Team average", icon: CheckCircle, trend: { value: 2, isPositive: true } },
          { title: "Pending Trainings", value: "8", description: "Team pending", icon: Calendar, trend: { value: -3, isPositive: true } },
        ];
      
      case Role.HOA:
        return [
          { title: "Total Agents", value: "243", description: "Across all branches", icon: Users, trend: { value: 12, isPositive: true } },
          { title: "Sales Managers", value: "12", description: "Under supervision", icon: Users, trend: { value: 0, isPositive: true } },
          { title: "Monthly Production", value: "KES 182M", description: "Organization total", icon: TrendingUp, trend: { value: 15, isPositive: true } },
          { title: "Compliance", value: "96%", description: "Organization average", icon: CheckCircle, trend: { value: 1, isPositive: true } },
        ];
      
      case Role.TRAINER:
        return [
          { title: "Total Manpower", value: "1,284", description: "Agents to train", icon: Users },
          { title: "Trainings Conducted", value: "48", description: "This month", icon: GraduationCap, trend: { value: 6, isPositive: true } },
          { title: "Upcoming Trainings", value: "7", description: "This week", icon: Calendar },
          { title: "Pending Reports", value: "3", description: "Need completion", icon: FileText, trend: { value: -2, isPositive: true } },
        ];
      
      case Role.ADMIN:
        return [
          { title: "Total Users", value: "3,482", description: "All system users", icon: Users, trend: { value: 45, isPositive: true } },
          { title: "Training Sessions", value: "1,284", description: "Total conducted", icon: GraduationCap, trend: { value: 18, isPositive: true } },
          { title: "System Compliance", value: "94.7%", description: "Overall rate", icon: CheckCircle, trend: { value: 2.3, isPositive: true } },
          { title: "Active Alerts", value: "12", description: "Require attention", icon: Bell, trend: { value: -5, isPositive: true } },
        ];
      
      default:
        return [];
    }
  };

  const stats = getRoleBasedStats();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Good morning, {user.firstName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your training platform today
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user.role.replace('_', ' ')}
        </Badge>
      </div>

      {/* Role-specific stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hasRole(Role.AGENT) && (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  View My Trainings
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Performance
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </>
            )}
            
            {(hasRole(Role.SALES_MANAGER) || hasRole(Role.HOA)) && (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Agents
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </>
            )}
            
            {hasRole(Role.TRAINER) && (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Training
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Take Attendance
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </>
            )}
            
            {hasRole(Role.ADMIN) && (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  System Reports
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training completed</p>
                  <p className="text-xs text-muted-foreground">AML Compliance Training</p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New agent onboarded</p>
                  <p className="text-xs text-muted-foreground">John Kamau - AGT-001234</p>
                </div>
                <span className="text-xs text-muted-foreground">4h ago</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training reminder</p>
                  <p className="text-xs text-muted-foreground">Product Training scheduled for tomorrow</p>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}