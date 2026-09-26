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
    <Card className={cn("relative overflow-hidden rounded-xl border-[#dce1e3] bg-white shadow-[0_1px_2px_rgba(20,30,34,0.025)]", className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6e8eb]">
              <Icon className="h-4 w-4 text-[#9b1b36]" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-slate-500">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <span
                className={cn(
                  "font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-[#f6e8eb] text-[#8f1933]"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-slate-400">
                from last month
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
