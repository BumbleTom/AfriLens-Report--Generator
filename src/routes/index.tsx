import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FileUp, Printer, ShieldAlert, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ACCEPTED_EXTENSIONS, parseScanFile } from "@/lib/scan/parsers";
import { getDemoScan } from "@/lib/scan/demo";
import { buildReport, type Report } from "@/lib/scan/report";
import { SEVERITIES, type ScanResult, type Severity } from "@/lib/scan/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AfriLens Report AI — Vulnerability reports from your scans" },
      { name: "description", content: "Upload Nessus, CSV or Excel scans and get full vulnerability reports with African context explanations." },
      { property: "og:title", content: "AfriLens Report AI" },
      { property: "og:description", content: "Turn real Nessus, CSV and Excel scan results into clear security reports with local analogies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SEV_CLASS: Record<Severity, string> = {
  Critical: "bg-sev-critical",
  High: "bg-sev-high",
  Medium: "bg-sev-medium",
  Low: "bg-sev-low",
  Info: "bg-sev-info",
};

function SevBadge({ s }: { s: Severity | "None" }) {
  return (
    <span className={cn("inline-block rounded px-2 py-0.5 text-xs font-semibold text-primary-foreground", s === "None" ? "bg-muted-foreground" : SEV_CLASS[s])}>
      {s}
    </span>
  );
}

function Index() {
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [african, setAfrican] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
      setError("Unsupported file type. Upload a Nessus (.nessus), CSV (.csv) or Excel (.xlsx) scan file.");
      return;
    }
    setBusy(true);
    try {
      const result = await parseScanFile(file);
      if (result.findings.length === 0) {
        setError("No vulnerability findings could be read from this file. Check that it is a scan export with a Name/Plugin Name column.");
      } else {
        setDemoMode(false);
        setScan(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this file.");
    } finally {
      setBusy(false);
    }
  }, []);

  const toggleDemo = (on: boolean) => {
    setDemoMode(on);
    if (on) setScan(getDemoScan());
    else if (scan?.isDemo) setScan(null);
  };

  const report = useMemo(() => (scan ? buildReport(scan, african) : null), [scan, african]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-hero cyber-grid text-primary-foreground print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold leading-none">AfriLens Report AI</h1>
              <p className="text-xs text-primary-foreground/70">Vulnerability reporting with African context</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <Switch className="data-[state=checked]:bg-secondary" id="african" checked={african} onCheckedChange={setAfrican} />
              <Label htmlFor="african">African Context</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch className="data-[state=checked]:bg-secondary" id="demo" checked={demoMode} onCheckedChange={toggleDemo} />
              <Label htmlFor="demo">Demo Mode</Label>
            </div>
          </div>
        </div>
      </header>

      {demoMode && (
        <div className="bg-sev-medium/20 py-2 text-center text-sm font-medium print:hidden">
          Demo Mode is ON — showing sample presentation data, not real scan results.
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8">
        <input
          ref={inputRef}
          type="file"
          accept=".nessus,.csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />

        {!report ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
            className={cn(
              "mx-auto mt-10 max-w-2xl rounded-xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors",
              dragging && "border-primary bg-secondary",
            )}
          >
            <FileUp className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold">No vulnerability assessments have been uploaded yet.</h2>
            <p className="mt-2 text-muted-foreground">
              Upload a Nessus (.nessus), CSV (.csv) or Excel (.xlsx) scan file to generate your first report.
            </p>
            <Button className="mt-6" size="lg" onClick={() => inputRef.current?.click()} disabled={busy}>
              <Upload className="mr-2 h-4 w-4" />
              {busy ? "Analysing…" : "Upload scan file"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">or drag and drop it here — files are processed in your browser</p>
            {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
          </div>
        ) : (
          <ReportView
            report={report}
            scan={scan!}
            african={african}
            onNew={() => inputRef.current?.click()}
            onClear={() => {
              setScan(null);
              setDemoMode(false);
            }}
            error={error}
            busy={busy}
          />
        )}
      </main>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid-page border-t border-border pt-6">
      <h3 className="font-display text-xl font-semibold">
        <span className="mr-2 text-primary">{n}.</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ReportView({ report, scan, african, onNew, onClear, error, busy }: { report: Report; scan: ScanResult; african: boolean; onNew: () => void; onClear: () => void; error: string | null; busy: boolean }) {
  const total = SEVERITIES.reduce((s, k) => s + report.counts[k], 0);
  const max = Math.max(1, ...SEVERITIES.map((k) => report.counts[k]));
  let n = 0;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Report for</p>
          <h2 className="font-display text-3xl font-semibold">{scan.fileName}</h2>
          <p className="text-sm text-muted-foreground">
            {scan.isDemo ? "Sample demo data" : `${scan.fileType.toUpperCase()} upload`} · {new Date(scan.uploadedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print / PDF
          </Button>
          {!scan.isDemo && (
            <Button onClick={onNew} disabled={busy}>
              <Upload className="mr-2 h-4 w-4" /> {busy ? "Analysing…" : "New scan"}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear report">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Overall risk"><SevBadge s={report.risk} /></Stat>
        <Stat label="Total findings">{total}</Stat>
        <Stat label="Hosts">{report.hosts}</Stat>
        <Stat label="Risk score">{report.riskScore}</Stat>
      </div>

      <Section n={++n} title="Executive Summary">
        <p className="leading-relaxed">{report.executiveSummary}</p>
      </Section>

      <Section n={++n} title="Findings Summary">
        <div className="space-y-2">
          {SEVERITIES.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-20 text-sm">{s}</span>
              <div className="h-5 flex-1 rounded bg-muted">
                <div className={cn("h-5 rounded", SEV_CLASS[s])} style={{ width: `${(report.counts[s] / max) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-sm font-semibold">{report.counts[s]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section n={++n} title="Detailed Findings">
        <div className="space-y-3">
          {report.groups.map(({ finding: f, hosts }) => (
            <details key={f.name} className="rounded-lg border border-border bg-card p-4">
              <summary className="flex cursor-pointer flex-wrap items-center gap-2">
                <SevBadge s={f.severity} />
                <span className="font-medium">{f.name}</span>
                {f.cvss !== undefined && <Badge variant="outline">CVSS {f.cvss}</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">{hosts.length} location{hosts.length > 1 ? "s" : ""}</span>
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                {f.description && <p><strong>Description:</strong> {f.description}</p>}
                {f.cve && <p><strong>CVE:</strong> {f.cve}</p>}
                <p><strong>Affected:</strong> {hosts.join(", ")}</p>
                {f.solution && <p><strong>Solution:</strong> {f.solution}</p>}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section n={++n} title="Risk Analysis">
        <p className="leading-relaxed">
          The uploaded scan's overall risk is <strong>{report.risk}</strong> with a weighted risk score of {report.riskScore} across {report.hosts} host(s).{" "}
          {report.counts.Critical + report.counts.High > 0
            ? `${report.counts.Critical + report.counts.High} critical/high findings could allow attackers to compromise systems and should be remediated within 7–30 days.`
            : "No critical or high severity issues were found."}{" "}
          {report.counts.Medium > 0 && `${report.counts.Medium} medium findings should be planned into the next maintenance cycle.`}
        </p>
      </Section>

      {african && (
        <Section n={++n} title="African Context Explanation">
          {report.africanContext.length === 0 ? (
            <p className="text-muted-foreground">No actionable vulnerabilities were detected, so no analogies were generated.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {report.africanContext.slice(0, 20).map(({ finding, explanation: e }) => (
                <div key={finding.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <SevBadge s={finding.severity} />
                    <span className="font-semibold">{finding.name}</span>
                  </div>
                  <p><strong>Technical explanation:</strong> {e.technical}</p>
                  <p className="mt-1"><strong>Business impact:</strong> {e.businessImpact}</p>
                  <p className="mt-2 rounded bg-accent/10 p-2 italic"><strong className="not-italic text-accent">African context analogy:</strong> {e.analogy}</p>
                  <p className="mt-2"><strong>Recommendation:</strong> {e.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section n={++n} title="Recommendations">
        {report.recommendations.length === 0 ? (
          <p className="text-muted-foreground">No remediation actions required based on the uploaded scan.</p>
        ) : (
          <ol className="list-decimal space-y-2 pl-5">
            {report.recommendations.map((r) => (
              <li key={r.title}>
                <SevBadge s={r.severity} /> <strong>{r.title}</strong> ({r.affected} location{r.affected > 1 ? "s" : ""}) — {r.action}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section n={++n} title="Conclusion">
        <p className="leading-relaxed">{report.conclusion}</p>
      </Section>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 font-display text-2xl font-semibold">{children}</div>
    </div>
  );
}
