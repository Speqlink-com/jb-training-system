"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter,
  X,
  MapPin,
  Building2,
  Users,
  Calendar,
  UserCheck
} from "lucide-react";

interface CandidateFiltersProps {
  filters: {
    search: string;
    status: string;
    stage: string;
    region: string;
    branch: string;
    assignedTo: string;
    dateRange: { start: string; end: string };
  };
  onFiltersChange: (filters: any) => void;
}

const statuses = [
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ONBOARDED", label: "Onboarded" },
];

const stages = [
  { value: "APPLICATION_SUBMITTED", label: "Application Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "OFFER_EXTENDED", label: "Offer Extended" },
  { value: "APPLICATION_REJECTED", label: "Application Rejected" },
  { value: "ACTIVE_AGENT", label: "Active Agent" },
];

const regions = [
  { value: "Central", label: "Central" },
  { value: "Coast", label: "Coast" },
  { value: "Western", label: "Western" },
  { value: "Eastern", label: "Eastern" },
  { value: "Rift Valley", label: "Rift Valley" },
];

const branches = [
  { value: "1", label: "Nairobi CBD" },
  { value: "2", label: "Westlands" },
  { value: "3", label: "Mombasa" },
  { value: "4", label: "Nakuru" },
  { value: "5", label: "Kisumu" },
  { value: "6", label: "Eldoret" },
];

const assignedTo = [
  { value: "sm1", label: "David Kimani" },
  { value: "sm2", label: "Grace Wanjiru" },
  { value: "sm3", label: "Joseph Mwangi" },
];

export function CandidateFilters({ filters, onFiltersChange }: CandidateFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      stage: "",
      region: "",
      branch: "",
      assignedTo: "",
      dateRange: { start: "", end: "" },
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status || 
    filters.stage || 
    filters.region || 
    filters.branch || 
    filters.assignedTo ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID number..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[140px]">
            <UserCheck className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stage Filter */}
        <Select 
          value={filters.stage} 
          onValueChange={(value) => handleFilterChange("stage", value)}
        >
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage.value} value={stage.value}>
                {stage.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select 
          value={filters.region} 
          onValueChange={(value) => handleFilterChange("region", value)}
        >
          <SelectTrigger className="w-[120px]">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Second Row - Branch, Assigned To, Date Range */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Branch Filter */}
        <Select 
          value={filters.branch} 
          onValueChange={(value) => handleFilterChange("branch", value)}
        >
          <SelectTrigger className="w-[140px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.value} value={branch.value}>
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assigned To Filter */}
        <Select 
          value={filters.assignedTo} 
          onValueChange={(value) => handleFilterChange("assignedTo", value)}
        >
          <SelectTrigger className="w-[140px]">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            {assignedTo.map((person) => (
              <SelectItem key={person.value} value={person.value}>
                {person.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Start Date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange("start", e.target.value)}
            className="w-36"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            placeholder="End Date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange("end", e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Active filters:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.search && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Search: "{filters.search}"
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Status: {statuses.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {filters.stage && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Stage: {stages.find(s => s.value === filters.stage)?.label}
              </span>
            )}
            {filters.region && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Region: {regions.find(r => r.value === filters.region)?.label}
              </span>
            )}
            {filters.branch && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Branch: {branches.find(b => b.value === filters.branch)?.label}
              </span>
            )}
            {filters.assignedTo && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Assigned: {assignedTo.find(a => a.value === filters.assignedTo)?.label}
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Date: {filters.dateRange.start || "..."} - {filters.dateRange.end || "..."}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}