import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface SalesManagerActivityProps { salesManagerId: string; activities: { id: string; type: string; description: string; timestamp: string }[]; }

export function SalesManagerActivity({ activities }: SalesManagerActivityProps) {
  return <Card><CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader><CardContent className="space-y-5">{activities.map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50" /><div><p className="text-sm font-medium">{activity.description}</p><p className="mt-1 text-xs text-muted-foreground">{activity.type.replaceAll("_", " ")} · {formatDate(activity.timestamp, "dd MMM yyyy, HH:mm")}</p></div></div>)}</CardContent></Card>;
}
