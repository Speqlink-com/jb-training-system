"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Award,
  Building2,
  IdCard,
  Settings,
  UserCheck,
  MessageSquare
} from "lucide-react";

interface SalesManagerHeaderProps {
  salesManager: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    employeeId: string;
    branch: {
      id: string;
      name: string;
      code: string;
    };
    region: string;
    dateJoined: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    teamSize: number;
    activeAgents: number;
    monthlyTarget: number;
    monthlyAchievement: number;
    achievementRate: number;
    trainingCompliance: number;
    lastLogin: string;
  };
}

export function SalesManagerHeader({ salesManager }: SalesManagerHeaderProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Active</Badge>;
      case "INACTIVE":
        return <Badge variant="secondary">Inactive</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 100) return <Badge variant="success">Excellent</Badge>;
    if (rate >= 90) return <Badge variant="secondary">Good</Badge>;
    if (rate >= 75) return <Badge variant="warning">Average</Badge>;
    return <Badge variant="destructive">Below Target</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://avatar.vercel.sh/${salesManager.email}`} />
            <AvatarFallback className="text-lg">
              {salesManager.firstName[0]}{salesManager.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {salesManager.firstName} {salesManager.lastName}
              </h1>
              {getStatusBadge(salesManager.status)}
              {getPerformanceBadge(salesManager.achievementRate)}
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <IdCard className="h-4 w-4" />
              <span>{salesManager.employeeId}</span>
              <span className="mx-2">•</span>
              <Building2 className="h-4 w-4" />
              <span>{salesManager.branch.name}</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4" />
              <span>{salesManager.region} Region</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${salesManager.email}`} className="hover:text-primary">
                  {salesManager.email}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <a href={`tel:${salesManager.phone}`} className="hover:text-primary">
                  {salesManager.phone}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(salesManager.dateJoined, "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
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
                <Target className="h-4 w-4 mr-2" />
                Set Targets
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Manage Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Award className="h-4 w-4 mr-2" />
                Assign Training
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCheck className="h-4 w-4 mr-2" />
                Performance Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{salesManager.teamSize}</p>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-xs text-green-600">
                  {salesManager.activeAgents} active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{salesManager.achievementRate}%</p>
                <p className="text-sm text-muted-foreground">Achievement</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(salesManager.monthlyAchievement)} / {formatCurrency(salesManager.monthlyTarget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(salesManager.monthlyAchievement / 1000000)}M
                </p>
                <p className="text-sm text-muted-foreground">Monthly Sales</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{salesManager.trainingCompliance}%</p>
                <p className="text-sm text-muted-foreground">Compliance</p>
                <p className="text-xs text-muted-foreground">Training complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Activity */}
      <div className="text-sm text-muted-foreground">
        Last login: {formatDate(salesManager.lastLogin, "MMM dd, yyyy 'at' HH:mm")}
      </div>
    </div>
  );
}