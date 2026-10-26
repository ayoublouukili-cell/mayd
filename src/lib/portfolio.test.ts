import { describe, expect, it } from "vitest";
import { DEMOS } from "./demonstrations";
import { filterPortfolio, type PortfolioEntry } from "./portfolio";
import type { PublicProject } from "./public-data.functions";

const client = {
  id: "client",
  is_demo: false,
  categories: ["sites-web", "identite-visuelle"],
} as PublicProject;
const oldDemo = { id: "old-demo", is_demo: true, categories: ["instagram"] } as PublicProject;
const entries: PortfolioEntry[] = [
  { kind: "project", project: client },
  { kind: "project", project: oldDemo },
  ...DEMOS.map((concept) => ({ kind: "concept" as const, concept })),
];
describe("Filtres du portfolio", () => {
  it("conserve les projets existants et ajoute onze concepts uniques", () => {
    expect(filterPortfolio(entries, "all", "all")).toHaveLength(DEMOS.length + 2);
    expect(new Set(DEMOS.map((d) => d.slug)).size).toBe(11);
    expect(filterPortfolio(entries, "clients", "all")).toEqual([
      { kind: "project", project: client },
    ]);
  });
  it("réunit les anciennes et nouvelles démonstrations sans les présenter comme clients", () => {
    expect(filterPortfolio(entries, "demos", "all")).toHaveLength(DEMOS.length + 1);
    expect(filterPortfolio(entries, "demos", "instagram")).toHaveLength(DEMOS.length + 1);
    expect(filterPortfolio(entries, "demos", "sites-web")).toHaveLength(DEMOS.length);
  });
  it("croise les filtres sans attribuer des services inexistants aux concepts", () => {
    expect(filterPortfolio(entries, "demos", "identite-visuelle")).toHaveLength(DEMOS.length);
    expect(filterPortfolio(entries, "clients", "instagram")).toHaveLength(0);
    expect(filterPortfolio(entries, "clients", "identite-visuelle")).toHaveLength(1);
  });
  it("propose au moins cinq concepts accessibles dans chaque catégorie, sans dupliquer Tous", () => {
    for (const category of ["sites-web", "instagram", "facebook", "tiktok", "identite-visuelle"])
      expect(filterPortfolio(entries, "demos", category).length).toBeGreaterThanOrEqual(5);
    expect(filterPortfolio(entries, "all", "all")).toHaveLength(entries.length);
  });
});
