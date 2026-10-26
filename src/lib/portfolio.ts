import type { PublicProject } from "./public-data.functions";
import type { Demo } from "./demonstrations";

export type PortfolioEntry =
  { kind: "project"; project: PublicProject } | { kind: "concept"; concept: Demo };
export type PortfolioSource = "all" | "clients" | "demos";
export const CONCEPT_CATEGORIES = [
  "sites-web",
  "instagram",
  "facebook",
  "tiktok",
  "identite-visuelle",
];
export function entryCategories(entry: PortfolioEntry) {
  return entry.kind === "concept" ? CONCEPT_CATEGORIES : entry.project.categories;
}
export function filterPortfolio(
  entries: PortfolioEntry[],
  source: PortfolioSource,
  category: string,
) {
  return entries.filter((entry) => {
    const isDemo = entry.kind === "concept" || entry.project.is_demo;
    return (
      (source === "all" || (source === "demos" ? isDemo : !isDemo)) &&
      (category === "all" || entryCategories(entry).includes(category))
    );
  });
}
