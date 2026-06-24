import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    // Stricter limit on code guessing: 10 attempts per hour per IP
    const { allowed } = await checkRateLimit(`verify-code:${clientIp}`, 10, 3600);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera una hora." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!email || !code) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
    }

    // Find the latest unused, non-expired code for this email
    const { data: record, error } = await supabaseAdmin
      .from("email_verifications")
      .select("id, code, expires_at, used")
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[verify-code] DB error:", error);
      return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }

    if (!record) {
      return NextResponse.json(
        { error: "No hay un código activo para este correo. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "El código ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    if (record.code !== code) {
      return NextResponse.json(
        { error: "Código incorrecto. Verifica e intenta de nuevo." },
        { status: 400 },
      );
    }

    // Mark code as used
    await supabaseAdmin
      .from("email_verifications")
      .update({ used: true })
      .eq("id", record.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[verify-code]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
