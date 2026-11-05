import type { ScanResult } from "./types";

/** Sample data used ONLY when the user explicitly turns Demo Mode on. */
export function getDemoScan(): ScanResult {
  return {
    fileName: "DEMO – sample presentation data",
    fileType: "demo",
    uploadedAt: new Date().toISOString(),
    isDemo: true,
    findings: [
      { id: "d1", name: "OpenSSH < 9.6 Multiple Vulnerabilities", severity: "High", host: "10.0.0.12", port: "22/tcp", cvss: 8.1, cve: "CVE-2023-48795", description: "The remote OpenSSH version is affected by multiple vulnerabilities.", solution: "Upgrade to OpenSSH 9.6 or later.", synopsis: "The SSH server is running an outdated version." },
      { id: "d2", name: "SSL Certificate Cannot Be Trusted", severity: "Medium", host: "10.0.0.15", port: "443/tcp", cvss: 6.5, description: "The server's certificate chain is not trusted.", solution: "Purchase or generate a proper certificate." },
      { id: "d3", name: "Microsoft Windows SMBv1 Enabled", severity: "Critical", host: "10.0.0.20", port: "445/tcp", cvss: 9.8, description: "SMBv1 is enabled on the remote host.", solution: "Disable SMBv1 and apply MS17-010." },
      { id: "d4", name: "Unsupported PHP Version", severity: "High", host: "10.0.0.15", port: "80/tcp", cvss: 7.5, description: "The PHP version is no longer supported.", solution: "Upgrade to a supported PHP release." },
      { id: "d5", name: "ICMP Timestamp Request Disclosure", severity: "Low", host: "10.0.0.12", port: "0/icmp", cvss: 2.1, description: "The host responds to ICMP timestamp requests.", solution: "Filter ICMP timestamp requests." },
    ],
  };
}
