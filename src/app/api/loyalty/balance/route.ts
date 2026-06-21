import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthedUser } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch loyalty account
    let { data: account, error: accountError } = await supabaseAdmin
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Create loyalty account if it doesn't exist
    if (accountError && accountError.code === "PGRST116") {
      const { data: newAccount } = await supabaseAdmin
        .from("loyalty_accounts")
        .insert([
          {
            user_id: userId,
            points: 0,
            tier: "bronze",
            lifetime_points: 0,
          },
        ])
        .select()
        .single();

      account = newAccount;
    } else if (accountError) {
      throw new Error(`Failed to fetch loyalty account: ${accountError.message}`);
    }

    // Fetch recent transactions
    const { data: transactions } = await supabaseAdmin
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      account,
      recentTransactions: transactions || [],
    });
  } catch (error) {
    console.error("[LoyaltyBalanceError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
