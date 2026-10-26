import { readFile, writeFile, mkdir, rename, unlink, stat, open } from "node:fs/promises";
import { resolve, dirname, sep } from "node:path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { z } from "zod";

export const OWNER_ID = "00000000-0000-4000-8000-000000000001";
const EMAIL = "maynd@contact.com";
const COOKIE = "mayd_local_session";
const TTL = 8 * 60 * 60;
const baseSettings = {
  id: true,
  brand_name: "MAYD",
  brand_suffix: "DIGITAL",
  owner_name: "Mehdi",
  brand_description:
    "Sites web, réseaux sociaux et identité digitale pour les entreprises locales et les entrepreneurs.",
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
const text = z.string().max(10000);
const mediaValue = z
  .string()
  .max(2000)
  .refine((v) => !v || /^(https?:\/\/|\/(?!\/)|(?:projects|site)\/)/.test(v), "URL invalide")
  .nullable();
const schemas = {
  site_settings: z.object({
    brand_name: z.string().min(1).max(40),
    brand_suffix: text,
    owner_name: text,
    brand_description: text,
    email: text.nullable(),
    whatsapp: text.nullable(),
    phone: text.nullable(),
    instagram_url: mediaValue,
    facebook_url: mediaValue,
    tiktok_url: mediaValue,
    portrait_url: mediaValue,
    hero_laptop_url: mediaValue,
    hero_phone_1_url: mediaValue,
    hero_phone_2_url: mediaValue,
  }),
  projects: z.object({
    title: z.string().min(1).max(200),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9-]+$/),
    short_description: text,
    business_description: text,
    client_category: text,
    client_needs: text,
    work_done: text,
    categories: z.array(z.string().max(100)).max(30),
    services: z.array(z.string().max(200)).max(50),
    cover_url: mediaValue,
    before_image_url: mediaValue,
    after_image_url: mediaValue,
    external_url: mediaValue,
    external_label: text.nullable(),
    is_demo: z.boolean(),
    is_published: z.boolean(),
    is_featured: z.boolean(),
    sort_order: z.number().finite(),
  }),
  project_media: z.object({
    project_id: z.string().uuid(),
    url: mediaValue.refine((v) => !!v),
    kind: z.enum(["image", "video", "embed"]),
    frame: z.enum(["none", "laptop", "phone"]),
    caption: text,
    sort_order: z.number().finite(),
  }),
  contact_messages: z.object({
    name: z.string().min(1).max(100),
    contact: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    company: text,
    service: text,
    is_read: z.boolean(),
  }),
};
const defaults = {
  projects: {
    short_description: "",
    business_description: "",
    client_category: "",
    client_needs: "",
    work_done: "",
    categories: [],
    services: [],
    cover_url: null,
    before_image_url: null,
    after_image_url: null,
    external_url: null,
    external_label: null,
    is_demo: false,
    is_published: false,
    is_featured: false,
    sort_order: 0,
  },
  project_media: { kind: "image", frame: "none", caption: "", sort_order: 0 },
  contact_messages: { company: "", service: "", is_read: false },
};
const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogv: "video/ogg",
};
function fail(status, message, code = "local_error") {
  throw Object.assign(new Error(message), { status, code });
}
const hash = (value) => createHash("sha256").update(value).digest("hex");
const user = () => ({
  id: OWNER_ID,
  email: EMAIL,
  aud: "authenticated",
  role: "authenticated",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2026-10-26T00:00:00Z",
  email_confirmed_at: "2026-10-26T00:00:00Z",
});

export async function initializeLocal(directory, password) {
  await mkdir(directory, { recursive: true });
  const salt = randomBytes(32).toString("hex");
  // Never overwrite an existing owner's credentials on startup.
  await writeFile(
    resolve(directory, "auth.json"),
    JSON.stringify({
      salt,
      passwordHash: scryptSync(password, salt, 64).toString("hex"),
      sessions: {},
    }),
    { flag: "wx", mode: 0o600 },
  );
}

export async function createLocalBackend({ directory = resolve(".mayd-local") } = {}) {
  directory = resolve(directory);
  await mkdir(directory, { recursive: true });
  let queue = Promise.resolve();
  const attempts = new Map();
  async function read(name, fallback) {
    try {
      return JSON.parse(await readFile(resolve(directory, name), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT" && fallback !== undefined) return structuredClone(fallback);
      throw error;
    }
  }
  async function save(name, data) {
    const temp = resolve(directory, `${name}.${randomUUID()}.tmp`);
    await writeFile(temp, JSON.stringify(data), { mode: 0o600 });
    await rename(temp, resolve(directory, name));
  }
  function exclusive(work) {
    const result = queue.then(work);
    queue = result.catch(() => {});
    return result;
  }
  const empty = {
    site_settings: [baseSettings],
    projects: [],
    project_media: [],
    contact_messages: [],
    events: [],
  };
  async function database() {
    return read("data.json", empty);
  }
  async function session(request) {
    const token =
      request.headers.cookie
        ?.split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith(`${COOKIE}=`))
        ?.slice(COOKIE.length + 1) || request.headers.authorization?.replace(/^Bearer /, "");
    if (!token) return false;
    const auth = await read("auth.json", null);
    return !!auth?.sessions?.[hash(token)] && auth.sessions[hash(token)] > Date.now();
  }
  async function body(request, limit = 1024 * 1024) {
    const chunks = [];
    let length = 0;
    for await (const chunk of request) {
      length += chunk.length;
      if (length > limit) fail(413, "Fichier trop volumineux.");
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  async function jsonBody(request) {
    if (!request.headers["content-type"]?.includes("application/json")) fail(415, "JSON requis.");
    try {
      return JSON.parse((await body(request)).toString());
    } catch (error) {
      if (error.status) throw error;
      fail(400, "JSON invalide.");
    }
  }
  function output(response, data, status = 200) {
    response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify(data));
  }
  function filePath(path) {
    if (
      !/^(?:projects\/[a-f0-9-]+|site)\/[a-f0-9-]+\.(?:jpg|jpeg|png|webp|gif|avif|mp4|webm|mov|ogv)$/.test(
        path,
      )
    )
      fail(400, "Chemin média invalide.");
    const root = resolve(directory, "uploads");
    const target = resolve(root, path);
    if (!target.startsWith(root + sep)) fail(400, "Chemin invalide.");
    return target;
  }
  function publicMedia(db, path) {
    return (
      Object.values(db.site_settings[0]).includes(path) ||
      db.projects.some(
        (p) =>
          p.is_published &&
          ([p.cover_url, p.before_image_url, p.after_image_url].includes(path) ||
            db.project_media.some((m) => m.project_id === p.id && m.url === path)),
      )
    );
  }
  function sorted(rows, order) {
    return [...rows].sort((a, b) => {
      for (const term of (order || "").split(",")) {
        const [field, direction] = term.split(".");
        if (a[field] !== b[field])
          return (a[field] > b[field] ? 1 : -1) * (direction === "desc" ? -1 : 1);
      }
      return 0;
    });
  }
  const day = (date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Casablanca",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  return async function middleware(request, response, next) {
    if (!request.url?.startsWith("/api/local/")) return next();
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const path = decodeURIComponent(url.pathname.slice("/api/local".length));
      const method = request.method;
      if (!["GET", "HEAD"].includes(method)) {
        const origin = request.headers.origin;
        if (origin && new URL(origin).host !== request.headers.host)
          fail(403, "Origine non autorisée.");
        if (request.headers["sec-fetch-site"] === "cross-site") fail(403, "Origine non autorisée.");
      }
      if (path === "/auth/v1/token" && method === "POST") {
        const payload = await jsonBody(request);
        const auth = await read("auth.json", null);
        if (!auth) fail(503, "Le compte local doit être initialisé.");
        const ip = request.socket.remoteAddress || "local";
        const attempt = attempts.get(ip) || { count: 0, until: 0 };
        if (attempt.until < Date.now()) {
          attempt.count = 0;
          attempt.until = Date.now() + 60_000;
        }
        if (++attempt.count > 10) fail(429, "Réessayez dans une minute.");
        if (attempts.size > 1000)
          for (const [key, value] of attempts) if (value.until < Date.now()) attempts.delete(key);
        attempts.set(ip, attempt);
        const password = String(payload.password || "");
        if (
          url.searchParams.get("grant_type") !== "password" ||
          payload.email?.toLowerCase() !== EMAIL ||
          password.length > 1024 ||
          !timingSafeEqual(
            Buffer.from(auth.passwordHash, "hex"),
            scryptSync(password, auth.salt, 64),
          )
        )
          fail(400, "Identifiant ou mot de passe incorrect.", "invalid_credentials");
        attempts.delete(ip);
        const token = randomBytes(48).toString("hex");
        await exclusive(async () => {
          const fresh = await read("auth.json");
          fresh.sessions = Object.fromEntries(
            Object.entries(fresh.sessions).filter(([, expiry]) => expiry > Date.now()),
          );
          fresh.sessions[hash(token)] = Date.now() + TTL * 1000;
          await save("auth.json", fresh);
        });
        response.setHeader(
          "set-cookie",
          `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${TTL}`,
        );
        return output(response, {
          access_token: token,
          refresh_token: token,
          token_type: "bearer",
          expires_in: TTL,
          expires_at: Math.floor(Date.now() / 1000) + TTL,
          user: user(),
        });
      }
      const authorized = await session(request);
      if (path === "/auth/v1/user" && method === "GET") {
        if (!authorized) fail(401, "Connexion requise.", "session_not_found");
        return output(response, user());
      }
      if (path === "/auth/v1/logout" && method === "POST") {
        const token =
          request.headers.authorization?.replace(/^Bearer /, "") ||
          request.headers.cookie
            ?.split(";")
            .map((s) => s.trim())
            .find((s) => s.startsWith(`${COOKIE}=`))
            ?.slice(COOKIE.length + 1);
        if (token)
          await exclusive(async () => {
            const auth = await read("auth.json");
            delete auth.sessions[hash(token)];
            await save("auth.json", auth);
          });
        response.setHeader("set-cookie", `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
        return output(response, {});
      }
      if (path.startsWith("/rest/v1/rpc/") && method === "POST") {
        const name = path.slice("/rest/v1/rpc/".length);
        const args = await jsonBody(request);
        if (name === "admin_exists") return output(response, true);
        if (name === "has_role")
          return output(
            response,
            authorized && args._user_id === OWNER_ID && args._role === "admin",
          );
        if (name === "track_site_event") {
          if (
            !z.string().uuid().safeParse(args.p_visitor).success ||
            !["pageview", "click"].includes(args.p_kind) ||
            typeof args.p_path !== "string" ||
            !args.p_path.startsWith("/") ||
            /^\/(admin|auth)(\/|$)/.test(args.p_path)
          )
            return output(response, null);
          await exclusive(async () => {
            const db = await database();
            db.events = db.events.filter(
              (e) => new Date(e.created_at).getTime() > Date.now() - 91 * 86400000,
            );
            if (
              db.events.filter(
                (e) =>
                  e.visitor_id === args.p_visitor &&
                  new Date(e.created_at).getTime() > Date.now() - 60000,
              ).length < 60
            )
              db.events.push({
                visitor_id: args.p_visitor,
                kind: args.p_kind,
                path: args.p_path.slice(0, 300),
                target: String(args.p_target || "").slice(0, 300),
                created_at: new Date().toISOString(),
              });
            await save("data.json", db);
          });
          return output(response, null);
        }
        if (name === "admin_analytics") {
          if (!authorized) fail(401, "Connexion requise.");
          const days = args.p_days ?? 30;
          if (![7, 30, 90].includes(days)) fail(400, "Période invalide.");
          const startDay = day(new Date(Date.now() - (days - 1) * 86400000));
          const events = (await database()).events.filter(
            (e) => day(new Date(e.created_at)) >= startDay,
          );
          const aggregate = (rows, key) =>
            Object.entries(
              rows.reduce((counts, row) => {
                counts[row[key]] = (counts[row[key]] || 0) + 1;
                return counts;
              }, {}),
            )
              .map(([value, count]) => ({ [key]: value, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10);
          const views = events.filter((e) => e.kind === "pageview");
          const clicks = events.filter((e) => e.kind === "click");
          const daily = Array.from({ length: days }, (_, i) => {
            const date = day(new Date(Date.now() - (days - 1 - i) * 86400000));
            return {
              day: date,
              views: views.filter((e) => day(new Date(e.created_at)) === date).length,
              clicks: clicks.filter((e) => day(new Date(e.created_at)) === date).length,
            };
          });
          return output(response, {
            visitors: new Set(views.map((e) => e.visitor_id)).size,
            views: views.length,
            clicks: clicks.length,
            daily,
            pages: aggregate(views, "path"),
            targets: aggregate(clicks, "target"),
          });
        }
        fail(404, "Fonction inconnue.");
      }
      if (path.startsWith("/rest/v1/")) {
        const table = path.slice("/rest/v1/".length);
        if (!Object.hasOwn(schemas, table)) fail(404, "Table inconnue.");
        if (!authorized && (table === "contact_messages" ? method !== "POST" : method !== "GET"))
          fail(401, "Connexion requise.");
        const matches = (row) =>
          [...url.searchParams].every(
            ([key, value]) =>
              ["select", "order", "limit"].includes(key) ||
              (value.startsWith("eq.") && String(row[key]) === value.slice(3)),
          );
        const values = method === "GET" ? null : await jsonBody(request);
        const result = await exclusive(async () => {
          const db = await database();
          let rows = db[table].filter(matches);
          if (method === "GET") {
            if (!authorized && table === "projects") rows = rows.filter((p) => p.is_published);
            if (!authorized && table === "project_media")
              rows = rows.filter((m) =>
                db.projects.some((p) => p.id === m.project_id && p.is_published),
              );
            rows = sorted(rows, url.searchParams.get("order"));
            const limit = Number(url.searchParams.get("limit"));
            if (limit > 0) rows = rows.slice(0, limit);
          } else if (method === "POST" && table !== "site_settings") {
            rows = (Array.isArray(values) ? values : [values]).map((value) => ({
              ...schemas[table].parse({
                ...defaults[table],
                ...value,
                ...(table === "contact_messages" && !authorized ? { is_read: false } : {}),
              }),
              id: randomUUID(),
              created_at: new Date().toISOString(),
              ...(table === "projects" ? { updated_at: new Date().toISOString() } : {}),
            }));
            if (
              table === "projects" &&
              rows.some((p) => db.projects.some((other) => other.slug === p.slug))
            )
              fail(409, "Cette adresse de projet existe déjà.");
            if (
              table === "project_media" &&
              rows.some((m) => !db.projects.some((p) => p.id === m.project_id))
            )
              fail(400, "Projet introuvable.");
            db[table].push(...rows);
          } else if (method === "PATCH") {
            if (
              ![...url.searchParams].some(([key, value]) => key === "id" && value.startsWith("eq."))
            )
              fail(400, "Identifiant requis.");
            const patch = schemas[table].partial().parse(values);
            if (
              table === "projects" &&
              patch.slug &&
              db.projects.some((p) => p.slug === patch.slug && !rows.includes(p))
            )
              fail(409, "Cette adresse de projet existe déjà.");
            for (const row of rows)
              Object.assign(
                row,
                patch,
                "updated_at" in row ? { updated_at: new Date().toISOString() } : {},
              );
          } else if (method === "DELETE" && table !== "site_settings") {
            if (!url.searchParams.has("id")) fail(400, "Identifiant requis.");
            db[table] = db[table].filter((row) => !rows.includes(row));
            if (table === "projects")
              db.project_media = db.project_media.filter(
                (m) => !rows.some((p) => p.id === m.project_id),
              );
          } else fail(405, "Opération non autorisée.");
          if (method !== "GET") await save("data.json", db);
          const select = url.searchParams.get("select");
          return select && select !== "*"
            ? rows.map((row) => Object.fromEntries(select.split(",").map((key) => [key, row[key]])))
            : rows;
        });
        if (request.headers.accept?.includes("application/vnd.pgrst.object+json")) {
          if (result.length !== 1) fail(406, "Ligne introuvable.", "PGRST116");
          return output(response, result[0]);
        }
        return output(response, result);
      }
      if (path.startsWith("/storage/v1/")) {
        const prefix = "/storage/v1/object/";
        if (path.startsWith(`${prefix}sign/portfolio`) && method === "POST") {
          const payload = await jsonBody(request);
          const db = await database();
          const urlFor = (value) => {
            filePath(value);
            if (!authorized && !publicMedia(db, value)) fail(403, "Média privé.");
            return `/object/public/portfolio/${value}`;
          };
          if (path === `${prefix}sign/portfolio`)
            return output(
              response,
              (payload.paths || []).map((value) => ({
                path: value,
                signedURL: urlFor(value),
                error: null,
              })),
            );
          return output(response, {
            signedURL: urlFor(path.slice(`${prefix}sign/portfolio/`.length)),
          });
        }
        if (path.startsWith(`${prefix}public/portfolio/`) && ["GET", "HEAD"].includes(method)) {
          const value = path.slice(`${prefix}public/portfolio/`.length);
          const target = filePath(value);
          if (!authorized && !publicMedia(await database(), value)) fail(404, "Média introuvable.");
          const info = await stat(target);
          let start = 0;
          let end = info.size - 1;
          let status = 200;
          if (request.headers.range) {
            const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range);
            if (!range) fail(416, "Plage invalide.");
            start = Number(range[1]);
            end = range[2] ? Math.min(Number(range[2]), end) : end;
            if (start > end || start >= info.size) fail(416, "Plage invalide.");
            status = 206;
            response.setHeader("content-range", `bytes ${start}-${end}/${info.size}`);
          }
          response.writeHead(status, {
            "content-type": mimeTypes[value.split(".").pop()],
            "content-length": end - start + 1,
            "accept-ranges": "bytes",
            "cache-control": "private, max-age=60",
            "x-content-type-options": "nosniff",
          });
          if (method === "HEAD") return response.end();
          const file = await open(target);
          file
            .createReadStream({ start, end, autoClose: true })
            .on("error", () => response.destroy())
            .pipe(response);
          return;
        }
        if (!authorized) fail(401, "Connexion requise.");
        if (path === `${prefix}portfolio` && method === "DELETE") {
          const payload = await jsonBody(request);
          for (const value of payload.prefixes || []) {
            try {
              await unlink(filePath(value));
            } catch (error) {
              if (error.code !== "ENOENT") throw error;
            }
          }
          return output(response, []);
        }
        if (path.startsWith(`${prefix}portfolio/`) && method === "POST") {
          const value = path.slice(`${prefix}portfolio/`.length);
          const target = filePath(value);
          let bytes = await body(request, 51 * 1024 * 1024);
          if (request.headers["content-type"]?.startsWith("multipart/form-data")) {
            const form = await new Response(bytes, {
              headers: { "content-type": request.headers["content-type"] },
            }).formData();
            const file = [...form.values()].find((v) => v instanceof Blob);
            if (!file) fail(400, "Fichier requis.");
            bytes = Buffer.from(await file.arrayBuffer());
          }
          if (!bytes.length || bytes.length > 50 * 1024 * 1024)
            fail(413, "Fichier vide ou supérieur à 50 Mo.");
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, bytes, { flag: "wx" });
          return output(response, { Id: randomUUID(), Key: `portfolio/${value}` });
        }
      }
      fail(404, "Route locale inconnue.");
    } catch (error) {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      const status =
        error instanceof z.ZodError ? 400 : error.status || (error.code === "ENOENT" ? 404 : 500);
      if (status === 500) console.error("[local backend]", error);
      output(
        response,
        {
          message: status === 500 ? "Erreur du stockage local." : error.message,
          code: error.code || "local_error",
          error_code: error.code || "local_error",
        },
        status,
      );
    }
  };
}
