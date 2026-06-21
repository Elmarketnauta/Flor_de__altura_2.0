import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazily-initialized Supabase admin client (service role).
 *
 * Why lazy: creating the client at module-import time calls createClient with
 * the service-role key immediately. During `next build`, Next.js imports every
 * API route to collect page data — at which point the env vars may not be
 * present, so an eager createClient throws "supabaseKey is required" and fails
 * the whole build. Deferring instantiation until the first real request keeps
 * the build from ever needing the key.
 */
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client is not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  client = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return client;
}

/**
 * Proxy that forwards property access to the real client, instantiating it on
 * first use. Existing call sites (`supabaseAdmin.from(...)`, `.auth`, `.rpc`,
 * etc.) keep working unchanged, but nothing runs until a request actually
 * touches the client at runtime.
 */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const real = getClient();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
