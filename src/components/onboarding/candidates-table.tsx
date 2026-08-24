"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Users, 
  Calendar,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck
} from "lucide-react";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  applicationDate: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ONBOARDED";
  stage: "APPLICATION_SUBMITTED" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "OFFER_EXTENDED" | "APPLICATION_REJECTED" | "ACTIVE_AGENT";
  assignedTo: {
    id: string;
    name: string;
    role: string;
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
  documents: {
    cv: { uploaded: boolean; verified: boolean };
    idCopy: { uploaded: boolean; verified: boolean };
    certificates: { uploaded: boolean; verified: boolean };
    recommendation: { uploaded: boolean; verified: boolean };
  };
  interviews: Array<{
    id: string;
    type: string;
    scheduledDate: string;
    status: string;
    interviewer: string;
    score?: number;
    notes: string;
  }>;
  nextAction: string;
  expectedStartDate: string | null;
  agentId?: string;
}

interface CandidatesTableProps {
  candidates: Candidate[];
  filters: {
    search: string;
    status: string;
    stage: string;
    region: string;
    branch: string;
    assignedTo: string;
    dateRange: { start: string; end: string };
  };
}

export function CandidatesTable({ candidates, filters }: CandidatesTableProps) {
  const [sortBy, setSortBy] = useState<string>("applicationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !filters.search || 
      candidate.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.idNumber.includes(filters.search);

    const matchesStatus = !filters.status || candidate.status === filters.status;
    const matchesStage = !filters.stage || candidate.stage === filters.stage;
    const matchesRegion = !filters.region || candidate.region === filters.region;
    const matchesBranch = !filters.branch || candidate.branch.id === filters.branch;
    const matchesAssignedTo = !filters.assignedTo || candidate.assignedTo.id === filters.assignedTo;

    const matchesDateRange = !filters.dateRange.start || !filters.dateRange.end ||
      (new Date(candidate.applicationDate) >= new Date(filters.dateRange.start) &&
       new Date(candidate.applicationDate) <= new Date(filters.dateRange.end));

    return matchesSearch && matchesStatus && matchesStage && matchesRegion && 
           matchesBranch && matchesAssignedTo && matchesDateRange;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Candidate];
    let bValue: any = b[sortBy as keyof Candidate];

    if (sortBy === "name") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

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
    switch (stage) {
      case "APPLICATION_SUBMITTED":
        return <Badge variant="secondary">Application Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="warning">Under Review</Badge>;
      case "INTERVIEW_SCHEDULED":
        return <Badge variant="secondary">Interview Scheduled</Badge>;
      case "OFFER_EXTENDED":
        return <Badge variant="success">Offer Extended</Badge>;
      case "APPLICATION_REJECTED":
        return <Badge variant="destructive">Application Rejected</Badge>;
      case "ACTIVE_AGENT":
        return <Badge variant="success">Active Agent</Badge>;
      default:
        return <Badge variant="outline">{stage.replace("_", " ")}</Badge>;
    }
  };

  const getDocumentProgress = (documents: Candidate["documents"]) => {
    const totalDocs = 4;
    const uploadedDocs = Object.values(documents).filter(doc => doc.uploaded).length;
    const verifiedDocs = Object.values(documents).filter(doc => doc.verified).length;
    
    return {
      uploaded: (uploadedDocs / totalDocs) * 100,
      verified: (verifiedDocs / totalDocs) * 100,
      uploadedCount: uploadedDocs,
      verifiedCount: verifiedDocs,
      totalCount: totalDocs
    };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-medium"
                >
                  Candidate
                </Button>
              </TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Status & Stage</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("applicationDate")}
                  className="h-auto p-0 font-medium"
                >
                  Application Date
                </Button>
              </TableHead>
              <TableHead>Next Action</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.map((candidate) => {
              const docProgress = getDocumentProgress(candidate.documents);
              
              return (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}`} />
                        <AvatarFallback>
                          {candidate.firstName[0]}{candidate.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          href={`/onboarding/${candidate.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {candidate.firstName} {candidate.lastName}
                        </Link>
                        <p className="text-sm text-muted-foreground">ID: {candidate.idNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{candidate.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{candidate.branch.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.region} Region</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Assigned to: {candidate.assignedTo.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {getStatusBadge(candidate.status)}
                      {getStageBadge(candidate.stage)}
                      {candidate.agentId && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <UserCheck className="h-3 w-3" />
                          <span>Agent ID: {candidate.agentId}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {docProgress.uploadedCount}/{docProgress.totalCount} uploaded
                        </span>
                      </div>
                      <Progress value={docProgress.uploaded} className="w-20 h-2" />
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {docProgress.verifiedCount}/{docProgress.totalCount} verified
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatDate(candidate.applicationDate, "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor((Date.now() - new Date(candidate.applicationDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                      {candidate.expectedStartDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Start: {formatDate(candidate.expectedStartDate, "MMM dd")}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{candidate.nextAction}</p>
                      {candidate.interviews.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {candidate.interviews.length} interview(s) completed
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/onboarding/${candidate.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Candidate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {candidate.status === "PENDING_REVIEW" && (
                          <>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Application
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Application
                            </DropdownMenuItem>
                          </>
                        )}
                        {candidate.status === "APPROVED" && (
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {sortedCandidates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No candidates found matching your criteria.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {sortedCandidates.length} of {candidates.length} candidates</p>
      </div>
    </div>
  );
}