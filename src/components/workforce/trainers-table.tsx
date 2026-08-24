"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotificationStore } from "@/stores/notification.store";
import { Trainer } from "@/types";
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  Users,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface TrainersTableProps {
  trainers: Trainer[];
  onEdit: (trainer: Trainer) => void;
  onView: (trainer: Trainer) => void;
}

// Mock trainers data
const mockTrainers: Trainer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@trainsyt.com",
    specialization: ["Product Training", "Sales Methodology"],
    totalManpower: 45,
    trainingsConductive: 12,
    upcomingTrainings: 3,
    pendingReports: 1,
    isActive: true,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@trainsyt.com",
    specialization: ["Compliance Training", "Leadership Development"],
    totalManpower: 38,
    trainingsConductive: 8,
    upcomingTrainings: 2,
    pendingReports: 0,
    isActive: true,
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Davis",
    email: "michael.davis@trainsyt.com",
    specialization: ["Technical Skills", "Software Training"],
    totalManpower: 52,
    trainingsConductive: 15,
    upcomingTrainings: 4,
    pendingReports: 2,
    isActive: true,
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@trainsyt.com",
    specialization: ["Communication Skills", "Customer Service"],
    totalManpower: 35,
    trainingsConductive: 10,
    upcomingTrainings: 1,
    pendingReports: 0,
    isActive: false,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@trainsyt.com",
    specialization: ["Sales Methodology", "Leadership Development"],
    totalManpower: 42,
    trainingsConductive: 11,
    upcomingTrainings: 2,
    pendingReports: 1,
    isActive: true,
  },
];

export function TrainersTable({ 
  trainers = mockTrainers, 
  onEdit, 
  onView 
}: TrainersTableProps) {
  const { addNotification } = useNotificationStore();

  const handleDelete = async (trainer: Trainer) => {
    if (!confirm(`Are you sure you want to remove ${trainer.firstName} ${trainer.lastName} from the system? This action cannot be undone.`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        id: Date.now().toString(),
        title: "Trainer Removed",
        message: `${trainer.firstName} ${trainer.lastName} has been removed from the system.`,
        type: "success",
        timestamp: new Date(),
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        title: "Error",
        message: "Failed to remove trainer. Please try again.",
        type: "error",
        timestamp: new Date(),
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getWorkloadStatus = (upcomingTrainings: number) => {
    if (upcomingTrainings >= 4) {
      return { status: "overloaded", color: "destructive", icon: XCircle };
    } else if (upcomingTrainings >= 2) {
      return { status: "busy", color: "secondary", icon: Clock };
    } else {
      return { status: "available", color: "default", icon: CheckCircle };
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Trainers ({trainers.length})
          </CardTitle>
          <CardDescription>
            Manage training staff and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead>Workload</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => {
                  const workloadStatus = getWorkloadStatus(trainer.upcomingTrainings || 0);
                  const WorkloadIcon = workloadStatus.icon;

                  return (
                    <TableRow key={trainer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={`${trainer.firstName} ${trainer.lastName}`} />
                            <AvatarFallback>
                              {getInitials(trainer.firstName, trainer.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {trainer.firstName} {trainer.lastName}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {trainer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {trainer.specialization?.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {(trainer.specialization?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(trainer.specialization?.length || 0) - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <WorkloadIcon className={`h-4 w-4 ${
                              workloadStatus.color === 'destructive' ? 'text-red-500' : 
                              workloadStatus.color === 'secondary' ? 'text-yellow-500' : 
                              'text-green-500'
                            }`} />
                            <span className="text-sm font-medium capitalize">
                              {workloadStatus.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trainer.upcomingTrainings} upcoming sessions
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trainer.totalManpower} total trainees
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span className="text-sm">{trainer.trainingsConductive} completed</span>
                          </div>
                          {(trainer.pendingReports || 0) > 0 && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{trainer.pendingReports} pending reports</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={trainer.isActive ? "default" : "secondary"}>
                          {trainer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onView(trainer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(trainer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Trainer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(trainer)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Trainer
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
        </CardContent>
      </Card>
    </>
  );
}