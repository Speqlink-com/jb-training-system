"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { 
  GraduationCap,
  Users,
  Clock,
  Award,
  TrendingUp,
  CheckCircle
} from "lucide-react";

interface TrainingAnalyticsProps {
  data: {
    totalSessions: number;
    completedSessions: number;
    totalParticipants: number;
    averageAttendance: number;
    averageEffectiveness: number;
    complianceRate: number;
    categoriesBreakdown: Record<string, number>;
  };
}

export function TrainingAnalytics({ data }: TrainingAnalyticsProps) {
  const {
    totalSessions,
    completedSessions,
    totalParticipants,
    averageAttendance,
    averageEffectiveness,
    complianceRate,
    categoriesBreakdown
  } = data;

  const completionRate = Math.round((completedSessions / totalSessions) * 100);
  const pendingSessions = totalSessions - completedSessions;

  return (
    <div className="space-y-6">
      {/* Training Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
                <p className="text-sm text-green-600">{completedSessions} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">{totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Total trained</p>
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
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">{averageAttendance}%</p>
                <p className="text-sm text-green-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Effectiveness</p>
                <p className="text-2xl font-bold">{averageEffectiveness}%</p>
                <p className="text-sm text-muted-foreground">Avg score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Training Categories
            </CardTitle>
            <CardDescription>
              Sessions delivered by training category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoriesBreakdown).map(([categoryKey, count]) => {
                const categoryName = TRAINING_CATEGORIES[categoryKey as keyof typeof TRAINING_CATEGORIES] || categoryKey;
                const percentage = Math.round((count / totalSessions) * 100);
                
                return (
                  <div key={categoryKey} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{categoryName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} sessions</span>
                        <Badge variant="secondary">{percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={percentage * 2} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Training Performance
            </CardTitle>
            <CardDescription>
              Key metrics and compliance rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Completion</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedSessions} completed</span>
                <span>{pendingSessions} pending</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Training Compliance</span>
                <span className="text-sm text-muted-foreground">{complianceRate}%</span>
              </div>
              <Progress value={complianceRate} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Based on mandatory training completion
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance Quality</span>
                <span className="text-sm text-muted-foreground">{averageAttendance}%</span>
              </div>
              <Progress value={averageAttendance} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Average attendance across all sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Effectiveness Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Training Effectiveness Dashboard
          </CardTitle>
          <CardDescription>
            Detailed analysis of training impact and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Attendance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Attendance</span>
                  <span className="font-medium">{averageAttendance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>On-time Arrival</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Full Session Completion</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Learning Outcomes</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Knowledge Retention</span>
                  <span className="font-medium">91%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Skills Application</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Certification Pass Rate</span>
                  <span className="font-medium">96%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Business Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance Improvement</span>
                  <span className="font-medium text-green-600">+7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium text-green-600">+0.3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Error Reduction</span>
                  <span className="font-medium text-green-600">-15%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}