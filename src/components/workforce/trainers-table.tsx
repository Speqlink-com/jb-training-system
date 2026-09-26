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
import type { TrainerFilters } from "@/components/workforce/trainer-filters";
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

export interface TrainerListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specializations: string[];
  status: "ACTIVE" | "INACTIVE";
  totalTrainings: number;
  completedTrainings: number;
  totalParticipants: number;
  averageRating: number;
  certificationLevel: string;
  upcomingTrainings: Array<{ id: string }>;
  certifications: Array<{ name: string; status: string }>;
}

interface TrainersTableProps {
  trainers: TrainerListItem[];
  filters?: TrainerFilters;
  onEdit?: (trainer: TrainerListItem) => void;
  onView?: (trainer: TrainerListItem) => void;
}

export function TrainersTable({ 
  trainers,
  filters,
  onEdit = () => undefined,
  onView = () => undefined,
}: TrainersTableProps) {
  const { addNotification } = useNotificationStore();

  const handleDelete = async (trainer: TrainerListItem) => {
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

  const filteredTrainers = trainers.filter((trainer) => {
    if (!filters) return true;
    const search = filters.search.toLowerCase();
    const matchesSearch =
      !search ||
      `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(search) ||
      trainer.email.toLowerCase().includes(search);
    const matchesSpecialization =
      !filters.specialization || trainer.specializations.includes(filters.specialization);
    const matchesAvailability =
      !filters.availability ||
      (filters.availability === "available" && trainer.upcomingTrainings.length < 2) ||
      (filters.availability === "busy" && trainer.upcomingTrainings.length >= 2);
    const matchesCertification =
      !filters.certification ||
      trainer.certifications.some((certification) => certification.status === filters.certification);

    return matchesSearch && matchesSpecialization && matchesAvailability && matchesCertification;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Trainers ({filteredTrainers.length})
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
                {filteredTrainers.map((trainer) => {
                  const workloadStatus = getWorkloadStatus(trainer.upcomingTrainings.length);
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
                          {trainer.specializations.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {trainer.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{trainer.specializations.length - 2} more
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
                            {trainer.upcomingTrainings.length} upcoming sessions
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trainer.totalParticipants} total trainees
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span className="text-sm">{trainer.completedTrainings} completed</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award className="h-3 w-3" />
                            <span className="text-xs">{trainer.averageRating}/5 average rating</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={trainer.status === "ACTIVE" ? "default" : "secondary"}>
                          {trainer.status === "ACTIVE" ? "Active" : "Inactive"}
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
