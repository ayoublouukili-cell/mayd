import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let client: ReturnType<typeof createClient<Database>> | undefined;
// Keep customer email links separate from the owner's admin session.
export function getTrialClient() {
  if (!client) {
    const url = import.meta.env["VITE_SUPABASE_URL"];
    const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key || (import.meta.env.DEV && import.meta.env["VITE_LOCAL_ADMIN"] === "true"))
      throw new Error("La confirmation par email est disponible sur le site en ligne.");
    client = createClient<Database>(url, key, {
      auth: { storageKey: "mayd-trial-auth", autoRefreshToken: false, flowType: "implicit" },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
            headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
  }
  return client;
}
