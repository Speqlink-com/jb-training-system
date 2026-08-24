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
import { useNotificationStore } from "@/stores/notification.store";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Target,
  Calendar,
  IdCard
} from "lucide-react";

const salesManagerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  region: z.string().min(1, "Region is required"),
  branchId: z.string().min(1, "Branch is required"),
  monthlyTarget: z.string().min(1, "Monthly target is required"),
  startDate: z.string().min(1, "Start date is required"),
});

type SalesManagerFormData = z.infer<typeof salesManagerSchema>;

interface CreateSalesManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const regions = [
  { value: "Central", label: "Central" },
  { value: "Coast", label: "Coast" },
  { value: "Western", label: "Western" },
  { value: "Eastern", label: "Eastern" },
  { value: "Rift Valley", label: "Rift Valley" },
];

const branches = [
  { value: "1", label: "Nairobi CBD", region: "Central" },
  { value: "2", label: "Westlands", region: "Central" },
  { value: "3", label: "Mombasa", region: "Coast" },
  { value: "4", label: "Nakuru", region: "Rift Valley" },
  { value: "5", label: "Kisumu", region: "Western" },
  { value: "6", label: "Eldoret", region: "Rift Valley" },
];

export function CreateSalesManagerDialog({ open, onOpenChange }: CreateSalesManagerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const { addNotification } = useNotificationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SalesManagerFormData>({
    resolver: zodResolver(salesManagerSchema),
  });

  const watchedRegion = watch("region");
  const availableBranches = branches.filter(branch => 
    !watchedRegion || branch.region === watchedRegion
  );

  const onSubmit = async (data: SalesManagerFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating sales manager:", data);
      
      addNotification({
        id: Date.now().toString(),
        title: "Sales Manager Created",
        message: `${data.firstName} ${data.lastName} has been successfully added as a sales manager.`,
        type: "success",
        timestamp: new Date().toISOString(),
        read: false,
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        title: "Error",
        message: "Failed to create sales manager. Please try again.",
        type: "error",
        timestamp: new Date().toISOString(),
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (region: string) => {
    setValue("region", region);
    setValue("branchId", ""); // Reset branch when region changes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Sales Manager</DialogTitle>
          <DialogDescription>
            Create a new sales manager profile and assign them to a region and branch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
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
                  {...register("email")}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+254..."
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
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
                {...register("employeeId")}
                placeholder="SM001"
              />
              {errors.employeeId && (
                <p className="text-sm text-red-500">{errors.employeeId.message}</p>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Assignment Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Region
                </Label>
                <Select onValueChange={handleRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-500">{errors.region.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Branch
                </Label>
                <Select 
                  onValueChange={(value) => setValue("branchId", value)}
                  disabled={!watchedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchId && (
                  <p className="text-sm text-red-500">{errors.branchId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyTarget" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Monthly Target (KES)
                </Label>
                <Input
                  id="monthlyTarget"
                  type="number"
                  {...register("monthlyTarget")}
                  placeholder="10000000"
                />
                {errors.monthlyTarget && (
                  <p className="text-sm text-red-500">{errors.monthlyTarget.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Sales Manager"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}