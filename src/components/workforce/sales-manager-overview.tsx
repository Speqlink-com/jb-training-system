import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Target, TrendingUp, Users } from "lucide-react";

interface SalesManagerOverviewProps {
  salesManager: {
    teamSize: number;
    activeAgents: number;
    monthlyTarget: number;
    monthlyAchievement: number;
    achievementRate: number;
    trainingCompliance: number;
    certifications: { id: string; name: string; status: "COMPLETED" | "PENDING"; issuer: string }[];
  };
}

export function SalesManagerOverview({ salesManager }: SalesManagerOverviewProps) {
  const metrics = [
    { title: "Team members", value: salesManager.teamSize, description: `${salesManager.activeAgents} active agents`, icon: Users },
    { title: "Monthly production", value: formatCurrency(salesManager.monthlyAchievement), description: "Current month", icon: TrendingUp, trend: { value: salesManager.achievementRate - 100, isPositive: salesManager.achievementRate >= 100 } },
    { title: "Target attainment", value: `${salesManager.achievementRate}%`, description: `${formatCurrency(salesManager.monthlyTarget)} target`, icon: Target },
    { title: "Training compliance", value: `${salesManager.trainingCompliance}%`, description: "Team completion rate", icon: CheckCircle2 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">{metrics.map((metric) => <StatCard key={metric.title} {...metric} />)}</div>
        <Card><CardHeader><CardTitle className="text-base">Monthly target progress</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Achievement</span><span className="font-semibold">{formatCurrency(salesManager.monthlyAchievement)} of {formatCurrency(salesManager.monthlyTarget)}</span></div><Progress value={salesManager.achievementRate} className="h-2.5" /></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Certifications</CardTitle></CardHeader><CardContent className="space-y-4">{salesManager.certifications.map((certification) => <div key={certification.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"><p className="text-sm font-medium">{certification.name}</p><p className="mt-1 text-xs text-muted-foreground">{certification.issuer}</p><span className={certification.status === "COMPLETED" ? "mt-2 inline-block text-xs font-medium text-emerald-700" : "mt-2 inline-block text-xs font-medium text-amber-700"}>{certification.status === "COMPLETED" ? "Completed" : "Pending"}</span></div>)}</CardContent></Card>
    </div>
  );
}
