import type { Finding } from "./types";

export interface ContextExplanation {
  technical: string;
  businessImpact: string;
  analogy: string;
  recommendation: string;
}

interface Rule {
  match: RegExp;
  analogy: string;
  impact: string;
}

const RULES: Rule[] = [
  { match: /ssh|openssh/i, analogy: "Like a compound gate whose padlock has a known flaw — anyone who has heard about the trick at the market can open it and walk into the yard unnoticed.", impact: "Attackers may gain remote shell access to servers, enabling data theft or service disruption." },
  { match: /ssl|tls|certificate|cipher/i, analogy: "Like sending money home through a matatu or danfo driver who opens the envelope on the way — the message arrives, but others may have read or changed it.", impact: "Customer data and credentials in transit can be intercepted or tampered with." },
  { match: /password|credential|default account|authentication|brute/i, analogy: "Like leaving the shop key under the doormat that every street hawker knows about.", impact: "Unauthorised users can log in as legitimate staff, bypassing accountability." },
  { match: /smb|netbios|samba|share/i, analogy: "Like a village granary left open — anyone passing can take or spoil the harvest stored for everyone.", impact: "Shared files may be read, encrypted by ransomware or used to spread malware internally." },
  { match: /sql|injection|xss|cross-site/i, analogy: "Like a mobile money agent who processes any note handed over without checking — a forged instruction slips straight into the books.", impact: "Attackers can read or alter databases and impersonate customers." },
  { match: /patch|update|outdated|unsupported|end of life|eol|version/i, analogy: "Like driving a bus on worn tyres on the rainy-season road — it still moves today, but a known failure is waiting to happen.", impact: "Publicly known exploits can be used against unpatched systems with little effort." },
  { match: /rdp|remote desktop|vnc|telnet/i, analogy: "Like a back door of the office facing the main road with no askari watching it.", impact: "Remote takeover of workstations or servers by external attackers." },
  { match: /dns|snmp|ntp/i, analogy: "Like a town crier who announces everyone's business to anyone who asks.", impact: "Network details leak to attackers, helping them plan further attacks." },
];

const DEFAULT: Rule = {
  match: /.*/,
  analogy: "Like a crack in the wall of the family house — small today, but during the rainy season it lets water in and weakens the whole structure.",
  impact: "This weakness could be combined with others to compromise systems or data.",
};

/** Builds an African-context explanation for a REAL detected finding. Returns [] when there are no findings. */
export function explainFinding(f: Finding): ContextExplanation {
  const rule = RULES.find((r) => r.match.test(f.name)) ?? DEFAULT;
  return {
    technical: f.synopsis || f.description || `${f.name} was detected on ${f.host} (${f.port}).`,
    businessImpact: `${rule.impact} Severity rated ${f.severity}${f.cvss !== undefined ? ` (CVSS ${f.cvss})` : ""}.`,
    analogy: rule.analogy,
    recommendation: f.solution || "Apply the vendor's latest security update and restrict exposure of the affected service.",
  };
}

export function buildAfricanContext(findings: Finding[]): { finding: Finding; explanation: ContextExplanation }[] {
  const real = findings.filter((f) => f.severity !== "Info");
  if (real.length === 0) return [];
  return real.map((finding) => ({ finding, explanation: explainFinding(finding) }));
}
