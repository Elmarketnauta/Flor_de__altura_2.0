import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { signupFinalSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`signup:${clientIp}`, 10, 3600);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta más tarde." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = signupFinalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { firstName, lastName, dni, address, email, password, verificationCode } = parsed.data;

    // Verify the OTP code is valid and unused
    const { data: codeRecord, error: codeError } = await supabaseAdmin
      .from("email_verifications")
      .select("id, code, expires_at, used")
      .eq("email", email.toLowerCase())
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (codeError || !codeRecord) {
      return NextResponse.json(
        { error: "Código de verificación no encontrado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    if (new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "El código ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    if (codeRecord.code !== verificationCode) {
      return NextResponse.json(
        { error: "Código de verificación incorrecto." },
        { status: 400 },
      );
    }

    // Check duplicate email
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 },
      );
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? "Error al crear la cuenta." },
        { status: 400 },
      );
    }

    // Create user profile with all fields
    const { error: profileError } = await supabaseAdmin.from("users").insert([
      {
        id: authData.user.id,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        dni,
        address,
        role: "customer",
        country: "PE",
        email_verified: true,
      },
    ]);

    if (profileError) {
      // Rollback: delete auth user so signup can be retried
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id).catch(() => {});
      console.error("[signup] Profile insert error:", profileError);
      return NextResponse.json({ error: "Error al crear el perfil." }, { status: 500 });
    }

    // Create loyalty account (50 welcome points)
    try {
      await supabaseAdmin.from("loyalty_accounts").insert([
        {
          user_id: authData.user.id,
          points: 50,
          tier: "bronze",
          lifetime_points: 50,
        },
      ]);
    } catch {}

    // Record welcome bonus transaction
    try {
      await supabaseAdmin.from("points_transactions").insert([
        {
          user_id: authData.user.id,
          type: "bonus",
          points: 50,
          description: "Bienvenido a Flor de Altura — puntos de regalo",
        },
      ]);
    } catch {}

    // Mark verification code as used
    try {
      await supabaseAdmin
        .from("email_verifications")
        .update({ used: true })
        .eq("id", codeRecord.id);
    } catch {}

    return NextResponse.json({
      ok: true,
      userId: authData.user.id,
      welcomePoints: 50,
    });
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
