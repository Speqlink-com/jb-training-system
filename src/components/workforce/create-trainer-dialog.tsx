"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores/notification.store";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Award,
  Calendar,
  IdCard,
  BookOpen,
  Users
} from "lucide-react";

const trainerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  specialization: z.array(z.string()).min(1, "At least one specialization must be selected"),
  experienceYears: z.string().min(1, "Experience years is required"),
  maxCapacity: z.string().min(1, "Maximum training capacity is required"),
  certification: z.string().optional(),
});

type TrainerFormData = z.infer<typeof trainerSchema>;

interface CreateTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTrainerDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateTrainerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const { addNotification } = useNotificationStore();

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      employeeId: "",
      specialization: [],
      experienceYears: "",
      maxCapacity: "",
      certification: "",
    },
  });

  const handleSpecializationToggle = (category: string) => {
    const updated = selectedSpecializations.includes(category)
      ? selectedSpecializations.filter(s => s !== category)
      : [...selectedSpecializations, category];
    
    setSelectedSpecializations(updated);
    form.setValue('specialization', updated);
  };

  const onSubmit = async (data: TrainerFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Creating trainer:", {
        ...data,
        specialization: selectedSpecializations,
      });

      addNotification({
        id: Date.now().toString(),
        title: "Trainer Created",
        message: `${data.firstName} ${data.lastName} has been successfully added as a trainer.`,
        type: "success",
        timestamp: new Date(),
      });

      form.reset();
      setSelectedSpecializations([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        title: "Error",
        message: "Failed to create trainer. Please try again.",
        type: "error",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Create New Trainer
          </DialogTitle>
          <DialogDescription>
            Add a new trainer to manage training programs and conduct sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Personal Information
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="Enter first name"
                  disabled={isLoading}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Enter last name"
                  disabled={isLoading}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="trainer@example.com"
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="+254 700 000 000"
                  disabled={isLoading}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                Employee ID
              </Label>
              <Input
                id="employeeId"
                {...form.register("employeeId")}
                placeholder="TRN001"
                disabled={isLoading}
              />
              {form.formState.errors.employeeId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.employeeId.message}
                </p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Professional Information
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  {...form.register("experienceYears")}
                  placeholder="5"
                  disabled={isLoading}
                />
                {form.formState.errors.experienceYears && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.experienceYears.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Max Training Capacity
                </Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  {...form.register("maxCapacity")}
                  placeholder="50"
                  disabled={isLoading}
                />
                {form.formState.errors.maxCapacity && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.maxCapacity.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certification (Optional)
              </Label>
              <Input
                id="certification"
                {...form.register("certification")}
                placeholder="Certified Professional Trainer (CPT)"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Training Specializations
              </Label>
              <p className="text-sm text-muted-foreground">
                Select the training categories this trainer specializes in
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TRAINING_CATEGORIES).map(([key, category]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={selectedSpecializations.includes(category)}
                      onCheckedChange={() => handleSpecializationToggle(category)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={key}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedSpecializations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSpecializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
              
              {form.formState.errors.specialization && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.specialization.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Trainer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}