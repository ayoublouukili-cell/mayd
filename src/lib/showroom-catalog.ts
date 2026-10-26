import { DEMOS, type Demo } from "./demonstrations";

export const DEMO_PLATFORMS = ["instagram", "facebook", "tiktok", "site", "identite"] as const;
export type DemoPlatform = (typeof DEMO_PLATFORMS)[number];
export function demoPlatform(value: unknown): DemoPlatform {
  return DEMO_PLATFORMS.includes(value as DemoPlatform) ? (value as DemoPlatform) : "instagram";
}
export function categoryPlatform(category: string): DemoPlatform {
  return (
    ({ "sites-web": "site", "identite-visuelle": "identite" } as Record<string, DemoPlatform>)[
      category
    ] ?? demoPlatform(category)
  );
}
export const BRAND_UNIVERSES: Record<
  string,
  {
    palette: [string, string, string];
    type: string;
    motif: string;
    direction: string;
  }
> = {
  gaming: {
    palette: ["#bcff68", "#111318", "#a497f7"],
    type: "Geist",
    motif: "Grille modulaire",
    direction: "Une identité électrique, construite autour du jeu collectif.",
  },
  immobilier: {
    palette: ["#2d5748", "#f3f0e6", "#b39767"],
    type: "Instrument Serif",
    motif: "Arches architecturales",
    direction: "Des lignes ouvertes et une élégance éditoriale pour habiter demain.",
  },
  coiffure: {
    palette: ["#955f53", "#f7ece2", "#45332c"],
    type: "Instrument Serif",
    motif: "Courbes organiques",
    direction: "Une signature douce et sensible, entre geste et matière.",
  },
  voitures: {
    palette: ["#bde0ff", "#15212e", "#e5ebee"],
    type: "Geist",
    motif: "Lignes de mouvement",
    direction: "Une identité précise et mobile, pensée pour prendre la route.",
  },
  restaurant: {
    palette: ["#a35334", "#f6ebd7", "#526044"],
    type: "Instrument Serif",
    motif: "Pétales de safran",
    direction: "Des couleurs épicées et une expression généreuse de l’art de recevoir.",
  },
  sport: {
    palette: ["#d9ee76", "#17251f", "#eff1e7"],
    type: "Geist",
    motif: "Cercles en mouvement",
    direction: "Un langage graphique rythmé, porté par l’énergie du mouvement.",
  },
  habitat: {
    palette: ["#9b6547", "#f4eee3", "#283c35"],
    type: "Instrument Serif",
    motif: "Arches et plans de quartier",
    direction: "Une identité architecturale et éditoriale pour une recherche immobilière apaisée.",
  },
  arcade: {
    palette: ["#a9ff4b", "#151821", "#8b7bff"],
    type: "Geist",
    motif: "Grille tactique et pixels décalés",
    direction: "Une identité compétitive en blocs, pensée pour l’énergie d’une arène connectée.",
  },
  boutique: {
    palette: ["#557154", "#f5efe2", "#c78b54"],
    type: "Instrument Serif",
    motif: "Herbier contemporain et étiquettes",
    direction:
      "Une identité botanique et tactile, pensée comme un journal de rituels contemporains.",
  },
  azahar: {
    palette: ["#bd603e", "#fbf1dc", "#34584a"],
    type: "Instrument Serif",
    motif: "Agrumes, carreaux et menus manuscrits",
    direction:
      "Une identité culinaire lumineuse, entre gestes du marché et convivialité méditerranéenne.",
  },
  cadence: {
    palette: ["#f2764b", "#172c49", "#f2d45c"],
    type: "Geist",
    motif: "Pistes, chronomètres et trajectoires",
    direction: "Une identité athlétique et rythmée, dessinée autour des trajectoires du mouvement.",
  },
};
// A single catalogue: existing concepts retain their slugs, media and detail pages.
export const SHOWROOM_CATALOG: readonly Demo[] = DEMOS;
