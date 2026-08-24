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
import { useNotificationStore } from "@/stores/notification.store";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Target,
  Calendar,
  IdCard,
  Crown,
  Building2
} from "lucide-react";

const hoaSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  region: z.string().min(1, "Region is required"),
  branches: z.array(z.string()).min(1, "At least one branch must be selected"),
  monthlyTarget: z.string().min(1, "Monthly target is required"),
  startDate: z.string().min(1, "Start date is required"),
});

type HOAFormData = z.infer<typeof hoaSchema>;

interface CreateHOADialogProps {
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

const branchesByRegion = {
  Central: [
    { value: "1", label: "Nairobi CBD" },
    { value: "2", label: "Westlands" },
    { value: "7", label: "Karen" },
    { value: "8", label: "Thika" },
  ],
  Coast: [
    { value: "3", label: "Mombasa" },
    { value: "9", label: "Malindi" },
    { value: "10", label: "Kilifi" },
  ],
  Western: [
    { value: "5", label: "Kisumu" },
    { value: "11", label: "Kakamega" },
    { value: "12", label: "Bungoma" },
  ],
  Eastern: [
    { value: "13", label: "Meru" },
    { value: "14", label: "Embu" },
    { value: "15", label: "Machakos" },
  ],
  "Rift Valley": [
    { value: "4", label: "Nakuru" },
    { value: "6", label: "Eldoret" },
    { value: "16", label: "Nyeri" },
  ],
};

export function CreateHOADialog({ open, onOpenChange }: CreateHOADialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof branchesByRegion | "">("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const { addNotification } = useNotificationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<HOAFormData>({
    resolver: zodResolver(hoaSchema),
  });

  const watchedRegion = watch("region") as keyof typeof branchesByRegion;
  const availableBranches = watchedRegion ? branchesByRegion[watchedRegion] || [] : [];

  const onSubmit = async (data: HOAFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating HOA:", { ...data, branches: selectedBranches });
      
      addNotification({
        id: Date.now().toString(),
        title: "Head of Agency Created",
        message: `${data.firstName} ${data.lastName} has been successfully added as HOA for ${data.region} region.`,
        type: "success",
        timestamp: new Date().toISOString(),
        read: false,
      });

      reset();
      setSelectedBranches([]);
      setSelectedRegion("");
      onOpenChange(false);
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        title: "Error",
        message: "Failed to create HOA. Please try again.",
        type: "error",
        timestamp: new Date().toISOString(),
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (region: keyof typeof branchesByRegion) => {
    setValue("region", region);
    setSelectedRegion(region);
    setSelectedBranches([]); // Reset branches when region changes
    setValue("branches", []);
  };

  const handleBranchToggle = (branchId: string, checked: boolean) => {
    const newBranches = checked 
      ? [...selectedBranches, branchId]
      : selectedBranches.filter(id => id !== branchId);
    
    setSelectedBranches(newBranches);
    setValue("branches", newBranches);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Add New Head of Agency
          </DialogTitle>
          <DialogDescription>
            Create a new HOA profile and assign them to a region with branch coverage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Basic details and contact information
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter first name"
                    className="form-input-enhanced"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 font-medium">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter last name"
                    className="form-input-enhanced"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 font-medium">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter email address"
                    className="form-input-enhanced"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+254..."
                    className="form-input-enhanced"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-primary" />
                  Employee ID *
                </Label>
                <Input
                  id="employeeId"
                  {...register("employeeId")}
                  placeholder="HOA001"
                  className="form-input-enhanced"
                />
                {errors.employeeId && (
                  <p className="text-sm text-red-500 font-medium">{errors.employeeId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Regional Assignment */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Regional Assignment
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Territory and branch coverage assignment
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Region *</Label>
                <Select onValueChange={handleRegionChange}>
                  <SelectTrigger className="form-input-enhanced">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-enhanced">
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value} className="dropdown-item-enhanced">
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-500 font-medium">{errors.region.message}</p>
                )}
              </div>

              {selectedRegion && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Branch Coverage * (Select at least one)
                  </Label>
                  <div className="admin-card bg-muted border-none">
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {availableBranches.map((branch) => (
                          <div key={branch.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background transition-colors">
                            <Checkbox
                              id={branch.value}
                              checked={selectedBranches.includes(branch.value)}
                              onCheckedChange={(checked) => 
                                handleBranchToggle(branch.value, checked as boolean)
                              }
                              className="focus-enhanced"
                            />
                            <Label 
                              htmlFor={branch.value}
                              className="text-sm font-medium cursor-pointer flex-1"
                            >
                              {branch.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {errors.branches && (
                    <p className="text-sm text-red-500 font-medium">{errors.branches.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Target and Start Date */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-primary" />
                Performance & Schedule
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Target setting and start date configuration
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyTarget" className="text-sm font-medium">
                    Monthly Target (KES) *
                  </Label>
                  <Input
                    id="monthlyTarget"
                    type="number"
                    {...register("monthlyTarget")}
                    placeholder="120000000"
                    className="form-input-enhanced"
                  />
                  {errors.monthlyTarget && (
                    <p className="text-sm text-red-500 font-medium">{errors.monthlyTarget.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Recommended: KES 50M - 150M based on region size
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className="form-input-enhanced"
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 font-medium">{errors.startDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Creating..." : "Create HOA"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}