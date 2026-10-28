import { Text, useT, Count } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PublicProject } from "@/lib/public-data.functions";
import { PROJECT_CATEGORIES, categoryLabel } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SHOWROOM_CATALOG } from "@/lib/showroom-catalog";
import { ConceptProjectCard } from "@/components/showroom/ConceptProjectCard";
import { DemoBadge } from "./DemoBadge";
import { projectWebsite } from "@/lib/project-website";
export { DemoBadge } from "./DemoBadge";
import {
  entryCategories,
  filterPortfolio,
  type PortfolioEntry,
  type PortfolioSource,
} from "@/lib/portfolio";
export function ProjectCard({
  project,
  large = false,
}: {
  project: PublicProject;
  large?: boolean;
}) {
  const t = useT();
  const website = projectWebsite(project);
  return (
    <article>
      <Link
        to="/realisations/$slug"
        params={{ slug: project.slug }}
        className="group block focus-visible:outline-none"
        aria-label={`${t("Voir le projet")} ${t(project.title)}`}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-beige ring-offset-4 ring-offset-background transition-shadow duration-500 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-ring",
            large ? "aspect-[4/3] md:aspect-[16/11]" : "aspect-[4/3]",
          )}
        >
          {project.cover_url ? (
            <img
              src={project.cover_url}
              alt={t(project.title)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {project.is_demo && <DemoBadge />}
          </div>
          <div className="absolute bottom-5 right-5 flex translate-y-3 items-center gap-2 rounded-full bg-paper py-2 ps-4 pe-2 text-sm font-medium text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <Text value={"Voir le projet "} />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-clay-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              <Text value={project.client_category} />
            </p>
            <h3 className="mt-1 text-2xl font-medium tracking-tight transition-colors group-hover:text-clay">
              <Text value={project.title} />
            </h3>
            {project.short_description && (
              <p className="mt-2 line-clamp-2 max-w-xl text-muted-foreground">
                <Text value={project.short_description} />
              </p>
            )}
          </div>
        </div>
        {project.services.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={t("Services réalisés")}>
            {project.services.map((s) => (
              <li key={s} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <Text value={s} />
              </li>
            ))}
          </ul>
        )}
        <span className="mt-5 inline-flex items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-medium transition-colors group-hover:border-clay group-hover:text-clay md:hidden">
          <Text value={"Voir le projet "} />
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Text value="Visiter le site" />
          <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}
export function PortfolioGallery({
  projects,
  limit,
  showConcepts = false,
  unavailable = false,
}: {
  projects: PublicProject[];
  limit?: number;
  showConcepts?: boolean;
  unavailable?: boolean;
}) {
  const t = useT();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [source, setSource] = useState<PortfolioSource>("all");
  const entries = useMemo<PortfolioEntry[]>(
    () => [
      ...projects.map((project) => ({ kind: "project" as const, project })),
      ...(showConcepts
        ? SHOWROOM_CATALOG.map((concept) => ({ kind: "concept" as const, concept }))
        : []),
    ],
    [projects, showConcepts],
  );
  const available = useMemo(() => {
    const set = new Set(entries.flatMap(entryCategories));
    return PROJECT_CATEGORIES.filter((c) => set.has(c.slug));
  }, [entries]);
  const filtered = useMemo(() => {
    const list = filterPortfolio(entries, source, filter);
    return limit ? list.slice(0, limit) : list;
  }, [entries, source, filter, limit]);
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-card/50 px-6 py-20 text-center">
        <p className="font-display text-3xl italic">
          <Text value={"Les premières réalisations arrivent bientôt."} />
        </p>
        <p className="mt-3 text-muted-foreground">
          <Text value={"En attendant, parlons de votre projet."} />
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          <Text value={"Nous contacter "} />
        </Link>
      </div>
    );
  }
  return (
    <div>
      {unavailable && (
        <div
          role="status"
          className="mb-6 rounded-2xl border bg-card p-4 text-sm text-muted-foreground"
        >
          <Text value="Les projets clients sont temporairement indisponibles. Les démonstrations restent accessibles." />
          <button
            type="button"
            onClick={() => void queryClient.invalidateQueries({ queryKey: ["public", "projects"] })}
            className="ms-3 font-medium underline underline-offset-4"
          >
            <Text value="Réessayer" />
          </button>
        </div>
      )}
      {showConcepts && (
        <>
          <div
            role="group"
            aria-label={t("Origine des projets")}
            className="mb-5 flex flex-wrap gap-2"
          >
            {(
              [
                { id: "all", label: "Tous" },
                { id: "clients", label: "Projets clients" },
                { id: "demos", label: "Démonstrations" },
              ] as const
            ).map((option) => (
              <button
                type="button"
                key={option.id}
                aria-pressed={source === option.id}
                onClick={() => setSource(option.id)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm transition-colors",
                  source === option.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <Text value={option.label} />
              </button>
            ))}
          </div>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            <Text
              value={
                "Explorez les projets existants et nos concepts fictifs, identifiés par le badge « Concept de démonstration »."
              }
            />
          </p>
        </>
      )}
      <div
        role="group"
        aria-label={t("Filtrer les réalisations par plateforme")}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
      >
        {[{ slug: "all", label: "Tous les projets" }, ...PROJECT_CATEGORIES].map((c) => {
          const disabled = c.slug !== "all" && !available.some((a) => a.slug === c.slug);
          const active = filter === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => setFilter(c.slug)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm transition-all duration-300",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                disabled &&
                  "cursor-not-allowed opacity-40 hover:border-border hover:text-muted-foreground",
              )}
            >
              <Text value={c.label} />
              <span className="ms-2 opacity-65" aria-hidden="true">
                {filterPortfolio(entries, source, c.slug).length}
              </span>
            </button>
          );
        })}
      </div>
      <p role="status" className="mt-5 text-sm text-muted-foreground">
        <Count value={filtered.length} kind="projects" />
      </p>

      <div
        key={`${source}-${filter}`}
        className="portfolio-grid mt-12 grid gap-x-8 gap-y-16 animate-in fade-in slide-in-from-bottom-2 duration-700 md:grid-cols-2"
      >
        {filtered.map((p, i) => (
          <div
            key={p.kind === "project" ? `project-${p.project.id}` : `concept-${p.concept.slug}`}
            className={cn(i % 2 === 1 && "md:mt-24")}
          >
            {p.kind === "project" ? (
              <ProjectCard project={p.project} large={i % 3 === 0} />
            ) : (
              <ConceptProjectCard demo={p.concept} category={filter} />
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground">
          <p>
            <Text
              value={
                source === "clients"
                  ? "Aucun projet client publié ne correspond à ces filtres."
                  : `Aucun projet ne correspond ${filter === "all" ? "à ces filtres" : `à la catégorie « ${categoryLabel(filter)} »`}.`
              }
            />
          </p>
          <button
            type="button"
            className="mt-4 underline underline-offset-4"
            onClick={() => {
              setFilter("all");
              setSource("all");
            }}
          >
            <Text value={"Réinitialiser les filtres "} />
          </button>
        </div>
      )}
    </div>
  );
}
