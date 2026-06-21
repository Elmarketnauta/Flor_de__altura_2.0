import { getServerSession } from "next-auth";
import { authConfig } from "@/auth/auth.config";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Server-side authentication helpers for API routes.
 *
 * Why this exists: the app authenticates with NextAuth (v4), whose session JWT
 * is signed with NEXTAUTH_SECRET and carries the user `id` and `role`. The API
 * routes previously expected a Supabase access token in an `Authorization:
 * Bearer` header — but NextAuth never propagated such a token, so every
 * authenticated call failed with 401.
 *
 * Instead of shuttling short-lived Supabase tokens through NextAuth (which would
 * expire mid-session), API routes read the trusted NextAuth session directly on
 * the server. The session is already verified by NextAuth before we see it.
 */

export interface AuthedUser {
  id: string;
  email: string | null;
  role: string;
}

/**
 * Returns the authenticated user from the NextAuth session, or null if the
 * request is not authenticated.
 */
export async function getAuthedUser(): Promise<AuthedUser | null> {
  const session = await getServerSession(authConfig);
  const user = (session as any)?.user;

  if (!user?.id) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    role: user.role ?? "customer",
  };
}

/**
 * Returns the authenticated user only if they currently have the admin role.
 *
 * The role is re-checked against the database rather than trusting the JWT
 * alone, so that revoking someone's admin rights takes effect immediately
 * (the NextAuth JWT could otherwise carry a stale `role` until it expires).
 */
export async function getAdminUser(): Promise<AuthedUser | null> {
  const user = await getAuthedUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;

  return { ...user, role: "admin" };
}
