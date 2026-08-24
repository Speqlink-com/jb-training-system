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
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Users, 
  Target,
  Phone,
  Mail,
  Building2,
  Award,
  TrendingUp,
  MapPin,
  Crown
} from "lucide-react";

interface HOA {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  region: string;
  dateJoined: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  salesManagersCount: number;
  totalTeamSize: number;
  activeAgents: number;
  monthlyTarget: number;
  monthlyAchievement: number;
  achievementRate: number;
  trainingCompliance: number;
  lastLogin: string;
  branches: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  performance: {
    ytdTarget: number;
    ytdAchievement: number;
    ytdRate: number;
    avgTicketSize: number;
    conversionRate: number;
    customerSatisfaction: number;
  };
  certifications: Array<{
    name: string;
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "EXPIRED";
    expiryDate: string | null;
  }>;
}

interface HOAsTableProps {
  hoas: HOA[];
  filters: {
    search: string;
    region: string;
    status: string;
    performanceRange: { min: string; max: string };
  };
}

export function HOAsTable({ hoas, filters }: HOAsTableProps) {
  const [sortBy, setSortBy] = useState<string>("achievementRate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter HOAs based on search and filters
  const filteredHOAs = hoas.filter(hoa => {
    const matchesSearch = !filters.search || 
      hoa.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      hoa.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      hoa.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      hoa.employeeId.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRegion = !filters.region || hoa.region === filters.region;
    const matchesStatus = !filters.status || hoa.status === filters.status;

    const matchesPerformanceRange = 
      (!filters.performanceRange.min || hoa.achievementRate >= Number(filters.performanceRange.min)) &&
      (!filters.performanceRange.max || hoa.achievementRate <= Number(filters.performanceRange.max));

    return matchesSearch && matchesRegion && matchesStatus && matchesPerformanceRange;
  });

  // Sort HOAs
  const sortedHOAs = [...filteredHOAs].sort((a, b) => {
    let aValue: any = a[sortBy as keyof HOA];
    let bValue: any = b[sortBy as keyof HOA];

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

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
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
                  Head of Agency
                </Button>
              </TableHead>
              <TableHead>Region & Coverage</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("achievementRate")}
                  className="h-auto p-0 font-medium"
                >
                  Performance
                </Button>
              </TableHead>
              <TableHead>Targets</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHOAs.map((hoa) => (
              <TableRow key={hoa.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${hoa.email}`} />
                      <AvatarFallback>
                        {hoa.firstName[0]}{hoa.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/workforce/hoas/${hoa.id}`}
                        className="font-medium hover:text-primary flex items-center gap-1"
                      >
                        <Crown className="h-3 w-3 text-yellow-600" />
                        {hoa.firstName} {hoa.lastName}
                      </Link>
                      <p className="text-sm text-muted-foreground">{hoa.employeeId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{hoa.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{hoa.region} Region</span>
                    </div>
                    <div className="space-y-1">
                      {hoa.branches.slice(0, 2).map(branch => (
                        <div key={branch.id} className="flex items-center justify-between text-xs">
                          <span>{branch.name}</span>
                          <span className="text-muted-foreground">({branch.code})</span>
                        </div>
                      ))}
                      {hoa.branches.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{hoa.branches.length - 2} more branches
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{hoa.salesManagersCount} SMs</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hoa.totalTeamSize} total agents
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(hoa.activeAgents / hoa.totalTeamSize) * 100} 
                        className="w-16 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {hoa.activeAgents} active
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getPerformanceBadge(hoa.achievementRate)}
                      <span className="font-bold text-primary">
                        {hoa.achievementRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hoa.achievementRate} className="w-20 h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      YTD: {hoa.performance.ytdRate}%
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {formatCurrency(hoa.monthlyTarget / 1000000)}M
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(hoa.monthlyAchievement / 1000000)}M achieved
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(hoa.performance.avgTicketSize)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${getComplianceColor(hoa.trainingCompliance)}`}>
                      {hoa.trainingCompliance}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Training compliance
                    </p>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {hoa.certifications.filter(c => c.status === "COMPLETED").length} certs
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {getStatusBadge(hoa.status)}
                    <p className="text-xs text-muted-foreground">
                      Last login: {formatDate(hoa.lastLogin, "MMM dd")}
                    </p>
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
                        <Link href={`/workforce/hoas/${hoa.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit HOA
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Region
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Target className="h-4 w-4 mr-2" />
                        Set Targets
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedHOAs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No HOAs found matching your criteria.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {sortedHOAs.length} of {hoas.length} Head of Agencies</p>
      </div>
    </div>
  );
}