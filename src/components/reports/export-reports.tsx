"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotificationStore } from "@/stores/notification.store";
import { exportExcelWorkbook, type ExcelExportSheet } from "@/lib/export/excel";
import { 
  Download, 
  FileText, 
  Table, 
  BarChart3,
  Calendar,
  Settings
} from "lucide-react";

const reportTypes = [
  { id: "performance", label: "Performance Analytics", icon: BarChart3 },
  { id: "training", label: "Training Reports", icon: FileText },
  { id: "workforce", label: "Workforce Metrics", icon: Table },
  { id: "onboarding", label: "Onboarding Statistics", icon: Calendar },
];

const exportFormats = [
  { value: "excel", label: "Excel Spreadsheet" },
];

interface ReportExportData {
  performance: {
    totalAgents: number;
    activeAgents: number;
    monthlyTarget: number;
    monthlyAchievement: number;
    achievementRate: number;
    avgTicketSize: number;
    conversionRate: number;
    customerSatisfaction: number;
  };
  training: {
    totalSessions: number;
    completedSessions: number;
    totalParticipants: number;
    averageAttendance: number;
    averageEffectiveness: number;
    complianceRate: number;
    categoriesBreakdown: Record<string, number>;
  };
  workforce: {
    totalSalesManagers: number;
    totalHOAs: number;
    totalTrainers: number;
    avgTeamSize: number;
    topPerformers: Array<{ name: string; role: string; performance: number; region: string }>;
  };
  onboarding: {
    totalCandidates: number;
    activeCandidates: number;
    approvedCandidates: number;
    onboardedAgents: number;
    conversionRate: number;
    avgProcessingTime: number;
    pipeline: Record<string, number>;
  };
}

interface ExportReportsProps {
  data: ReportExportData;
}

interface MetricRow {
  metric: string;
  value: string | number;
}

function createMetricSheet(name: string, title: string, rows: MetricRow[]): ExcelExportSheet {
  return {
    name,
    title,
    rows,
    columns: [
      { header: "Metric", value: (row) => (row as MetricRow).metric, width: 30 },
      { header: "Value", value: (row) => (row as MetricRow).value, width: 28 },
    ],
  };
}

export function ExportReports({ data }: ExportReportsProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("excel");
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleReportToggle = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  const handleExport = async () => {
    if (selectedReports.length === 0 || !exportFormat) {
      addNotification({
        id: Date.now().toString(),
        title: "Export Error",
        message: "Please select at least one report and an export format.",
        type: "error",
        timestamp: new Date().toISOString(),
        read: false,
      });
      return;
    }

    setIsExporting(true);
    try {
      const sheets: ExcelExportSheet[] = [];

      if (selectedReports.includes("performance")) {
        sheets.push(createMetricSheet("Performance", "Performance analytics", [
          { metric: "Total agents", value: data.performance.totalAgents },
          { metric: "Active agents", value: data.performance.activeAgents },
          { metric: "Monthly target (KES)", value: data.performance.monthlyTarget },
          { metric: "Monthly achievement (KES)", value: data.performance.monthlyAchievement },
          { metric: "Achievement rate (%)", value: data.performance.achievementRate },
          { metric: "Average ticket size (KES)", value: data.performance.avgTicketSize },
          { metric: "Conversion rate (%)", value: data.performance.conversionRate },
          { metric: "Customer satisfaction", value: data.performance.customerSatisfaction },
        ]));
      }

      if (selectedReports.includes("training")) {
        sheets.push(createMetricSheet("Training", "Training analytics", [
          { metric: "Total sessions", value: data.training.totalSessions },
          { metric: "Completed sessions", value: data.training.completedSessions },
          { metric: "Total participants", value: data.training.totalParticipants },
          { metric: "Average attendance (%)", value: data.training.averageAttendance },
          { metric: "Average effectiveness (%)", value: data.training.averageEffectiveness },
          { metric: "Compliance rate (%)", value: data.training.complianceRate },
          ...Object.entries(data.training.categoriesBreakdown).map(([category, count]) => ({
            metric: `Category: ${category}`,
            value: count,
          })),
        ]));
      }

      if (selectedReports.includes("workforce")) {
        sheets.push(createMetricSheet("Workforce", "Workforce metrics", [
          { metric: "Sales managers", value: data.workforce.totalSalesManagers },
          { metric: "Heads of agency", value: data.workforce.totalHOAs },
          { metric: "Trainers", value: data.workforce.totalTrainers },
          { metric: "Average team size", value: data.workforce.avgTeamSize },
          ...data.workforce.topPerformers.map((performer, index) => ({
            metric: `Top performer ${index + 1}`,
            value: `${performer.name}, ${performer.role}, ${performer.region} (${performer.performance}%)`,
          })),
        ]));
      }

      if (selectedReports.includes("onboarding")) {
        sheets.push(createMetricSheet("Onboarding", "Onboarding statistics", [
          { metric: "Total candidates", value: data.onboarding.totalCandidates },
          { metric: "Active candidates", value: data.onboarding.activeCandidates },
          { metric: "Approved candidates", value: data.onboarding.approvedCandidates },
          { metric: "Onboarded agents", value: data.onboarding.onboardedAgents },
          { metric: "Conversion rate (%)", value: data.onboarding.conversionRate },
          { metric: "Average processing time (days)", value: data.onboarding.avgProcessingTime },
          ...Object.entries(data.onboarding.pipeline).map(([stage, count]) => ({
            metric: `Pipeline: ${stage}`,
            value: count,
          })),
        ]));
      }

      await exportExcelWorkbook({ fileName: "learning-hub-reports", sheets });
      
      addNotification({
        id: Date.now().toString(),
        title: "Export Successful",
        message: `${selectedReports.length} report(s) exported successfully as ${exportFormat.toUpperCase()}.`,
        type: "success",
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Reset form
      setSelectedReports([]);
    } catch {
      addNotification({
        id: Date.now().toString(),
        title: "Export Failed",
        message: "Failed to export reports. Please try again.",
        type: "error",
        timestamp: new Date().toISOString(),
        read: false,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Generate and download comprehensive reports in your preferred format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Select Reports to Export</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((report) => {
              const ReportIcon = report.icon;
              return (
                <div key={report.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={(checked) => handleReportToggle(report.id, checked as boolean)}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <ReportIcon className="h-4 w-4 text-muted-foreground" />
                    <label 
                      htmlFor={report.id}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {report.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Export Format</h4>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose export format" />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="font-medium">Export Options</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="include-charts" defaultChecked />
              <label htmlFor="include-charts" className="text-sm font-medium cursor-pointer">
                Include charts and visualizations
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-raw-data" />
              <label htmlFor="include-raw-data" className="text-sm font-medium cursor-pointer">
                Include raw data tables
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-summary" defaultChecked />
              <label htmlFor="include-summary" className="text-sm font-medium cursor-pointer">
                Include executive summary
              </label>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedReports.length > 0 && (
              <span>{selectedReports.length} report(s) selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Options
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || selectedReports.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Reports"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
