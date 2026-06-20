import { NextResponse } from "next/server";
import { b2bLeadSchema } from "@/lib/schemas";

/**
 * Endpoint de captación de leads corporativos (B2B).
 * Valida en el servidor con el mismo esquema Zod del cliente y, si se configura
 * `B2B_WEBHOOK_URL`, reenvía el lead a un CRM / automatización (HubSpot, Make,
 * Zapier, Google Sheets, etc.).
 */
export async function POST(request: Request) {
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

  // Reenvío opcional a un webhook externo (CRM / automatización).
  const webhookUrl = process.env.B2B_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      // No bloqueamos al usuario si el webhook falla; lo registramos.
      console.error("[b2b-lead] Falló el reenvío al webhook:", error);
    }
  } else {
    // Sin webhook configurado: dejamos traza en los logs del servidor (Vercel).
    console.info("[b2b-lead] Nuevo lead recibido:", lead);
  }

  return NextResponse.json({ ok: true });
}
