import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
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
              <Icon className="h-4 w-4 text-[#a90024]" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
