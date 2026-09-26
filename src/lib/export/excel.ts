export type ExcelCellValue = string | number | boolean | Date | null | undefined;

export interface ExcelExportColumn<T> {
  header: string;
  value: (row: T) => ExcelCellValue;
  width?: number;
  numberFormat?: string;
}

export interface ExcelExportSheet<T = unknown> {
  name: string;
  title: string;
  columns: ExcelExportColumn<T>[];
  rows: T[];
}

interface ExcelExportOptions {
  fileName: string;
  sheets: ExcelExportSheet[];
}

const INVALID_SHEET_NAME_CHARACTERS = /[\\/?*:[\]]/g;

function normalizeFileName(fileName: string) {
  const normalized = fileName.trim().replace(/\.xlsx$/i, "");
  return `${normalized || "export"}.xlsx`;
}

function normalizeSheetName(name: string, fallbackIndex: number) {
  const normalized = name.replace(INVALID_SHEET_NAME_CHARACTERS, " ").trim();
  return (normalized || `Sheet ${fallbackIndex + 1}`).slice(0, 31);
}

function downloadBuffer(buffer: ArrayBuffer, fileName: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = normalizeFileName(fileName);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function exportExcelWorkbook({ fileName, sheets }: ExcelExportOptions) {
  if (sheets.length === 0) {
    throw new Error("At least one worksheet is required for an Excel export.");
  }

  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  workbook.creator = "Jubilee Learning Hub";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const usedSheetNames = new Set<string>();

  sheets.forEach((sheetDefinition, sheetIndex) => {
    let sheetName = normalizeSheetName(sheetDefinition.name, sheetIndex);
    let suffix = 2;
    while (usedSheetNames.has(sheetName)) {
      const suffixText = ` ${suffix}`;
      sheetName = `${sheetName.slice(0, 31 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }
    usedSheetNames.add(sheetName);

    const worksheet = workbook.addWorksheet(sheetName, {
      views: [{ state: "frozen", ySplit: 4 }],
      properties: { defaultRowHeight: 18 },
      pageSetup: {
        orientation: sheetDefinition.columns.length > 7 ? "landscape" : "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    const lastColumn = Math.max(sheetDefinition.columns.length, 1);
    worksheet.mergeCells(1, 1, 1, lastColumn);
    worksheet.getCell(1, 1).value = sheetDefinition.title;
    worksheet.getCell(1, 1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 16 };
    worksheet.getCell(1, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8F1933" } };
    worksheet.getCell(1, 1).alignment = { vertical: "middle", horizontal: "left" };
    worksheet.getRow(1).height = 28;

    worksheet.mergeCells(2, 1, 2, lastColumn);
    worksheet.getCell(2, 1).value = `Generated ${new Date().toLocaleString("en-KE")}`;
    worksheet.getCell(2, 1).font = { italic: true, color: { argb: "FF64748B" }, size: 10 };

    const headerRow = worksheet.getRow(4);
    headerRow.values = sheetDefinition.columns.map((column) => column.header);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
    headerRow.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    headerRow.height = 24;

    sheetDefinition.columns.forEach((column, columnIndex) => {
      const worksheetColumn = worksheet.getColumn(columnIndex + 1);
      worksheetColumn.width = column.width ?? Math.max(12, Math.min(column.header.length + 4, 28));
    });

    sheetDefinition.rows.forEach((sourceRow, rowIndex) => {
      const worksheetRow = worksheet.addRow(
        sheetDefinition.columns.map((column) => column.value(sourceRow)),
      );

      if (rowIndex % 2 === 1) {
        worksheetRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }

      sheetDefinition.columns.forEach((column, columnIndex) => {
        const cell = worksheetRow.getCell(columnIndex + 1);
        if (column.numberFormat) cell.numFmt = column.numberFormat;
        cell.alignment = { vertical: "top", wrapText: true };
      });
    });

    if (sheetDefinition.columns.length > 0) {
      worksheet.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: 4, column: sheetDefinition.columns.length },
      };
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= 4) {
        row.eachCell((cell) => {
          cell.border = {
            bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
          };
        });
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBuffer(buffer as unknown as ArrayBuffer, fileName);
}
