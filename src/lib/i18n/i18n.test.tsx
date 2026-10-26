import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { messages } from "./catalog";
import { translate, localizeHead } from "./translate";
import { parsePreferences, THEME_BOOTSTRAP } from "./settings";
import { PreferencesProvider } from "./Preferences";
import { DemoForm } from "@/components/showroom/DemoForm";
import { DEMOS } from "@/lib/demonstrations";

describe("Préférences et traductions publiques", () => {
  it("utilise le français et le système par défaut, et refuse les préférences invalides", () => {
    expect(parsePreferences()).toEqual({ language: "fr", theme: "system" });
    expect(parsePreferences("xx", "invalid")).toEqual({ language: "fr", theme: "system" });
    expect(parsePreferences("ar", "dark")).toEqual({ language: "ar", theme: "dark" });
  });
  it("fournit une traduction anglaise et arabe pour chaque clé partagée", () => {
    expect(Object.keys(messages).length).toBeGreaterThan(500);
    for (const [key, translations] of Object.entries(messages)) {
      expect(translations.en, key).toBeTruthy();
      expect(translations.ar, key).toBeTruthy();
      expect(translate("en", key), key).toBe(translations.en);
      expect(translate("ar", key), key).toBe(translations.ar);
    }
  });
  it("conserve les marques et les contenus de base non traduits", () => {
    for (const language of ["en", "ar"] as const) {
      for (const demo of DEMOS) expect(translate(language, demo.name)).toBe(demo.name);
      expect(translate(language, "Texte original saisi dans le tableau de bord")).toBe(
        "Texte original saisi dans le tableau de bord",
      );
      expect(translate(language, "MAYD DIGITAL")).toBe("MAYD DIGITAL");
    }
  });
  it("traduit le texte alternatif de la photo d’équipe et retire le placeholder", () => {
    expect(translate("fr", "Deux personnes dans un bureau MAYD DIGITAL")).toBe(
      "Deux personnes dans un bureau MAYD DIGITAL",
    );
    expect(translate("en", "Deux personnes dans un bureau MAYD DIGITAL")).toBe(
      "Two people in a MAYD DIGITAL office",
    );
    expect(translate("ar", "Deux personnes dans un bureau MAYD DIGITAL")).toBe(
      "شخصان في مكتب MAYD DIGITAL",
    );
    expect(messages).not.toHaveProperty("Portrait à venir");
    expect(translate("fr", "Fondateurs de ")).toBe("Fondateurs de ");
    expect(translate("en", "Fondateurs de ")).toBe("Founders of ");
    expect(translate("ar", "Fondateurs de ")).toBe("مؤسسا ");
  });
  it("traduit les titres, descriptions et prix sans convertir les devises", () => {
    expect(translate("en", "Services · MAYD DIGITAL")).toBe("Services · MAYD DIGITAL");
    expect(translate("ar", "Contact · MAYD DIGITAL")).toBe("تواصل معنا · MAYD DIGITAL");
    expect(translate("en", "À partir de 350 MAD / mois")).toBe("From 350 MAD / month");
    expect(
      localizeHead({ meta: [{ property: "og:locale", content: "fr_FR" }] }, "ar").meta[0]?.content,
    ).toBe("ar_MA");
    expect(
      translate(
        "ar",
        "MAYD DIGITAL est un studio de création digitale fondé par Mehdi et Ayoub. Nous accompagnons les entreprises dans la création de sites web modernes et le développement de leur présence professionnelle sur Instagram, Facebook et TikTok.",
      ),
    ).toContain("استوديو");
  });
  it("rend les formulaires en arabe sur le serveur sans accéder à window", () => {
    const html = renderToString(
      <PreferencesProvider initial={{ language: "ar", theme: "dark" }}>
        <DemoForm demo={DEMOS[0]!} prefix="test" />
      </PreferencesProvider>,
    );
    expect(html).toContain("اسم افتراضي");
    expect(html).not.toContain("Nom fictif");
    expect(html).toContain('value="Session découverte"'); // stable values despite translated labels
    expect(THEME_BOOTSTRAP).toContain("prefers-color-scheme");
  });
});
