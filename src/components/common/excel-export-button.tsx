"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exportExcelWorkbook,
  type ExcelExportColumn,
} from "@/lib/export/excel";
import { useNotificationStore } from "@/stores/notification.store";

interface ExcelExportButtonProps<T> {
  columns: ExcelExportColumn<T>[];
  rows: T[];
  fileName: string;
  sheetName: string;
  title: string;
  label?: string;
}

export function ExcelExportButton<T>({
  columns,
  rows,
  fileName,
  sheetName,
  title,
  label = "Export to Excel",
}: ExcelExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportExcelWorkbook({
        fileName,
        sheets: [{
          name: sheetName,
          title,
          columns: columns.map((column) => ({
            ...column,
            value: (row: unknown) => column.value(row as T),
          })),
          rows: rows as unknown[],
        }],
      });
      addNotification({
        id: `excel-export-success-${Date.now()}`,
        title: "Excel export ready",
        message: `${rows.length} row${rows.length === 1 ? "" : "s"} exported to ${fileName}.xlsx.`,
        type: "success",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Excel export failed:", error);
      addNotification({
        id: `excel-export-error-${Date.now()}`,
        title: "Excel export failed",
        message: "The workbook could not be created. Please try again.",
        type: "error",
        timestamp: new Date(),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting || rows.length === 0}>
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? "Preparing Excel..." : label}
    </Button>
  );
}
