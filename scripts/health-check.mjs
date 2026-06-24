#!/usr/bin/env node
/**
 * Daily production health check for Flor de Altura.
 *
 * Verifies that the live site is reachable, that critical public routes render,
 * that the /api/health probe reports healthy dependencies, and surfaces the
 * outstanding security follow-ups (secret rotation, Supabase RLS) so they don't
 * silently rot.
 *
 * Zero external dependencies — runs on plain Node 18+ (global fetch).
 *
 * Usage:
 *   node scripts/health-check.mjs
 *   SITE_URL=https://www.flordealtura.com node scripts/health-check.mjs
 *   node scripts/health-check.mjs --json    # machine-readable output
 *
 * Exit codes:
 *   0  all checks passed (site healthy)
 *   1  one or more checks FAILED (site degraded or down)
 *   2  the script itself errored (could not run)
 */

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.flordealtura.com"
).replace(/\/$/, "");

const TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 10000);
const JSON_OUTPUT = process.argv.includes("--json");

// Public routes that must always render for an anonymous visitor.
const CRITICAL_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/productos", label: "Catálogo" },
  { path: "/club", label: "Club" },
  { path: "/fincas", label: "Fincas" },
  { path: "/revista", label: "Revista" },
  { path: "/revista/geysha-origen", label: "Artículo Geisha" },
  { path: "/revista/temperatura-agua", label: "Artículo Temperatura" },
];

// ── helpers ───────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};
const paint = (color, s) => (process.stdout.isTTY ? `${color}${s}${C.reset}` : s);

async function timedFetch(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      ...opts,
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "FlorDeAltura-HealthCheck/1.0", ...(opts.headers || {}) },
    });
    return { res, ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

// ── checks ──────────────────────────────────────────────────────────────────

async function checkRoute(route) {
  try {
    const { res, ms } = await timedFetch(`${SITE_URL}${route.path}`);
    const ok = res.status >= 200 && res.status < 400;
    return {
      name: `Ruta ${route.label}`,
      pass: ok,
      detail: `HTTP ${res.status} · ${ms}ms`,
      slow: ms > 3000,
    };
  } catch (err) {
    return {
      name: `Ruta ${route.label}`,
      pass: false,
      detail: err.name === "AbortError" ? `timeout >${TIMEOUT_MS}ms` : err.message,
    };
  }
}

async function checkHealthEndpoint() {
  try {
    const { res, ms } = await timedFetch(`${SITE_URL}/api/health`);
    let body = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON response */
    }

    if (!body || typeof body.status !== "string") {
      return {
        name: "Endpoint /api/health",
        pass: false,
        detail: `HTTP ${res.status} · respuesta no válida`,
      };
    }

    const pass = body.status === "ok";
    const parts = [`status=${body.status}`, `${ms}ms`];
    if (body.checks?.supabase) {
      parts.push(`supabase=${body.checks.supabase.status}`);
    }
    if (body.checks?.env?.missing?.length) {
      parts.push(`env-missing=[${body.checks.env.missing.join(",")}]`);
    }
    return {
      name: "Endpoint /api/health",
      pass,
      detail: parts.join(" · "),
      warn: body.status === "degraded",
    };
  } catch (err) {
    return {
      name: "Endpoint /api/health",
      pass: false,
      detail: err.name === "AbortError" ? `timeout >${TIMEOUT_MS}ms` : err.message,
    };
  }
}

async function checkSecurityHeaders() {
  try {
    const { res } = await timedFetch(SITE_URL);
    const required = {
      "strict-transport-security": "HSTS",
      "x-content-type-options": "nosniff",
      "x-frame-options": "anti-clickjacking",
    };
    const missing = Object.keys(required).filter((h) => !res.headers.get(h));
    return {
      name: "Cabeceras de seguridad",
      pass: missing.length === 0,
      warn: missing.length > 0,
      detail:
        missing.length === 0
          ? "HSTS, nosniff, X-Frame-Options presentes"
          : `faltan: ${missing.map((m) => required[m]).join(", ")}`,
    };
  } catch (err) {
    return { name: "Cabeceras de seguridad", pass: false, detail: err.message };
  }
}

/**
 * Security follow-ups that can't be probed over HTTP — surfaced as persistent
 * reminders so the team verifies them out-of-band. These are informational
 * (never fail the run) but always printed.
 */
function securityReminders() {
  return [
    "Rotar/verificar INTERNAL_API_SECRET en el entorno de producción",
    "Rotar/verificar NEXTAUTH_SECRET (invalida todas las sesiones)",
    "Confirmar Supabase RLS habilitado en: orders, users, loyalty_accounts, points_transactions",
  ];
}

// ── runner ────────────────────────────────────────────────────────────────

async function main() {
  const routeChecks = await Promise.all(CRITICAL_ROUTES.map(checkRoute));
  const [healthCheck, headerCheck] = await Promise.all([
    checkHealthEndpoint(),
    checkSecurityHeaders(),
  ]);

  const checks = [...routeChecks, healthCheck, headerCheck];
  const failed = checks.filter((c) => !c.pass);
  const warned = checks.filter((c) => c.pass && (c.warn || c.slow));

  const overall = failed.length > 0 ? "FAIL" : warned.length > 0 ? "WARN" : "OK";

  if (JSON_OUTPUT) {
    console.log(
      JSON.stringify(
        {
          site: SITE_URL,
          timestamp: new Date().toISOString(),
          overall,
          checks,
          securityReminders: securityReminders(),
        },
        null,
        2
      )
    );
  } else {
    const header = `Health Check · ${SITE_URL} · ${new Date().toISOString()}`;
    console.log(paint(C.bold, `\n${header}`));
    console.log(paint(C.dim, "─".repeat(Math.min(header.length, 78))));

    for (const c of checks) {
      const icon = c.pass
        ? c.warn || c.slow
          ? paint(C.yellow, "▲")
          : paint(C.green, "✓")
        : paint(C.red, "✗");
      const name = c.name.padEnd(26);
      console.log(`${icon} ${name} ${paint(C.dim, c.detail)}`);
    }

    console.log(paint(C.dim, "\nRecordatorios de seguridad (verificación manual):"));
    for (const r of securityReminders()) {
      console.log(paint(C.dim, `  • ${r}`));
    }

    const summaryColor =
      overall === "OK" ? C.green : overall === "WARN" ? C.yellow : C.red;
    console.log(
      paint(C.bold, `\n${paint(summaryColor, overall)} · ${checks.length - failed.length}/${checks.length} checks pasaron` +
        (failed.length ? ` · ${failed.length} fallaron` : "") +
        (warned.length ? ` · ${warned.length} con advertencia` : "")) + "\n"
    );
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(paint(C.red, `health-check error: ${err.stack || err.message}`));
  process.exit(2);
});
