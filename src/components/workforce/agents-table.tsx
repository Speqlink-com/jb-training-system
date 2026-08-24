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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate, getInitials, getComplianceColor } from "@/lib/utils";
import { MoreHorizontal, Eye, Edit, Phone, Mail } from "lucide-react";

interface Agent {
  id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branch: { id: string; name: string; code: string };
  sm: { id: string; firstName: string; lastName: string };
  hoa: { id: string; firstName: string; lastName: string };
  appointmentDate: string;
  isActive: boolean;
  production?: { monthlyProduction: number; averageTicketSize: number; productivity: number };
  trainingCompliance: number;
  pendingTrainings: number;
  createdAt: string;
}

interface AgentsTableProps {
  agents: Agent[];
  filters: {
    search: string;
    branch: string;
    sm: string;
    hoa: string;
    compliance: string;
  };
}

export function AgentsTable({ agents, filters }: AgentsTableProps) {
  const [sortBy, setSortBy] = useState<string>("agentId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !filters.search || 
      agent.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      agent.agentId.toLowerCase().includes(filters.search.toLowerCase()) ||
      agent.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesBranch = !filters.branch || agent.branch.id === filters.branch;
    const matchesSM = !filters.sm || agent.sm.id === filters.sm;
    const matchesHOA = !filters.hoa || agent.hoa.id === filters.hoa;
    
    const matchesCompliance = !filters.compliance || (
      (filters.compliance === "high" && agent.trainingCompliance >= 95) ||
      (filters.compliance === "medium" && agent.trainingCompliance >= 85 && agent.trainingCompliance < 95) ||
      (filters.compliance === "low" && agent.trainingCompliance < 85)
    );

    return matchesSearch && matchesBranch && matchesSM && matchesHOA && matchesCompliance;
  });

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Agent];
    let bValue: any = b[sortBy as keyof Agent];

    if (sortBy === "production") {
      aValue = a.production?.monthlyProduction || 0;
      bValue = b.production?.monthlyProduction || 0;
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

  const getComplianceBadge = (compliance: number) => {
    if (compliance >= 95) return <Badge variant="success">Excellent</Badge>;
    if (compliance >= 85) return <Badge variant="secondary">Good</Badge>;
    if (compliance >= 70) return <Badge variant="warning">Needs Improvement</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
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
                  onClick={() => handleSort("firstName")}
                  className="h-auto p-0 font-medium"
                >
                  Agent
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("agentId")}
                  className="h-auto p-0 font-medium"
                >
                  Agent ID
                </Button>
              </TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>SM / HOA</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("production")}
                  className="h-auto p-0 font-medium"
                >
                  Production
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("trainingCompliance")}
                  className="h-auto p-0 font-medium"
                >
                  Compliance
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("appointmentDate")}
                  className="h-auto p-0 font-medium"
                >
                  Appointed
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(agent.firstName, agent.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/agents/${agent.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {agent.firstName} {agent.lastName}
                      </Link>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        {agent.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{agent.agentId}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{agent.branch.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.branch.code}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{agent.sm.firstName} {agent.sm.lastName}</p>
                    <p className="text-muted-foreground">{agent.hoa.firstName} {agent.hoa.lastName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {agent.production ? (
                    <div className="text-sm">
                      <p className="font-medium">{formatCurrency(agent.production.monthlyProduction)}</p>
                      <p className="text-muted-foreground">{agent.production.productivity}% productivity</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No data</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Progress value={agent.trainingCompliance} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getComplianceColor(agent.trainingCompliance)}`}>
                        {agent.trainingCompliance}%
                      </span>
                    </div>
                    {getComplianceBadge(agent.trainingCompliance)}
                    {agent.pendingTrainings > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {agent.pendingTrainings} pending
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {formatDate(agent.appointmentDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={agent.isActive ? "success" : "secondary"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
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
                        <Link href={`/agents/${agent.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Agent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedAgents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No agents found matching your criteria.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {sortedAgents.length} of {agents.length} agents</p>
      </div>
    </div>
  );
}