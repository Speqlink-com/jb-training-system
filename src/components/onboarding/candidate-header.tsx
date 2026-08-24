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
import { formatDate } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  IdCard,
  UserCheck,
  MessageSquare,
  FileText
} from "lucide-react";

interface CandidateHeaderProps {
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
    applicationDate: string;
    status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ONBOARDED";
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
  };
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return <Badge variant="warning">Pending Review</Badge>;
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "ONBOARDED":
        return <Badge variant="success">Onboarded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStageBadge = (stage: string) => {
    const stageLabels: { [key: string]: string } = {
      "APPLICATION_SUBMITTED": "Application Submitted",
      "UNDER_REVIEW": "Under Review",
      "INTERVIEW_SCHEDULED": "Interview Scheduled",
      "OFFER_EXTENDED": "Offer Extended",
      "APPLICATION_REJECTED": "Application Rejected",
      "ACTIVE_AGENT": "Active Agent",
    };
    
    return <Badge variant="secondary">{stageLabels[stage] || stage}</Badge>;
  };

  const daysSinceApplication = Math.floor(
    (Date.now() - new Date(candidate.applicationDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}`} />
            <AvatarFallback className="text-lg">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {candidate.firstName} {candidate.lastName}
              </h1>
              {getStatusBadge(candidate.status)}
              {getStageBadge(candidate.stage)}
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <IdCard className="h-4 w-4" />
              <span>ID: {candidate.idNumber}</span>
              <span className="mx-2">•</span>
              <Building2 className="h-4 w-4" />
              <span>{candidate.branch.name} ({candidate.branch.code})</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4" />
              <span>{candidate.region} Region</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${candidate.email}`} className="hover:text-primary">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <a href={`tel:${candidate.phone}`} className="hover:text-primary">
                  {candidate.phone}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Applied {daysSinceApplication} days ago</span>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg p-2">
              <Users className="h-4 w-4" />
              <span>Assigned to: </span>
              <span className="font-medium">{candidate.assignedTo.name}</span>
              <span className="text-muted-foreground">({candidate.assignedTo.role})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
          {candidate.status === "PENDING_REVIEW" && (
            <>
              <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
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
                Edit Candidate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Reassign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCheck className="h-4 w-4 mr-2" />
                Create Agent Profile
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{daysSinceApplication}</p>
                <p className="text-sm text-muted-foreground">Days in Pipeline</p>
                <p className="text-xs text-muted-foreground">
                  Applied {formatDate(candidate.applicationDate, "MMM dd")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3/4</p>
                <p className="text-sm text-muted-foreground">Docs Uploaded</p>
                <p className="text-xs text-muted-foreground">2 verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-xs text-muted-foreground">Score: 85/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold">Next Action</p>
                <p className="text-sm text-muted-foreground">{candidate.nextAction}</p>
                {candidate.expectedStartDate && (
                  <p className="text-xs text-muted-foreground">
                    Expected: {formatDate(candidate.expectedStartDate, "MMM dd")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}