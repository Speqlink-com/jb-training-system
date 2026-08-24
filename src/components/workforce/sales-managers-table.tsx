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
  Calendar,
  Building2,
  Award,
  TrendingUp
} from "lucide-react";

interface SalesManager {
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

interface SalesManagersTableProps {
  salesManagers: SalesManager[];
  filters: {
    search: string;
    region: string;
    branch: string;
    status: string;
    performanceRange: { min: string; max: string };
  };
}

export function SalesManagersTable({ salesManagers, filters }: SalesManagersTableProps) {
  const [sortBy, setSortBy] = useState<string>("achievementRate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter sales managers based on search and filters
  const filteredManagers = salesManagers.filter(manager => {
    const matchesSearch = !filters.search || 
      manager.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      manager.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      manager.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      manager.employeeId.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRegion = !filters.region || manager.region === filters.region;
    const matchesBranch = !filters.branch || manager.branch.id === filters.branch;
    const matchesStatus = !filters.status || manager.status === filters.status;

    const matchesPerformanceRange = 
      (!filters.performanceRange.min || manager.achievementRate >= Number(filters.performanceRange.min)) &&
      (!filters.performanceRange.max || manager.achievementRate <= Number(filters.performanceRange.max));

    return matchesSearch && matchesRegion && matchesBranch && matchesStatus && matchesPerformanceRange;
  });

  // Sort sales managers
  const sortedManagers = [...filteredManagers].sort((a, b) => {
    let aValue: any = a[sortBy as keyof SalesManager];
    let bValue: any = b[sortBy as keyof SalesManager];

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
                  Sales Manager
                </Button>
              </TableHead>
              <TableHead>Region & Branch</TableHead>
              <TableHead>Team</TableHead>
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
            {sortedManagers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${manager.email}`} />
                      <AvatarFallback>
                        {manager.firstName[0]}{manager.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/workforce/sales-managers/${manager.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {manager.firstName} {manager.lastName}
                      </Link>
                      <p className="text-sm text-muted-foreground">{manager.employeeId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{manager.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{manager.region}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {manager.branch.name} ({manager.branch.code})
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{manager.teamSize} agents</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {manager.activeAgents} active
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(manager.activeAgents / manager.teamSize) * 100} 
                        className="w-16 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round((manager.activeAgents / manager.teamSize) * 100)}%
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getPerformanceBadge(manager.achievementRate)}
                      <span className="font-bold text-primary">
                        {manager.achievementRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={manager.achievementRate} className="w-20 h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      YTD: {manager.performance.ytdRate}%
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {formatCurrency(manager.monthlyTarget)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(manager.monthlyAchievement)} achieved
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(manager.performance.avgTicketSize)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${getComplianceColor(manager.trainingCompliance)}`}>
                      {manager.trainingCompliance}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Training compliance
                    </p>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {manager.certifications.filter(c => c.status === "COMPLETED").length} certs
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {getStatusBadge(manager.status)}
                    <p className="text-xs text-muted-foreground">
                      Last login: {formatDate(manager.lastLogin, "MMM dd")}
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
                        <Link href={`/workforce/sales-managers/${manager.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Manager
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team
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
      
      {sortedManagers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No sales managers found matching your criteria.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {sortedManagers.length} of {salesManagers.length} sales managers</p>
      </div>
    </div>
  );
}