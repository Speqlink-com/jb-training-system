import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users,
  Calendar,
  Award
} from "lucide-react";

interface AgentPerformanceProps {
  agent: {
    production?: {
      monthlyProduction: number;
      averageTicketSize: number;
      productivity: number;
      ytdProduction?: number;
      targetAchievement?: number;
    };
  };
}

// Mock performance data - replace with API calls
const mockPerformanceData = {
  monthlyTargets: [
    { month: "Jan", target: 4000000, actual: 4200000, achievement: 105 },
    { month: "Feb", target: 4000000, actual: 3800000, achievement: 95 },
    { month: "Mar", target: 4000000, actual: 4500000, achievement: 112 },
    { month: "Apr", target: 4000000, actual: 4100000, achievement: 102 },
    { month: "May", target: 4000000, actual: 4300000, achievement: 108 },
    { month: "Jun", target: 4000000, actual: 3900000, achievement: 98 },
    { month: "Jul", target: 4000000, actual: 4600000, achievement: 115 },
    { month: "Aug", target: 4000000, actual: 4800000, achievement: 120 },
  ],
  clientMetrics: {
    newClients: 25,
    retainedClients: 180,
    averageClientValue: 185000,
    clientSatisfaction: 94
  },
  rankings: {
    branchRank: 3,
    totalAgentsInBranch: 48,
    regionRank: 12,
    totalAgentsInRegion: 243,
    nationalRank: 45,
    totalAgentsNational: 2481
  }
};

export function AgentPerformance({ agent }: AgentPerformanceProps) {
  const performanceStats = [
    {
      title: "YTD Production",
      value: agent.production?.ytdProduction ? formatCurrency(agent.production.ytdProduction) : "No data",
      description: "Year to date performance",
      icon: DollarSign,
      trend: { value: 18, isPositive: true },
    },
    {
      title: "Monthly Target",
      value: agent.production?.targetAchievement ? `${agent.production.targetAchievement}%` : "No data",
      description: "Target achievement rate",
      icon: Target,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "New Clients",
      value: mockPerformanceData.clientMetrics.newClients.toString(),
      description: "Acquired this month",
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Client Satisfaction",
      value: `${mockPerformanceData.clientMetrics.clientSatisfaction}%`,
      description: "Customer feedback score",
      icon: Award,
      trend: { value: 3, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>
              Target vs actual performance by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPerformanceData.monthlyTargets.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{data.month} 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Target: {formatCurrency(data.target)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(data.actual)}</p>
                    <p className={`text-sm ${
                      data.achievement >= 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.achievement}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Metrics
            </CardTitle>
            <CardDescription>
              Client acquisition and retention statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {mockPerformanceData.clientMetrics.newClients}
                  </p>
                  <p className="text-sm text-muted-foreground">New Clients</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {mockPerformanceData.clientMetrics.retainedClients}
                  </p>
                  <p className="text-sm text-muted-foreground">Retained Clients</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Client Value:</span>
                  <span className="font-medium">
                    {formatCurrency(mockPerformanceData.clientMetrics.averageClientValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client Satisfaction:</span>
                  <span className="font-medium">
                    {mockPerformanceData.clientMetrics.clientSatisfaction}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retention Rate:</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Rankings
          </CardTitle>
          <CardDescription>
            Agent ranking across different levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                #{mockPerformanceData.rankings.branchRank}
              </p>
              <p className="text-sm text-muted-foreground">
                of {mockPerformanceData.rankings.totalAgentsInBranch} in Branch
              </p>
              <p className="text-xs text-muted-foreground mt-1">Nairobi CBD</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-orange-600">
                #{mockPerformanceData.rankings.regionRank}
              </p>
              <p className="text-sm text-muted-foreground">
                of {mockPerformanceData.rankings.totalAgentsInRegion} in Region
              </p>
              <p className="text-xs text-muted-foreground mt-1">Nairobi Region</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                #{mockPerformanceData.rankings.nationalRank}
              </p>
              <p className="text-sm text-muted-foreground">
                of {mockPerformanceData.rankings.totalAgentsNational} Nationally
              </p>
              <p className="text-xs text-muted-foreground mt-1">All Branches</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on performance data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Strong Performance Trend</p>
                <p className="text-sm text-green-700">
                  Consistent target achievement over the last 3 months with 108% average
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Excellent Client Retention</p>
                <p className="text-sm text-blue-700">
                  92% client retention rate indicates strong relationship management skills
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Top Performer in Branch</p>
                <p className="text-sm text-yellow-700">
                  Ranked #3 out of 48 agents in Nairobi CBD branch
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}