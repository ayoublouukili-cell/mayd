import { z } from "zod";

/** Portfolio filter categories. Slugs are stored in projects.categories. */
export const PROJECT_CATEGORIES = [
  { slug: "sites-web", label: "Sites web" },
  { slug: "instagram", label: "Instagram" },
  { slug: "facebook", label: "Facebook" },
  { slug: "tiktok", label: "TikTok" },
  { slug: "identite-visuelle", label: "Identité visuelle" },
] as const;

export type CategorySlug = (typeof PROJECT_CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string): string {
  return PROJECT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

/** Services offered in the contact form "Service souhaité" select. */
export const SERVICE_OPTIONS = [
  "Création de site web",
  "Instagram professionnel",
  "Facebook professionnel",
  "TikTok professionnel",
  "Identité visuelle",
  "Présence digitale complète",
  "Autre / je ne sais pas encore",
] as const;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Converts a YouTube / Vimeo link into an embeddable player URL.
 * Returns null for anything else, so arbitrary sites are never framed.
 */
export function toEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const m = url.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[2]}` : null;
  }
  if (host === "vimeo.com") {
    const m = url.pathname.match(/^\/(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : null;
  }
  if (host === "player.vimeo.com") {
    const m = url.pathname.match(/^\/video\/(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : null;
  }
  return null;
}

/** Normalize Moroccan local numbers and international prefixes for WhatsApp. */
export function whatsappLink(raw: string | null | undefined, text?: string): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^0[5-7]\d{8}$/.test(digits)) digits = `212${digits.slice(1)}`;
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Media values are either absolute URLs, site paths (/demo/...), or storage object paths. */
export function isStoragePath(value: string | null | undefined): value is string {
  return !!value && !/^https?:\/\//.test(value) && !value.startsWith("/");
}

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre nom").max(100, "100 caractères maximum"),
  company: z.string().trim().max(120, "120 caractères maximum").default(""),
  contact: z
    .string()
    .trim()
    .min(3, "Indiquez un téléphone ou un email")
    .max(160, "160 caractères maximum")
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/[^\d]/g, "").length >= 8,
      "Indiquez un email valide ou un numéro de téléphone",
    ),
  service: z.string().trim().max(80).default(""),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez votre projet en quelques mots (10 caractères minimum)")
    .max(2000, "2000 caractères maximum"),
});

export type ContactInput = z.infer<typeof contactSchema>;
