import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesManagerTeamProps { salesManagerId: string; team: { id: string; firstName: string; lastName: string; employeeId: string; status: string; achievementRate: number; trainingCompliance: number; }[]; }

export function SalesManagerTeam({ team }: SalesManagerTeamProps) {
  return <Card><CardHeader><CardTitle className="text-base">Assigned agents</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="pb-3 font-medium">Agent</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Achievement</th><th className="pb-3 font-medium">Compliance</th></tr></thead><tbody>{team.map((agent) => <tr key={agent.id} className="border-b border-slate-100 last:border-0"><td className="py-4"><p className="font-medium">{agent.firstName} {agent.lastName}</p><p className="mt-0.5 text-xs text-muted-foreground">{agent.employeeId}</p></td><td className="py-4"><Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>{agent.status}</Badge></td><td className="py-4 font-medium">{agent.achievementRate}%</td><td className="py-4">{agent.trainingCompliance}%</td></tr>)}</tbody></table></CardContent></Card>;
}
