import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: StatCardProps) {
  return (
    <Card className={cn("relative bg-white border-gray-200 hover:border-red-200 transition-colors shadow-sm hover:shadow-md group overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
            {title}
          </p>
          {Icon && (
            <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Icon className="h-5 w-5 text-red-600" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-gray-500">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <span
                className={cn(
                  "font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "text-green-700 bg-green-50 border border-green-200" 
                    : "text-red-700 bg-red-50 border border-red-200"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-gray-500">
                from last month
              </span>
            </div>
          )}
        </div>
        {/* Subtle red accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-300 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg"></div>
      </CardContent>
    </Card>
  );
}