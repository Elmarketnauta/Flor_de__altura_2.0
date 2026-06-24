import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "hola@flordealtura.com";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`send-verification:${clientIp}`, 5, 3600);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera una hora antes de volver a intentarlo." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo electrónico inválido." }, { status: 400 });
    }

    // Check if email is already registered
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Este correo ya está registrado. Inicia sesión." },
        { status: 409 },
      );
    }

    // Invalidate previous unused codes for this email
    await supabaseAdmin
      .from("email_verifications")
      .update({ used: true })
      .eq("email", email)
      .eq("used", false);

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    const { error: insertError } = await supabaseAdmin
      .from("email_verifications")
      .insert({ email, code, expires_at: expiresAt });

    if (insertError) {
      console.error("[send-verification] DB insert error:", insertError);
      return NextResponse.json({ error: "Error interno. Intenta de nuevo." }, { status: 500 });
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: `Flor de Altura <${FROM}>`,
      to: email,
      subject: "Tu código de verificación — Flor de Altura",
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf6f1;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6f1;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2c1810 0%,#4a2c1a 100%);padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#c9965a;letter-spacing:2px;text-transform:uppercase;">Flor de Altura</p>
            <p style="margin:6px 0 0;font-size:12px;color:#a07040;letter-spacing:1px;text-transform:uppercase;">Café de Especialidad Peruano</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:14px;color:#8c7b6b;letter-spacing:1px;text-transform:uppercase;">Verificación de cuenta</p>
            <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:#2c1810;line-height:1.3;">Tu código de verificación</h1>
            <p style="margin:0 0 32px;font-size:15px;color:#5c4a3a;line-height:1.6;">
              Usa este código para completar tu registro en Flor de Altura.
              Expira en <strong>10 minutos</strong>.
            </p>
            <!-- Code box -->
            <div style="background:#faf6f1;border:2px solid #c9965a;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
              <p style="margin:0 0 8px;font-size:12px;color:#8c7b6b;letter-spacing:2px;text-transform:uppercase;">Tu código</p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:42px;font-weight:700;color:#2c1810;letter-spacing:12px;">${code}</p>
            </div>
            <p style="margin:0;font-size:13px;color:#8c7b6b;line-height:1.6;">
              Si no solicitaste este código, ignora este mensaje.
              Nadie de Flor de Altura te pedirá este código por teléfono o chat.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#faf6f1;padding:20px 40px;border-top:1px solid #e8ddd0;">
            <p style="margin:0;font-size:12px;color:#a09080;text-align:center;line-height:1.5;">
              Flor de Altura · Pichanaqui, Selva Central del Perú<br>
              <a href="https://www.flordealtura.com" style="color:#c9965a;text-decoration:none;">www.flordealtura.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailError) {
      console.error("[send-verification] Resend error:", emailError);
      return NextResponse.json(
        { error: "No pudimos enviar el correo. Verifica tu dirección e intenta de nuevo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-verification]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
