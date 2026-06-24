import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function validatePasswordStrength(password: string): boolean {
  if (password.length < 12) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`signup:${clientIp}`, 10, 3600);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Try again later." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    if (!validatePasswordStrength(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 12 characters with uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      );
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp(
      {
        email,
        password,
      }
    );

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Signup failed" },
        { status: 400 }
      );
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          role: "customer",
          country: "PE",
        },
      ]);

    if (profileError) {
      // Cleanup auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch {}
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: authData.user.id,
    });
  } catch (error) {
    console.error("[SignupError]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
