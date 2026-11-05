export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low", "Info"];

export interface Finding {
  id: string;
  name: string;
  severity: Severity;
  host: string;
  port: string;
  pluginId?: string | undefined;
  cve?: string | undefined;
  cvss?: number | undefined;
  description: string;
  solution: string;
  synopsis?: string | undefined;
}

export interface ScanResult {
  fileName: string;
  fileType: "nessus" | "csv" | "xlsx" | "demo";
  uploadedAt: string;
  findings: Finding[];
  isDemo: boolean;
}
