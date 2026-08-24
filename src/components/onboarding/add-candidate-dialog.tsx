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
import { Textarea } from "@/components/ui/textarea";
import { useNotificationStore } from "@/stores/notification.store";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Calendar,
  IdCard,
  GraduationCap,
  Briefcase,
  Users
} from "lucide-react";

const candidateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  idNumber: z.string().min(6, "ID number must be at least 6 characters"),
  region: z.string().min(1, "Region is required"),
  branchId: z.string().min(1, "Branch is required"),
  assignedTo: z.string().min(1, "Assignment is required"),
  education: z.string().min(1, "Education level is required"),
  experience: z.string().min(1, "Experience is required"),
  referredBy: z.string().optional(),
  expectedStartDate: z.string().min(1, "Expected start date is required"),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface AddCandidateDialogProps {
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

const salesManagers = [
  { value: "sm1", label: "David Kimani (Nairobi CBD)", region: "Central" },
  { value: "sm2", label: "Grace Wanjiru (Westlands)", region: "Central" },
  { value: "sm3", label: "Joseph Mwangi (Mombasa)", region: "Coast" },
];

const educationLevels = [
  { value: "High School Certificate", label: "High School Certificate" },
  { value: "Diploma", label: "Diploma" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "Other", label: "Other" },
];

export function AddCandidateDialog({ open, onOpenChange }: AddCandidateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const watchedRegion = watch("region") as keyof typeof branchesByRegion;
  const availableBranches = watchedRegion ? branchesByRegion[watchedRegion] || [] : [];
  const availableManagers = watchedRegion ? salesManagers.filter(sm => sm.region === watchedRegion) : [];

  const onSubmit = async (data: CandidateFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating candidate:", data);
      
      addNotification({
        id: Date.now().toString(),
        title: "Candidate Added",
        message: `${data.firstName} ${data.lastName} has been successfully added to the onboarding pipeline.`,
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
        message: "Failed to add candidate. Please try again.",
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
    setValue("branchId", ""); // Reset branch when region changes
    setValue("assignedTo", ""); // Reset assignment when region changes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Add a new candidate to the onboarding pipeline and assign them for review.
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
              <Label htmlFor="idNumber" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                ID Number
              </Label>
              <Input
                id="idNumber"
                {...register("idNumber")}
                placeholder="12345678"
              />
              {errors.idNumber && (
                <p className="text-sm text-red-500">{errors.idNumber.message}</p>
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assign To Sales Manager
              </Label>
              <Select 
                onValueChange={(value) => setValue("assignedTo", value)}
                disabled={!watchedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sales manager" />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.value} value={manager.value}>
                      {manager.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-sm text-red-500">{errors.assignedTo.message}</p>
              )}
            </div>
          </div>

          {/* Background Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Background Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education Level
                </Label>
                <Select onValueChange={(value) => setValue("education", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.education && (
                  <p className="text-sm text-red-500">{errors.education.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedStartDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expected Start Date
                </Label>
                <Input
                  id="expectedStartDate"
                  type="date"
                  {...register("expectedStartDate")}
                />
                {errors.expectedStartDate && (
                  <p className="text-sm text-red-500">{errors.expectedStartDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Work Experience
              </Label>
              <Textarea
                id="experience"
                {...register("experience")}
                placeholder="Describe relevant work experience..."
                rows={3}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referredBy">
                Referred By (Optional)
              </Label>
              <Input
                id="referredBy"
                {...register("referredBy")}
                placeholder="Name of person who referred this candidate"
              />
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
              {isLoading ? "Adding..." : "Add Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}