import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { contactSchema, isStoragePath } from "./site";
import { TRIAL_SERVICE, trialSchema } from "./trial";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type MediaRow = Database["public"]["Tables"]["project_media"]["Row"];
type SettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

export type PublicProject = ProjectRow;
export type PublicMedia = MediaRow;
export type PublicSettings = SettingsRow;
export type ProjectDetail = {
  project: ProjectRow;
  media: MediaRow[];
  next: Pick<ProjectRow, "slug" | "title" | "cover_url" | "client_category"> | null;
};

const BUCKET = "portfolio";
const SIGNED_TTL = 60 * 60 * 24; // 24h
const localMode = import.meta.env.DEV && import.meta.env["VITE_LOCAL_ADMIN"] === "true";

function publicClient() {
  const url = localMode ? "http://127.0.0.1:8080/api/local" : process.env["SUPABASE_URL"]!;
  const key = localMode ? "mayd-local" : process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        const timeout = AbortSignal.timeout(5000);
        const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
        return fetch(input, { ...init, headers, signal });
      },
    },
  });
}

type Client = ReturnType<typeof publicClient>;

export const confirmTrialRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        accessToken: z.string().min(1).max(10000),
        request: trialSchema.optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const client = publicClient();
    // Validate with Auth, never trust a browser session or a decoded JWT alone.
    const { data: auth, error: authError } = await client.auth.getUser(data.accessToken);
    const user = auth.user;
    if (authError || !user?.email_confirmed_at || !user.email)
      throw new Error("Confirmez votre email avec le lien reçu avant de valider votre demande.");
    const request = trialSchema.parse(data.request ?? user.user_metadata?.["trial_request"]);
    if (request.email !== user.email.toLowerCase())
      throw new Error("Utilisez le lien envoyé à l'adresse indiquée dans votre demande.");
    // Stable id makes retries idempotent: one verified trial request per account.
    // Use the existing anonymous INSERT policy; no service-role key is needed.
    const { error } = await client.from("contact_messages").insert({
      id: user.id,
      name: request.name,
      company: request.company,
      contact: user.email,
      service: TRIAL_SERVICE,
      is_read: false,
      message: [
        "DEMANDE D'ESSAI GRATUIT — 10 JOURS",
        "Email confirmé par lien Supabase.",
        `Service souhaité : ${request.service}`,
        "Le client accepte d'être contacté pour organiser son essai gratuit de 10 jours.",
        "Début et périmètre à convenir ensemble. Aucun paiement automatique.",
      ].join("\n"),
    });
    if (error && error.code !== "23505") {
      console.error("[trial]", error);
      throw new Error("Votre demande n'a pas pu être enregistrée. Réessayez.");
    }
    return { ok: true as const };
  });

/** Turns stored storage paths into browser-reachable signed URLs (in place). */
async function signAll<T extends Record<string, unknown>>(
  client: Client,
  rows: T[],
  fields: (keyof T)[],
) {
  const paths = new Set<string>();
  for (const row of rows) {
    for (const f of fields) {
      const v = row[f];
      if (typeof v === "string" && isStoragePath(v)) paths.add(v);
    }
  }
  if (paths.size === 0) return;
  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUrls([...paths], SIGNED_TTL);
  if (error || !data) {
    console.error("[media] signing failed", error);
    return;
  }
  const serverBase = (
    localMode ? "http://127.0.0.1:8080/api/local" : process.env["SUPABASE_URL"]!
  ).replace(/\/+$/, "");
  const browserBase = localMode
    ? "/api/local"
    : (import.meta.env["VITE_SUPABASE_URL"] ?? serverBase).replace(/\/+$/, "");
  const map = new Map<string, string>();
  for (const d of data) {
    if (d.path && d.signedUrl) map.set(d.path, d.signedUrl.replace(serverBase, browserBase));
  }
  for (const row of rows) {
    for (const f of fields) {
      const v = row[f];
      if (typeof v === "string" && map.has(v))
        (row as Record<string, unknown>)[f as string] = map.get(v);
    }
  }
}

const SETTINGS_FALLBACK: SettingsRow = {
  id: true,
  brand_name: "MAYD",
  brand_suffix: "DIGITAL",
  brand_description:
    "Sites web, réseaux sociaux et identité digitale pour les entreprises locales et les entrepreneurs.",
  owner_name: "Mehdi",
  email: null,
  whatsapp: null,
  phone: null,
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  portrait_url: null,
  hero_laptop_url: null,
  hero_phone_1_url: null,
  hero_phone_2_url: null,
  updated_at: new Date(0).toISOString(),
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const { data, error } = await client.from("site_settings").select("*").maybeSingle();
  if (error) console.error("[settings]", error);
  const row = { ...(data ?? SETTINGS_FALLBACK) };
  // Compatibility for the former identity, without writing to site_settings.
  // Future brand edits in the dashboard still take precedence.
  if (
    row.brand_name.trim().toUpperCase() === "MEHDI" &&
    row.brand_suffix.trim().toLowerCase() === "digital studio"
  ) {
    row.brand_name = "MAYD";
    row.brand_suffix = "DIGITAL";
  }
  await signAll(
    client,
    [row],
    ["portrait_url", "hero_laptop_url", "hero_phone_1_url", "hero_phone_2_url"],
  );
  return row;
});

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[projects]", error);
    return { projects: [] as ProjectRow[], available: false };
  }
  const rows = data ?? [];
  await signAll(client, rows, ["cover_url"]);
  return { projects: rows, available: true };
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }): Promise<ProjectDetail | null> => {
    const client = publicClient();
    const { data: project, error } = await client
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error("Impossible de charger ce projet.");
    if (!project) return null;

    const [{ data: media }, { data: all }] = await Promise.all([
      client
        .from("project_media")
        .select("*")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      client
        .from("projects")
        .select("slug,title,cover_url,client_category,sort_order,created_at")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    const list = all ?? [];
    const idx = list.findIndex((p) => p.slug === project.slug);
    const nextRaw = list.length > 1 ? list[(idx + 1) % list.length] : null;
    const next = nextRaw
      ? {
          slug: nextRaw.slug,
          title: nextRaw.title,
          cover_url: nextRaw.cover_url,
          client_category: nextRaw.client_category,
        }
      : null;

    const mediaRows = (media ?? []).filter((m) => m.kind !== "embed");
    const embedRows = (media ?? []).filter((m) => m.kind === "embed");
    await signAll(client, [project], ["cover_url", "before_image_url", "after_image_url"]);
    await signAll(client, mediaRows, ["url"]);
    if (next) await signAll(client, [next], ["cover_url"]);

    const merged = [...mediaRows, ...embedRows].sort(
      (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
    );
    return { project, media: merged, next };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const client = publicClient();
    const { error } = await client.from("contact_messages").insert({
      name: data.name,
      company: data.company ?? "",
      contact: data.contact,
      service: data.service ?? "",
      message: data.message,
    });
    if (error) {
      console.error("[contact]", error);
      throw new Error("Votre message n'a pas pu être envoyé. Merci de réessayer.");
    }
    return { ok: true as const };
  });
