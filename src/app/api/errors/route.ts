import { NextRequest, NextResponse } from "next/server";

interface ErrorLog {
  timestamp?: string;
  message?: string;
  stack?: string;
  context?: Record<string, any>;
  level?: string;
  url?: string;
  userAgent?: string;
}

function sanitizeStack(stack: string | undefined): string | undefined {
  if (!stack) return undefined;

  return stack
    .substring(0, 5000)
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
    .replace(/sk_[a-z0-9_]+/gi, "[STRIPE_KEY]")
    .replace(/INTERNAL_API_SECRET[=:]\s*[a-f0-9]+/gi, "[SECRET]")
    .replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, "[TOKEN]");
}

function sanitizeContext(context?: Record<string, any>): Record<string, any> {
  if (!context) return {};

  const FORBIDDEN_KEYS = ["password", "token", "secret", "apikey", "api_key", "auth"];
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(context)) {
    if (FORBIDDEN_KEYS.some((forbidden) => key.toLowerCase().includes(forbidden))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "string") {
      sanitized[key] = value.substring(0, 1000);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = "[OBJECT]";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ErrorLog;

    const sanitized = {
      timestamp: body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString(),
      message: (body.message || "").substring(0, 500),
      level: ["error", "warning", "info"].includes(body.level || "") ? body.level : "error",
      url: (body.url || "").substring(0, 2048),
      stack: sanitizeStack(body.stack),
      userAgent: (body.userAgent || "").substring(0, 500),
      context: sanitizeContext(body.context),
    };

    console.error("[Client Error]", sanitized);
    return NextResponse.json({ success: true, received: true }, { status: 200 });
  } catch (error) {
    console.error("[ErrorAPI Error]", error);
    return NextResponse.json({ success: false, error: "Failed to log error" }, { status: 500 });
  }
}
