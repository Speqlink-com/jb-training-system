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
import { Search, Filter, X } from "lucide-react";

interface AgentsFiltersProps {
  filters: {
    search: string;
    branch: string;
    sm: string;
    hoa: string;
    compliance: string;
  };
  onFiltersChange: (filters: any) => void;
}

// Mock data for filter options - replace with API calls
const branches = [
  { id: "1", name: "Nairobi CBD", code: "NCB" },
  { id: "2", name: "Westlands", code: "WLD" },
  { id: "3", name: "Karen", code: "KRN" },
  { id: "4", name: "Mombasa", code: "MSA" },
];

const salesManagers = [
  { id: "1", firstName: "Jane", lastName: "Doe" },
  { id: "2", firstName: "James", lastName: "Ochieng" },
  { id: "3", firstName: "Sarah", lastName: "Mwangi" },
];

const hoas = [
  { id: "1", firstName: "Peter", lastName: "Mwangi" },
  { id: "2", firstName: "Grace", lastName: "Akinyi" },
];

export function AgentsFilters({ filters, onFiltersChange }: AgentsFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      branch: "",
      sm: "",
      hoa: "",
      compliance: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents by name, ID, or email..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Branch Filter */}
      <Select value={filters.branch} onValueChange={(value) => updateFilter("branch", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All branches</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name} ({branch.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sales Manager Filter */}
      <Select value={filters.sm} onValueChange={(value) => updateFilter("sm", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All SMs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All SMs</SelectItem>
          {salesManagers.map((sm) => (
            <SelectItem key={sm.id} value={sm.id}>
              {sm.firstName} {sm.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* HOA Filter */}
      <Select value={filters.hoa} onValueChange={(value) => updateFilter("hoa", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All HOAs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All HOAs</SelectItem>
          {hoas.map((hoa) => (
            <SelectItem key={hoa.id} value={hoa.id}>
              {hoa.firstName} {hoa.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Compliance Filter */}
      <Select value={filters.compliance} onValueChange={(value) => updateFilter("compliance", value)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All compliance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All compliance</SelectItem>
          <SelectItem value="high">High (95%+)</SelectItem>
          <SelectItem value="medium">Medium (85-94%)</SelectItem>
          <SelectItem value="low">Low (&lt;85%)</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}