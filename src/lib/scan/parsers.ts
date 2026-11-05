import Papa from "papaparse";
import type { Finding, ScanResult, Severity } from "./types";

export const ACCEPTED_EXTENSIONS = [".nessus", ".csv", ".xlsx"] as const;

export function normalizeSeverity(raw: unknown): Severity {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "4" || v.startsWith("crit")) return "Critical";
  if (v === "3" || v.startsWith("high")) return "High";
  if (v === "2" || v.startsWith("med") || v.startsWith("mod")) return "Medium";
  if (v === "1" || v.startsWith("low")) return "Low";
  return "Info";
}

function pick(row: Record<string, unknown>, keys: string[]): string {
  const lower: Record<string, unknown> = {};
  for (const k of Object.keys(row)) lower[k.trim().toLowerCase()] = row[k];
  for (const k of keys) {
    const v = lower[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** Converts tabular rows (CSV / Excel, e.g. Nessus CSV export) into findings. Rows without a name are skipped. */
export function rowsToFindings(rows: Record<string, unknown>[]): Finding[] {
  const out: Finding[] = [];
  rows.forEach((row, i) => {
    const name = pick(row, ["name", "plugin name", "vulnerability", "title", "finding", "issue"]);
    if (!name) return;
    const cvssRaw = pick(row, ["cvss v3.0 base score", "cvss v3 base score", "cvss v2.0 base score", "cvss", "cvss score"]);
    const cvss = cvssRaw ? Number.parseFloat(cvssRaw) : undefined;
    let sevRaw = pick(row, ["risk", "severity", "risk factor", "threat"]);
    if (!sevRaw && cvss !== undefined && !Number.isNaN(cvss)) {
      sevRaw = cvss >= 9 ? "critical" : cvss >= 7 ? "high" : cvss >= 4 ? "medium" : cvss > 0 ? "low" : "info";
    }
    out.push({
      id: `f-${i}`,
      name,
      severity: normalizeSeverity(sevRaw || "none"),
      host: pick(row, ["host", "ip", "ip address", "asset", "hostname", "target"]) || "Unknown",
      port: pick(row, ["port", "service"]) || "-",
      pluginId: pick(row, ["plugin id", "pluginid", "id"]) || undefined,
      cve: pick(row, ["cve", "cves"]) || undefined,
      cvss: cvss !== undefined && !Number.isNaN(cvss) ? cvss : undefined,
      description: pick(row, ["description", "details"]),
      solution: pick(row, ["solution", "remediation", "recommendation", "fix"]),
      synopsis: pick(row, ["synopsis", "summary"]) || undefined,
    });
  });
  return out;
}

export function parseCsv(text: string): Finding[] {
  const res = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true });
  return rowsToFindings(res.data);
}

export function parseNessus(xml: string): Finding[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("The .nessus file is not valid XML.");
  const hosts = Array.from(doc.getElementsByTagName("ReportHost"));
  if (hosts.length === 0) throw new Error("No hosts found in the .nessus file.");
  const findings: Finding[] = [];
  let i = 0;
  for (const host of hosts) {
    const hostName = host.getAttribute("name") ?? "Unknown";
    for (const item of Array.from(host.getElementsByTagName("ReportItem"))) {
      const text = (tag: string) => item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
      const cves = Array.from(item.getElementsByTagName("cve")).map((c) => c.textContent?.trim()).filter(Boolean);
      const cvssRaw = text("cvss3_base_score") || text("cvss_base_score");
      const cvss = cvssRaw ? Number.parseFloat(cvssRaw) : undefined;
      findings.push({
        id: `f-${i++}`,
        name: item.getAttribute("pluginName") ?? "Unnamed finding",
        severity: normalizeSeverity(item.getAttribute("severity") ?? text("risk_factor")),
        host: hostName,
        port: `${item.getAttribute("port") ?? "0"}/${item.getAttribute("protocol") ?? "tcp"}`,
        pluginId: item.getAttribute("pluginID") ?? undefined,
        cve: cves.length ? cves.join(", ") : undefined,
        cvss: cvss !== undefined && !Number.isNaN(cvss) ? cvss : undefined,
        description: text("description"),
        solution: text("solution"),
        synopsis: text("synopsis") || undefined,
      });
    }
  }
  return findings;
}

export async function parseXlsx(buf: ArrayBuffer): Promise<Finding[]> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buf, { type: "array" });
  const first = wb.SheetNames[0];
  const sheet = first ? wb.Sheets[first] : undefined;
  if (!sheet) return [];
  return rowsToFindings(XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" }));
}

export async function parseScanFile(file: File): Promise<ScanResult> {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  let findings: Finding[];
  let fileType: ScanResult["fileType"];
  if (ext === ".nessus") {
    findings = parseNessus(await file.text());
    fileType = "nessus";
  } else if (ext === ".csv") {
    findings = parseCsv(await file.text());
    fileType = "csv";
  } else if (ext === ".xlsx") {
    findings = await parseXlsx(await file.arrayBuffer());
    fileType = "xlsx";
  } else {
    throw new Error("Unsupported file type. Upload a .nessus, .csv or .xlsx scan file.");
  }
  return { fileName: file.name, fileType, uploadedAt: new Date().toISOString(), findings, isDemo: false };
}
