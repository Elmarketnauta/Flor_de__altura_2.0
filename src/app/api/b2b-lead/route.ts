import { NextResponse } from "next/server";
import { b2bLeadSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_WEBHOOK_DOMAINS = new Set(
  (process.env.ALLOWED_WEBHOOK_DOMAINS || "").split(",").filter(Boolean),
);

function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (
      ALLOWED_WEBHOOK_DOMAINS.size > 0 &&
      !ALLOWED_WEBHOOK_DOMAINS.has(parsed.hostname)
    ) {
      return false;
    }
    return parsed.protocol === "https:" || parsed.hostname === "localhost";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const clientIp = await getClientIp();
  const { allowed, remaining } = await checkRateLimit(
    `b2b-lead:${clientIp}`,
    5,
    3600,
  );

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Demasiadas solicitudes. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Cuerpo de la solicitud inválido." },
      { status: 400 },
    );
  }

  const parsed = b2bLeadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Datos inválidos.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const lead = {
    ...parsed.data,
    source: "web_b2b_form",
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.B2B_WEBHOOK_URL;
  if (webhookUrl) {
    if (!isValidWebhookUrl(webhookUrl)) {
      console.error("[b2b-lead] Webhook URL inválida o no permitida:", webhookUrl);
      return NextResponse.json(
        { ok: false, message: "Configuración de servidor inválida." },
        { status: 500 },
      );
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      console.error("[b2b-lead] Falló el reenvío al webhook:", error);
    }
  } else {
    console.info("[b2b-lead] Nuevo lead recibido:", lead);
  }

  return NextResponse.json({ ok: true });
}
