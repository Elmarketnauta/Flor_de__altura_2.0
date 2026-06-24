import { NextResponse } from "next/server";
import { b2bLeadSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/b2b-lead
 *
 * Recibe el lead corporativo, lo valida y lo envía a HubSpot Forms API.
 * Si las variables de HubSpot no están configuradas, registra el lead en
 * consola (desarrollo) y retorna éxito de todas formas para no bloquear al
 * usuario.
 *
 * Variables de entorno requeridas para HubSpot:
 *   HUBSPOT_PORTAL_ID  — ID numérico del portal (Settings → Account Setup)
 *   HUBSPOT_FORM_GUID  — GUID del formulario (Forms → Share → Embed code)
 */

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

async function sendToHubSpot(lead: {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  newsletter: boolean;
}): Promise<void> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  if (!portalId || !formGuid) {
    console.info("[b2b-lead] HubSpot no configurado. Lead recibido:", lead);
    return;
  }

  const [firstName, ...rest] = lead.contactName.trim().split(" ");
  const lastName = rest.join(" ") || "-";

  const body = {
    fields: [
      { name: "email", value: lead.email },
      { name: "firstname", value: firstName },
      { name: "lastname", value: lastName },
      { name: "company", value: lead.company },
      { name: "phone", value: lead.phone },
      // Propiedad personalizada — créala en HubSpot como "newsletter_opt_in"
      // tipo "Single checkbox" si quieres trazarla.
      { name: "newsletter_opt_in", value: lead.newsletter ? "true" : "false" },
      { name: "hs_lead_status", value: "NEW" },
    ],
    context: {
      pageUri: "https://www.flordealtura.com/#b2b",
      pageName: "Flor de Altura — Plan Oficina",
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "Acepto el tratamiento de mis datos según la Ley N.º 29733.",
        communications: lead.newsletter
          ? [{ value: true, subscriptionTypeId: 999, text: "Newsletter Flor de Altura" }]
          : [],
      },
    },
  };

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "(sin detalle)");
    throw new Error(`HubSpot ${res.status}: ${detail}`);
  }
}

export async function POST(request: Request) {
  const clientIp = await getClientIp();
  const { allowed } = await checkRateLimit(`b2b-lead:${clientIp}`, 5, 3600);

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
    newsletter: parsed.data.newsletter ?? false,
    source: "web_b2b_form",
    receivedAt: new Date().toISOString(),
  };

  // 1. HubSpot Forms API
  try {
    await sendToHubSpot(lead);
  } catch (err) {
    // No bloqueamos al usuario por un error de CRM, pero sí lo registramos.
    console.error("[b2b-lead] Error al enviar a HubSpot:", err);
  }

  // 2. Webhook adicional opcional (ej. Slack notify, Make.com)
  const webhookUrl = process.env.B2B_WEBHOOK_URL;
  if (webhookUrl) {
    if (!isValidWebhookUrl(webhookUrl)) {
      console.error("[b2b-lead] Webhook URL inválida:", webhookUrl);
    } else {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (err) {
        console.error("[b2b-lead] Falló el reenvío al webhook:", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
