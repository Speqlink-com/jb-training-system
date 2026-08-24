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
  Target,
  UserCheck
} from "lucide-react";

interface SalesManagerFiltersProps {
  filters: {
    search: string;
    region: string;
    branch: string;
    status: string;
    performanceRange: { min: string; max: string };
  };
  onFiltersChange: (filters: any) => void;
}

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

const statuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

export function SalesManagerFilters({ filters, onFiltersChange }: SalesManagerFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePerformanceRangeChange = (type: "min" | "max", value: string) => {
    onFiltersChange({
      ...filters,
      performanceRange: {
        ...filters.performanceRange,
        [type]: value,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      region: "",
      branch: "",
      status: "",
      performanceRange: { min: "", max: "" },
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.region || 
    filters.branch || 
    filters.status ||
    filters.performanceRange.min ||
    filters.performanceRange.max;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Region Filter */}
        <Select 
          value={filters.region} 
          onValueChange={(value) => handleFilterChange("region", value)}
        >
          <SelectTrigger className="w-[140px]">
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

        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[120px]">
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

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Performance Range Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Performance Range:</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min %"
            value={filters.performanceRange.min}
            onChange={(e) => handlePerformanceRangeChange("min", e.target.value)}
            className="w-20"
            min="0"
            max="200"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max %"
            value={filters.performanceRange.max}
            onChange={(e) => handlePerformanceRangeChange("max", e.target.value)}
            className="w-20"
            min="0"
            max="200"
          />
          <span className="text-sm text-muted-foreground">%</span>
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
            {filters.status && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Status: {statuses.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {(filters.performanceRange.min || filters.performanceRange.max) && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Performance: {filters.performanceRange.min || "0"}% - {filters.performanceRange.max || "∞"}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}