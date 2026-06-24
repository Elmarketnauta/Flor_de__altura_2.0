export function validateEmailAddress(email: string | undefined): string {
  if (!email) throw new Error("Email address required");

  // RFC 5321 simplified validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error("Invalid email address");
  }

  // Reject emails with CRLF, newlines, or other dangerous characters (Nodemailer vuln)
  if (/[\r\n\0]/.test(email)) {
    throw new Error("Invalid email format");
  }

  return email.toLowerCase().trim();
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function sanitizeUrl(url: string | undefined, allowedHosts?: string[]): string {
  if (!url) return "about:blank";

  try {
    const parsed = new URL(url);

    // Only allow HTTPS and HTTP protocols
    if (!["https:", "http:"].includes(parsed.protocol)) {
      return "about:blank";
    }

    // If allowedHosts specified, check against whitelist
    if (allowedHosts && allowedHosts.length > 0) {
      const isAllowed = allowedHosts.some((host) => parsed.hostname.includes(host));
      if (!isAllowed) {
        return "about:blank";
      }
    }

    return parsed.toString();
  } catch {
    return "about:blank";
  }
}

export function isValidAppUrl(url: string, baseUrl: string): boolean {
  try {
    const parsed = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    return parsed.hostname === base.hostname;
  } catch {
    return false;
  }
}

export const TRACKING_URL_WHITELIST = [
  "tracking.correosdelperu.pe",
  "track.fedex.com",
  "tracking.ups.com",
];

export function sanitizeTrackingUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);

    // Only HTTPS
    if (parsed.protocol !== "https:") {
      return undefined;
    }

    // Check against whitelist
    const isAllowed = TRACKING_URL_WHITELIST.some((domain) =>
      parsed.hostname.includes(domain),
    );

    if (!isAllowed) {
      return undefined;
    }

    return parsed.toString();
  } catch {
    return undefined;
  }
}
