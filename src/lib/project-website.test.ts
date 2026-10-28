import { describe, expect, it } from "vitest";
import { DEMOS, LEGACY_WEBSITES, findDemo } from "./demonstrations";
import { projectWebsite } from "./project-website";
import { translate } from "./i18n/translate";
import { showroomMessages } from "./i18n/showroom-messages";

describe("Portfolio website destinations", () => {
  it("renders authored interface labels instead of technical message keys", () => {
    for (const [key, labels] of Object.entries(showroomMessages))
      for (const language of ["fr", "en", "ar"] as const)
        expect(translate(language, key)).toBe(labels[language]);
  });
  it("preserves actual published website addresses", () => {
    expect(
      projectWebsite({
        slug: "chiwabox-cuisine-marocaine",
        is_demo: false,
        external_url: "https://moroccan-feast-order-chat.lovable.app/",
      }),
    ).toBe("https://moroccan-feast-order-chat.lovable.app/");
  });
  it("opens each existing database concept under its own identity", () => {
    for (const demo of LEGACY_WEBSITES) {
      expect(projectWebsite({ slug: demo.slug, is_demo: true, external_url: null })).toBe(
        `/demonstrations/${demo.slug}/site`,
      );
      expect(findDemo(demo.slug)?.name).toBe(demo.name);
      expect(demo.services.length).toBeGreaterThan(0);
      expect(demo.images).toHaveLength(6);
    }
    expect(LEGACY_WEBSITES).toHaveLength(4);
    expect(new Set([...DEMOS, ...LEGACY_WEBSITES].map((d) => d.slug)).size).toBe(15);
  });
  it("does not fabricate a website for an unknown client project", () => {
    expect(
      projectWebsite({ slug: "demo-cafe-de-quartier", is_demo: false, external_url: null }),
    ).toBeNull();
    expect(projectWebsite({ slug: "unknown", is_demo: true, external_url: null })).toBeNull();
  });
});
