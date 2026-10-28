import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Demo } from "@/lib/demonstrations";
import { DemoBadge } from "@/components/site/DemoBadge";
import { ConceptCover } from "./ConceptCover";
import { categoryPlatform } from "@/lib/showroom-catalog";
export function ConceptProjectCard({ demo, category = "all" }: { demo: Demo; category?: string }) {
  const t = useT();
  return (
    <article>
      <Link
        to="/demonstrations/$sector"
        params={{ sector: demo.slug }}
        search={{ platform: category === "all" ? "site" : categoryPlatform(category) }}
        className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
        aria-label={t(`Explorer le projet de démonstration ${demo.name}`)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-beige transition-shadow duration-500 group-hover:shadow-lift">
          <ConceptCover
            demo={demo}
            platform={category === "all" ? "site" : categoryPlatform(category)}
          />
          <span className="concept-badge absolute left-4 top-4">
            <Text value="Concept de démonstration" />
          </span>
          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:rotate-45">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          <Text value={demo.sector} />
        </p>
        <h3 className="mt-1 text-2xl font-medium tracking-tight transition-colors group-hover:text-clay">
          <Text value={demo.name} />
        </h3>
        <p className="mt-2 text-muted-foreground">
          <Text value={demo.intro} />
        </p>
        <ul aria-label={t("Plateformes proposées")} className="mt-4 flex flex-wrap gap-2">
          {["Instagram", "Facebook", "TikTok", "Site web", "Identité visuelle"].map((p) => (
            <li key={p} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Text value={p} />
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-medium">
          <Text value={"Explorer la démonstration "} />
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <Link
        to="/demonstrations/$sector/site"
        params={{ sector: demo.slug }}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Text value="Visiter le site" />
        <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
