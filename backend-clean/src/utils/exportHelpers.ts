import { Response } from "express";

/**
 * Export Helpers
 * Utilities for exporting data to CSV and Excel formats
 */

interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

/**
 * Convert data to CSV format
 */
export function generateCSV(data: any[], columns: ExportColumn[]): string {
  // Header row
  const headers = columns.map((col) => `"${col.label}"`).join(",");

  // Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let value = row[col.key];

        // Apply custom formatting if provided
        if (col.format && value !== null && value !== undefined) {
          value = col.format(value);
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return '""';
        }

        // Convert to string and escape quotes
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Send CSV response
 */
export function sendCSVResponse(
  res: Response,
  data: any[],
  columns: ExportColumn[],
  filename: string
) {
  const csv = generateCSV(data, columns);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

/**
 * Generate HTML table for Excel export
 * Excel can open HTML tables with proper formatting
 */
export function generateExcelHTML(
  data: any[],
  columns: ExportColumn[],
  title: string
): string {
  const headerCells = columns.map((col) => `<th>${col.label}</th>`).join("");

  const dataRows = data
    .map((row) => {
      const cells = columns
        .map((col) => {
          let value = row[col.key];

          // Apply custom formatting if provided
          if (col.format && value !== null && value !== undefined) {
            value = col.format(value);
          }

          // Handle null/undefined
          if (value === null || value === undefined) {
            value = "";
          }

          return `<td>${value}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
        }
        th {
          background-color: #4472C4;
          color: white;
          font-weight: bold;
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
        }
        td {
          padding: 8px;
          border: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        h1 {
          font-family: Arial, sans-serif;
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Generated: ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `;
}

/**
 * Send Excel response (HTML format that Excel can open)
 */
export function sendExcelResponse(
  res: Response,
  data: any[],
  columns: ExportColumn[],
  filename: string,
  title: string
) {
  const html = generateExcelHTML(data, columns, title);

  res.setHeader(
    "Content-Type",
    "application/vnd.ms-excel"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );
  res.send(html);
}

/**
 * Format currency for export
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Format date for export
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US");
}

/**
 * Format datetime for export
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US");
}

/**
 * Format boolean for export
 */
export function formatBoolean(value: boolean): string {
  return value ? "Yes" : "No";
}

/**
 * Format status for export
 */
export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, "_")
    .replace(/__+/g, "_")
    .toLowerCase();
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(
  prefix: string,
  extension: "csv" | "xls"
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  return sanitizeFilename(`${prefix}_${timestamp}.${extension}`);
}
