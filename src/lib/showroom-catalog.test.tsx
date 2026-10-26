import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DEMOS } from "./demonstrations";
import { BRAND_UNIVERSES, categoryPlatform, DEMO_PLATFORMS } from "./showroom-catalog";
import { messages } from "./i18n/catalog";
import { showroomMessages } from "./i18n/showroom-messages";
import { PreferencesProvider } from "./i18n/Preferences";
import { WebsiteHero } from "@/components/showroom/SiteDirections";

describe("Catalogue du showroom", () => {
  it("possède une destination unique pour chaque catégorie", () => {
    expect(
      ["sites-web", "instagram", "facebook", "tiktok", "identite-visuelle"].map(categoryPlatform),
    ).toEqual(["site", "instagram", "facebook", "tiktok", "identite"]);
    expect(DEMO_PLATFORMS).toHaveLength(5);
  });
  it("traduit intégralement les textes éditoriaux et les tarifs des cinq nouveaux concepts", () => {
    const content = DEMOS.slice(6).flatMap((d) => [
      d.sector,
      d.headline,
      d.intro,
      d.bio,
      d.action,
      d.collection,
      ...d.captions,
      ...d.stories,
      ...d.services.flatMap((s) => [s.name, s.price, s.text]),
      ...d.items.flatMap((i) => [i.title, i.type, i.mode, i.price, i.details, ...i.features]),
      ...d.events.flatMap((e) => [e.title, e.text]),
    ]);
    for (const source of content) {
      expect(messages[source], source).toBeDefined();
      expect(messages[source]?.en, source).toBeTruthy();
      expect(messages[source]?.ar, source).toBeTruthy();
    }
    for (const row of Object.values(showroomMessages))
      expect(row.ar, row.fr).toMatch(/[\u0600-\u06ff]/);
  });
  it("attribue une palette, un motif et une signature à chaque univers", () => {
    expect(new Set(DEMOS.map((d) => BRAND_UNIVERSES[d.theme]?.motif)).size).toBe(DEMOS.length);
    for (const d of DEMOS) {
      const b = BRAND_UNIVERSES[d.theme]!;
      expect(b.palette).toHaveLength(3);
      expect(messages[b.direction]).toBeDefined();
      expect(messages[b.motif]).toBeDefined();
    }
  });
  it("rend cinq structures de hero différentes, dont tous les titres sont traduits", () => {
    const variants = new Set<string>();
    for (const demo of DEMOS) {
      const html = renderToStaticMarkup(
        <PreferencesProvider initial={{ language: "ar", theme: "light" }}>
          <WebsiteHero demo={demo} prefix="test" />
        </PreferencesProvider>,
      );
      variants.add(html.match(/class="direction-hero ([^"]+)/)?.[1] ?? "");
      expect(html).toContain(messages[demo.headline]!.ar);
      expect(html).not.toContain(demo.intro);
    }
    expect(variants.size).toBe(DEMOS.length);
  });
});
