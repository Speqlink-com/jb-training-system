"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  GraduationCap,
  Users,
  Calendar,
  Award
} from "lucide-react";
import { TRAINING_CATEGORIES } from "@/config/constants";

interface TrainerFiltersProps {
  onFiltersChange: (filters: TrainerFilters) => void;
}

export interface TrainerFilters {
  search: string;
  specialization: string;
  experience: string;
  capacity: string;
  availability: string;
  certification: string;
}

export function TrainerFilters({ onFiltersChange }: TrainerFiltersProps) {
  const [filters, setFilters] = useState<TrainerFilters>({
    search: "",
    specialization: "",
    experience: "",
    capacity: "",
    availability: "",
    certification: "",
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilter = (key: keyof TrainerFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Count active filters
    const count = Object.values(newFilters).filter(v => v !== "").length;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      specialization: "",
      experience: "",
      capacity: "",
      availability: "",
      certification: "",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setActiveFiltersCount(0);
  };

  const clearFilter = (key: keyof TrainerFilters) => {
    updateFilter(key, "");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Trainer Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search trainers by name, email, or employee ID..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => clearFilter("search")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Specialization */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Specialization
            </label>
            <Select value={filters.specialization} onValueChange={(value) => updateFilter("specialization", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All specializations</SelectItem>
                {Object.values(TRAINING_CATEGORIES).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Experience Level
            </label>
            <Select value={filters.experience} onValueChange={(value) => updateFilter("experience", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                <SelectItem value="expert">Expert (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Training Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Capacity Range
            </label>
            <Select value={filters.capacity} onValueChange={(value) => updateFilter("capacity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All capacities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All capacities</SelectItem>
                <SelectItem value="small">Small (1-20)</SelectItem>
                <SelectItem value="medium">Medium (21-50)</SelectItem>
                <SelectItem value="large">Large (51-100)</SelectItem>
                <SelectItem value="xlarge">Extra Large (100+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Availability */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability
            </label>
            <Select value={filters.availability} onValueChange={(value) => updateFilter("availability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All availabilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All availabilities</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="overloaded">Overloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Certification */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certification Status
            </label>
            <Select value={filters.certification} onValueChange={(value) => updateFilter("certification", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All certifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All certifications</SelectItem>
                <SelectItem value="certified">Certified</SelectItem>
                <SelectItem value="pending">Certification Pending</SelectItem>
                <SelectItem value="none">No Certification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("search")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.specialization && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.specialization}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("specialization")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.experience && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Experience: {filters.experience}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("experience")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.capacity && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Capacity: {filters.capacity}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("capacity")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.availability && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.availability}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("availability")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.certification && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.certification}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("certification")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}