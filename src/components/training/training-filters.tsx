"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRAINING_CATEGORIES } from "@/config/constants";
import { Search, Filter, X } from "lucide-react";

export interface TrainingFilterValues {
  search: string;
  category: string;
  trainer: string;
  branch: string;
  status: string;
  dateRange: { start: string; end: string };
}

interface TrainingFiltersProps {
  filters: TrainingFilterValues;
  onFiltersChange: (filters: TrainingFilterValues) => void;
}

export function TrainingFilters({ filters, onFiltersChange }: TrainingFiltersProps) {
  const handleFilterChange = (key: Exclude<keyof TrainingFilterValues, "dateRange">, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (key: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [key]: value },
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      trainer: "",
      branch: "",
      status: "",
      dateRange: { start: "", end: "" },
    };
    onFiltersChange(clearedFilters);
  };

  const flatFilterValues = [
    filters.search,
    filters.category,
    filters.trainer,
    filters.branch,
    filters.status,
    filters.dateRange.start,
    filters.dateRange.end,
  ];
  const activeFilterCount = flatFilterValues.filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Filters</h3>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trainings..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {Object.values(TRAINING_CATEGORIES).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Trainer Filter */}
            <Select value={filters.trainer} onValueChange={(value) => handleFilterChange("trainer", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Trainer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All trainers</SelectItem>
                <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                <SelectItem value="mike-chen">Mike Chen</SelectItem>
                <SelectItem value="lisa-patel">Lisa Patel</SelectItem>
                <SelectItem value="david-kim">David Kim</SelectItem>
                <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
              </SelectContent>
            </Select>

            {/* Branch Filter */}
            <Select value={filters.branch} onValueChange={(value) => handleFilterChange("branch", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All branches</SelectItem>
                <SelectItem value="mumbai-central">Mumbai Central</SelectItem>
                <SelectItem value="delhi-north">Delhi North</SelectItem>
                <SelectItem value="bangalore-south">Bangalore South</SelectItem>
                <SelectItem value="pune-west">Pune West</SelectItem>
                <SelectItem value="hyderabad-east">Hyderabad East</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              aria-label="Training start date"
              value={filters.dateRange.start}
              onChange={(event) => handleDateRangeChange("start", event.target.value)}
            />
            <Input
              type="date"
              aria-label="Training end date"
              value={filters.dateRange.end}
              onChange={(event) => handleDateRangeChange("end", event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
