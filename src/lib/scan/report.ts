import { buildAfricanContext } from "./african-context";
import { SEVERITIES, type Finding, type ScanResult, type Severity } from "./types";

const WEIGHT: Record<Severity, number> = { Critical: 10, High: 7, Medium: 4, Low: 1, Info: 0 };

export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  const c = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 } as Record<Severity, number>;
  for (const f of findings) c[f.severity]++;
  return c;
}

export function overallRisk(findings: Finding[]): Severity | "None" {
  const c = countBySeverity(findings);
  return SEVERITIES.find((s) => s !== "Info" && c[s] > 0) ?? "None";
}

/** Groups duplicate findings (same name) across hosts. */
export function groupFindings(findings: Finding[]) {
  const map = new Map<string, { finding: Finding; hosts: string[] }>();
  for (const f of findings) {
    const g = map.get(f.name);
    const loc = `${f.host}:${f.port}`;
    if (g) {
      if (!g.hosts.includes(loc)) g.hosts.push(loc);
    } else map.set(f.name, { finding: f, hosts: [loc] });
  }
  return [...map.values()].sort((a, b) => WEIGHT[b.finding.severity] - WEIGHT[a.finding.severity]);
}

export function buildReport(scan: ScanResult, includeAfrican: boolean) {
  const f = scan.findings;
  const counts = countBySeverity(f);
  const risk = overallRisk(f);
  const groups = groupFindings(f);
  const actionable = groups.filter((g) => g.finding.severity !== "Info");
  const hosts = new Set(f.map((x) => x.host)).size;
  const riskScore = f.reduce((s, x) => s + WEIGHT[x.severity], 0);

  const executiveSummary =
    f.length === 0
      ? `The uploaded file "${scan.fileName}" contained no findings.`
      : `An assessment of ${hosts} host${hosts === 1 ? "" : "s"} from "${scan.fileName}" identified ${f.length} findings (${actionable.length} unique actionable issues). Overall risk is rated ${risk}, with ${counts.Critical} critical and ${counts.High} high severity findings requiring priority attention.`;

  const recommendations = actionable.slice(0, 15).map((g) => ({
    severity: g.finding.severity,
    title: g.finding.name,
    action: g.finding.solution || "Review vendor guidance and apply the latest security update.",
    affected: g.hosts.length,
  }));

  const conclusion =
    actionable.length === 0
      ? "No actionable vulnerabilities were found in the uploaded scan. Continue routine scanning to maintain this posture."
      : `Addressing the ${counts.Critical + counts.High} critical and high severity issues first will remove the largest share of risk (score ${riskScore}). Re-scan after remediation to confirm fixes.`;

  return {
    executiveSummary,
    counts,
    risk,
    riskScore,
    hosts,
    groups,
    recommendations,
    conclusion,
    africanContext: includeAfrican ? buildAfricanContext(f) : [],
  };
}

export type Report = ReturnType<typeof buildReport>;
