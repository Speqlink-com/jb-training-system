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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Filter,
  X,
  Calendar,
  MapPin,
  Building2,
  BarChart3,
  RefreshCw
} from "lucide-react";

interface ReportFiltersProps {
  filters: {
    dateRange: { start: string; end: string };
    region: string;
    branch: string;
    reportType: string;
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

const reportTypes = [
  { value: "performance", label: "Performance Reports" },
  { value: "training", label: "Training Analytics" },
  { value: "workforce", label: "Workforce Metrics" },
  { value: "onboarding", label: "Onboarding Stats" },
  { value: "compliance", label: "Compliance Reports" },
];

const quickRanges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last 6 months", value: "6m" },
  { label: "This year", value: "1y" },
];

export function ReportFilters({ filters, onFiltersChange }: ReportFiltersProps) {
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

  const handleQuickRange = (range: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3m":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    onFiltersChange({
      ...filters,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { start: "", end: "" },
      region: "",
      branch: "",
      reportType: "",
    });
  };

  const hasActiveFilters = 
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.region || 
    filters.branch || 
    filters.reportType;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-medium">Report Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Main Filters Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Date Range */}
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

            {/* Report Type Filter */}
            <Select 
              value={filters.reportType} 
              onValueChange={(value) => handleFilterChange("reportType", value)}
            >
              <SelectTrigger className="w-[160px]">
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Date Ranges */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Quick ranges:</span>
            {quickRanges.map((range) => (
              <Button
                key={range.value}
                variant="outline"
                size="sm"
                onClick={() => handleQuickRange(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <span className="text-muted-foreground">Active filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <span className="px-2 py-1 bg-secondary rounded-md">
                    Date: {filters.dateRange.start || "..."} - {filters.dateRange.end || "..."}
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
                {filters.reportType && (
                  <span className="px-2 py-1 bg-secondary rounded-md">
                    Type: {reportTypes.find(t => t.value === filters.reportType)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}