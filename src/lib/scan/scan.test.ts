import { describe, expect, it } from "vitest";
import { buildAfricanContext } from "./african-context";
import { normalizeSeverity, parseCsv, parseNessus } from "./parsers";
import { buildReport } from "./report";

describe("scan processing", () => {
  it("generates no African analogies when no findings exist", () => {
    expect(buildAfricanContext([])).toEqual([]);
  });

  it("parses a Nessus CSV export into findings with correct severity", () => {
    const csv = 'Plugin ID,Risk,Host,Port,Name,Solution\n1,High,10.1.1.1,22,OpenSSH Multiple Vulnerabilities,Upgrade\n2,None,10.1.1.1,0,Ping,\n';
    const f = parseCsv(csv);
    expect(f).toHaveLength(2);
    expect(f[0]!.severity).toBe("High");
    expect(f[1]!.severity).toBe("Info");
  });

  it("parses .nessus XML and produces an analogy only for real findings", () => {
    const xml = `<NessusClientData_v2><Report><ReportHost name="1.2.3.4"><ReportItem port="22" protocol="tcp" severity="3" pluginID="9" pluginName="OpenSSH Multiple Vulnerabilities"><solution>Upgrade</solution></ReportItem></ReportHost></Report></NessusClientData_v2>`;
    const f = parseNessus(xml);
    expect(f[0]!.severity).toBe("High");
    const r = buildReport({ fileName: "a.nessus", fileType: "nessus", uploadedAt: "", findings: f, isDemo: false }, true);
    expect(r.africanContext).toHaveLength(1);
  });

  it("maps numeric Nessus severities", () => {
    expect(normalizeSeverity("4")).toBe("Critical");
    expect(normalizeSeverity("0")).toBe("Info");
  });
});
