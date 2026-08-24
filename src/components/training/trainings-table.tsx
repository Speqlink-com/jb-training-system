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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle
} from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string;
  category: keyof typeof TRAINING_CATEGORIES;
  subCategory?: string | null;
  trainer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  scheduledDate: string;
  duration: number;
  location: string;
  branchId?: string | null;
  branch?: { name: string; code: string } | null;
  expectedManpower: number;
  actualAttendance?: number | null;
  attendanceRate?: number | null;
  productivity?: number | null;
  averageTicketSize?: number | null;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface TrainingsTableProps {
  trainings: Training[];
  filters: {
    search: string;
    category: string;
    trainer: string;
    branch: string;
    status: string;
    dateRange: { start: string; end: string };
  };
}

export function TrainingsTable({ trainings, filters }: TrainingsTableProps) {
  const [sortBy, setSortBy] = useState<string>("scheduledDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter trainings based on search and filters
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = !filters.search || 
      training.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      training.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      `${training.trainer.firstName} ${training.trainer.lastName}`.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || training.category === filters.category;
    const matchesTrainer = !filters.trainer || training.trainer.id === filters.trainer;
    const matchesBranch = !filters.branch || training.branchId === filters.branch;
    const matchesStatus = !filters.status || training.status === filters.status;

    const matchesDateRange = !filters.dateRange.start || !filters.dateRange.end ||
      (new Date(training.scheduledDate) >= new Date(filters.dateRange.start) &&
       new Date(training.scheduledDate) <= new Date(filters.dateRange.end));

    return matchesSearch && matchesCategory && matchesTrainer && matchesBranch && matchesStatus && matchesDateRange;
  });

  // Sort trainings
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Training];
    let bValue: any = b[sortBy as keyof Training];

    if (sortBy === "trainer") {
      aValue = `${a.trainer.firstName} ${a.trainer.lastName}`;
      bValue = `${b.trainer.firstName} ${b.trainer.lastName}`;
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
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: keyof typeof TRAINING_CATEGORIES, subCategory?: string | null) => {
    const categoryName = TRAINING_CATEGORIES[category];
    return (
      <div className="space-y-1">
        <Badge variant="outline">{categoryName}</Badge>
        {subCategory && (
          <Badge variant="secondary" className="text-xs">
            {subCategory}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("title")}
                  className="h-auto p-0 font-medium"
                >
                  Training Program
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("trainer")}
                  className="h-auto p-0 font-medium"
                >
                  Trainer
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("scheduledDate")}
                  className="h-auto p-0 font-medium"
                >
                  Scheduled Date
                </Button>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link 
                      href={`/trainings/${training.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {training.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {training.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {training.duration}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {training.expectedManpower} expected
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getCategoryBadge(training.category, training.subCategory)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {training.trainer.firstName} {training.trainer.lastName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {formatDate(training.scheduledDate, "dd MMM yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(training.scheduledDate, "HH:mm")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{training.location}</span>
                    </div>
                    {training.branch && (
                      <p className="text-xs text-muted-foreground">
                        {training.branch.name}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {training.actualAttendance !== null && training.attendanceRate !== null ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress value={training.attendanceRate} className="w-16 h-2" />
                        <span className="text-sm font-medium">
                          {training.attendanceRate}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {training.actualAttendance}/{training.expectedManpower} attended
                      </p>
                      {training.productivity && (
                        <p className="text-xs text-muted-foreground">
                          {training.productivity}% productivity
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not started</span>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(training.status)}
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
                        <Link href={`/trainings/${training.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Training
                      </DropdownMenuItem>
                      {training.status === "SCHEDULED" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Attendees
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Take Attendance
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedTrainings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No training programs found matching your criteria.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {sortedTrainings.length} of {trainings.length} training programs</p>
      </div>
    </div>
  );
}