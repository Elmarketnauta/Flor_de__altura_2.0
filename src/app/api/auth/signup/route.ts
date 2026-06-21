import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
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
