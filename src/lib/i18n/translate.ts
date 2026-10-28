import { messages } from "./catalog";
import { showroomMessages } from "./showroom-messages";
import type { Language } from "./settings";

// French source strings act as reusable gettext-style keys. One catalog for all views.
const canonical = new Map<string, string>();
for (const [fr, values] of Object.entries(messages)) {
  canonical.set(fr, fr);
  canonical.set(values.en, fr);
  canonical.set(values.ar, fr);
}
function exact(language: Language, value: string): string | undefined {
  if (Object.hasOwn(showroomMessages, value))
    return (showroomMessages as Record<string, { fr: string; en: string; ar: string }>)[value]?.[
      language
    ];
  const key = Object.hasOwn(messages, value) ? value : canonical.get(value);
  if (!key) return;
  return language === "fr" ? key : messages[key]?.[language];
}
export function translate(language: Language, input: string): string {
  if (!input.trim()) return input;
  const source = input.replace(/\s+/g, " ").trim();
  const direct = exact(language, source);
  if (direct !== undefined)
    return (
      input.slice(0, input.indexOf(input.trimStart())) + direct + (input.endsWith(" ") ? " " : "")
    );
  if (source.startsWith("· ")) return " · " + translate(language, source.slice(2));
  if (source.endsWith(" ·")) return translate(language, source.slice(0, -2)) + " · ";
  const studio = source.match(
    /^(.*?) (est un studio de création digitale fondé par Mehdi et Ayoub\.) (Nous accompagnons.*)$/,
  );
  if (studio)
    return `${studio[1]} ${translate(language, studio[2]!)} ${translate(language, studio[3]!)}`;
  const concept = source.match(
    /^Concept de démonstration (.+) : cinq expériences digitales pour une entreprise fictive\.$/,
  );
  if (concept)
    return language === "fr"
      ? source
      : language === "en"
        ? `Demo concept ${concept[1]}: five digital experiences for a fictional business.`
        : `تصور تجريبي ${concept[1]}: خمس تجارب رقمية لشركة افتراضية.`;
  const website = source.match(/^Site de démonstration pour (.+)\. Aucune réservation réelle\.$/);
  if (website)
    return language === "fr"
      ? source
      : language === "en"
        ? `Demo website for ${translate(language, website[1]!)}. No real bookings.`
        : `موقع تجريبي لنشاط ${translate(language, website[1]!)}. لا توجد حجوزات حقيقية.`;
  const empty = source.match(/^Aucun projet ne correspond à la catégorie « (.+) »\.$/);
  if (empty)
    return language === "fr"
      ? source
      : language === "en"
        ? `No projects match the “${translate(language, empty[1]!)}” category.`
        : `لا توجد مشاريع ضمن فئة «${translate(language, empty[1]!)}».`;
  const sector = source.split(" : univers ");
  if (sector.length === 2) return `${translate(language, sector[0]!)} : ${sector[1]}`;
  // Dynamic titles and accessible labels keep names, counts and DB text unchanged.
  if (source.includes(" · "))
    return source
      .split(" · ")
      .map((s) => translate(language, s))
      .join(" · ");
  if (source.includes(" — "))
    return source
      .split(" — ")
      .map((s) => translate(language, s))
      .join(" — ");
  const prefixes: [string, string, string][] = [
    ["Portrait de ", "Portrait of ", "صورة "],
    ["Visuel du projet ", "Project image: ", "صورة المشروع: "],
    ["Voir le projet ", "View project ", "عرض المشروع "],
    [
      "Explorer le projet de démonstration ",
      "Explore concept project ",
      "استكشاف المشروع التجريبي ",
    ],
    ["Agrandir : ", "Enlarge: ", "تكبير: "],
    ["Voir la fiche : ", "View details: ", "عرض التفاصيل: "],
    ["Couverture ", "Cover: ", "غلاف "],
    ["L’univers de ", "The world of ", "عالم "],
    ["Navigation du site ", "Site navigation: ", "التنقل في موقع "],
    ["Plateformes de ", "Platforms for ", "منصات "],
    ["Vidéo", "Video", "فيديو"],
  ];
  for (const row of prefixes)
    for (const prefix of row) {
      if (source.startsWith(prefix)) {
        const target = row[language === "fr" ? 0 : language === "en" ? 1 : 2]!;
        return target + source.slice(prefix.length);
      }
    }
  // Numeric illustrative prices/features are not exchange-rate conversions.
  const units: [RegExp, string, string][] = [
    [/ MAD \/ heure/g, " MAD / hour", " درهم / ساعة"],
    [/ MAD \/ session/g, " MAD / session", " درهم / جلسة"],
    [/ MAD \/ séance/g, " MAD / session", " درهم / حصة"],
    [/ MAD \/ jour/g, " MAD / day", " درهم / يوم"],
    [/ MAD \/ mois/g, " MAD / month", " درهم / شهر"],
    [/ chambres/g, " bedrooms", " غرف نوم"],
    [/ places/g, " seats", " مقاعد"],
    [/ m²/g, " m²", " م²"],
  ];
  if (language !== "fr") {
    let result = source;
    for (const [pattern, en, ar] of units)
      result = result.replace(pattern, language === "en" ? en : ar);
    result = result
      .replace(/^À partir de /, language === "en" ? "From " : "ابتداءً من ")
      .replace(/^Dès /, language === "en" ? "From " : "ابتداءً من ");
    if (language === "ar") result = result.replace(/\bMAD\b/g, "درهم");
    if (result !== source) return result;
  }
  // Untranslated production content is deliberately retained, never blanked.
  return input;
}
export function localeFromMatches(matches: unknown): Language {
  if (!Array.isArray(matches)) return "fr";
  const language = matches[0]?.context?.preferences?.language;
  return language === "en" || language === "ar" ? language : "fr";
}
export function localizeHead<T>(head: T, language: Language): T {
  const result = head as {
    meta?: Array<{
      title?: unknown;
      name?: unknown;
      property?: unknown;
      content?: unknown;
      [key: string]: unknown;
    }>;
  };
  if (!result.meta) return head;
  return {
    ...result,
    meta: result.meta.map((meta) => {
      if (typeof meta.title === "string")
        return { ...meta, title: translate(language, meta.title) };
      if (meta.property === "og:locale")
        return { ...meta, content: { fr: "fr_FR", en: "en_US", ar: "ar_MA" }[language] };
      if (
        [
          "description",
          "og:title",
          "og:description",
          "twitter:title",
          "twitter:description",
        ].includes(String(meta.name ?? meta.property)) &&
        typeof meta.content === "string"
      )
        return { ...meta, content: translate(language, meta.content) };
      return meta;
    }),
  } as T;
}
