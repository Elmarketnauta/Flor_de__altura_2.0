import { NextResponse } from "next/server";

/**
 * Health check endpoint — GET /api/health
 *
 * Lightweight liveness + readiness probe consumed by the daily health-check
 * cron (scripts/health-check.mjs) and any external uptime monitor.
 *
 * Design constraints:
 *  - Never leak secrets. We only report *presence* of required env vars, never
 *    their values.
 *  - Fast and side-effect-free. The Supabase check uses a HEAD count against a
 *    public-readable table with a short timeout; it must not mutate anything.
 *  - Degrade gracefully. A failing dependency yields status "degraded" (200) so
 *    the page itself stays reachable; only a hard failure of the route returns 503.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REQUIRED_ENV = [
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "INTERNAL_API_SECRET",
] as const;

type CheckStatus = "ok" | "degraded" | "down";

interface HealthReport {
  status: CheckStatus;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    env: { status: CheckStatus; missing: string[] };
    supabase: { status: CheckStatus; latencyMs: number | null; detail?: string };
  };
}

async function checkSupabase(): Promise<HealthReport["checks"]["supabase"]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { status: "down", latencyMs: null, detail: "missing credentials" };
  }

  const started = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Hit the REST root with the anon key. A reachable PostgREST returns a JSON
    // document describing the API; we only care that it responds 2xx quickly.
    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const latencyMs = Date.now() - started;
    if (!res.ok) {
      return { status: "degraded", latencyMs, detail: `HTTP ${res.status}` };
    }
    return { status: "ok", latencyMs };
  } catch (err) {
    return {
      status: "down",
      latencyMs: Date.now() - started,
      detail: err instanceof Error ? err.name : "fetch failed",
    };
  }
}

function checkEnv(): HealthReport["checks"]["env"] {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  return {
    status: missing.length === 0 ? "ok" : "degraded",
    missing,
  };
}

export async function GET() {
  const env = checkEnv();
  const supabase = await checkSupabase();

  // Roll up: any "down" => degraded overall (the page is still up since this
  // route responded), all "ok" => ok.
  const anyDown = env.status === "down" || supabase.status === "down";
  const anyDegraded =
    env.status === "degraded" || supabase.status === "degraded";

  const status: CheckStatus = anyDown
    ? "down"
    : anyDegraded
      ? "degraded"
      : "ok";

  const report: HealthReport = {
    status,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    checks: { env, supabase },
  };

  // 200 for ok/degraded so uptime monitors don't page on a slow dependency;
  // 503 only when a critical dependency is fully down.
  return NextResponse.json(report, { status: anyDown ? 503 : 200 });
}
