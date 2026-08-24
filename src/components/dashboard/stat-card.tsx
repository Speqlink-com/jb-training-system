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
    <Card className={cn("group relative overflow-hidden border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-[#f6e8eb]">
              <Icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-[#9b1b36]" />
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
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border border-rose-100 bg-rose-50 text-rose-700"
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
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#9b1b36] via-[#cf6678] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </CardContent>
    </Card>
  );
}
