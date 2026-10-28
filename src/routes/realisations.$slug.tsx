import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text, useT } from "@/lib/i18n/Preferences";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Expand } from "lucide-react";
import { projectQuery, settingsQuery } from "@/lib/queries";
import type { PublicMedia } from "@/lib/public-data.functions";
import { categoryLabel, toEmbedUrl } from "@/lib/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DemoBadge } from "@/components/site/PortfolioGallery";
import { LaptopFrame, PhoneFrame } from "@/components/site/devices";
import { Lightbox, type LightboxImage } from "@/components/site/Lightbox";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { projectWebsite } from "@/lib/project-website";
export const Route = createFileRoute("/realisations/$slug")({
  loader: async ({ context, params }) => {
    const [settings, detail] = await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(projectQuery(params.slug)),
    ]);
    if (!detail) throw notFound();
    return {
      title: detail.project.title,
      brand: `${settings.brand_name} ${settings.brand_suffix}`,
      description: detail.project.short_description || detail.project.business_description,
      cover: detail.project.cover_url,
    };
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) {
      return localizeHead(
        { meta: [{ title: "Projet introuvable" }, { name: "robots", content: "noindex" }] },
        localeFromMatches(matches),
      );
    }
    const title = `${loaderData.title} · Réalisation · ${loaderData.brand}`;
    const meta = [
      { title },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: title },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.cover?.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: loaderData.cover },
        { name: "twitter:image", content: loaderData.cover },
      );
    }
    return localizeHead({ meta }, localeFromMatches(matches));
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});
function ProjectNotFound() {
  return (
    <SiteLayout>
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">
          <Text value={"Projet introuvable"} />
        </p>
        <h1 className="mt-4 font-display text-5xl italic">
          <Text value={"Ce projet n'est pas disponible."} />
        </h1>
        <Link
          to="/realisations"
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          <Text value={"Voir toutes les réalisations "} />
        </Link>
      </div>
    </SiteLayout>
  );
}
function ProjectPage() {
  const t = useT();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectQuery(slug));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = useMemo<LightboxImage[]>(() => {
    if (!data) return [];
    const list: LightboxImage[] = [];
    if (data.project.cover_url) list.push({ src: data.project.cover_url, alt: data.project.title });
    for (const m of data.media) {
      if (m.kind === "image")
        list.push({ src: m.url, alt: m.caption || data.project.title, caption: m.caption });
    }
    return list;
  }, [data]);
  if (!data) return <ProjectNotFound />;
  const { project: p, media, next } = data;
  const website = projectWebsite(p);
  const openImage = (src: string) =>
    setLightbox(
      Math.max(
        0,
        images.findIndex((i) => i.src === src),
      ),
    );
  const story = [
    { label: "L'entreprise", text: p.business_description },
    { label: "Le besoin", text: p.client_needs },
    { label: "Ce que nous avons réalisé", text: p.work_done },
  ].filter((x) => x.text.trim());
  return (
    <SiteLayout>
      <article>
        <header className="pb-12 pt-32 md:pt-44">
          <div className="container-x">
            <Link
              to="/realisations"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <Text value={"Toutes les réalisations "} />
            </Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  {p.is_demo && <DemoBadge className="border bg-card" />}
                  <span className="eyebrow">
                    <Text value={p.client_category} />
                  </span>
                </div>
                <h1 className="mt-6 text-balance text-5xl font-medium leading-[0.98] tracking-tight md:text-8xl">
                  <Text value={p.title} />
                </h1>
                {p.short_description && (
                  <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                    <Text value={p.short_description} />
                  </p>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-6 border-t pt-6 lg:col-span-4 lg:grid-cols-1">
                {p.services.length > 0 && (
                  <div>
                    <dt className="eyebrow">
                      <Text value={"Services"} />
                    </dt>
                    <dd className="mt-2 space-y-1">
                      {p.services.map((s) => (
                        <div key={s}>
                          <Text value={s} />
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                {p.categories.length > 0 && (
                  <div>
                    <dt className="eyebrow">
                      <Text value={"Catégories"} />
                    </dt>
                    <dd className="mt-2">
                      <Text value={p.categories.map(categoryLabel).join(" · ")} />
                    </dd>
                  </div>
                )}
                {website && (
                  <div className="col-span-2 lg:col-span-1">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-full bg-primary py-3 ps-6 pe-3 text-sm font-medium text-primary-foreground"
                    >
                      <Text value={p.external_label || "Visiter le site"} />
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-clay-foreground transition-transform group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </header>

        {p.cover_url && (
          <div className="container-x">
            <button
              type="button"
              onClick={() => openImage(p.cover_url!)}
              className="group relative block w-full overflow-hidden rounded-[2rem] bg-beige animate-enter"
              aria-label={t("Agrandir l'image principale")}
            >
              <img
                src={p.cover_url}
                alt={t(p.title)}
                className="aspect-[16/9] w-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                <Expand className="h-4 w-4" />
              </span>
            </button>
          </div>
        )}

        {story.length > 0 && (
          <section className="py-20 md:py-32">
            <div className="container-x grid gap-12 md:grid-cols-3">
              {story.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <p className="font-display text-2xl italic text-clay">
                    <Text value={"0"} />
                    <Text value={i + 1} />
                  </p>
                  <h2 className="mt-3 text-2xl font-medium">
                    <Text value={s.label} />
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-muted-foreground">
                    <Text value={s.text} />
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {media.length > 0 && (
          <section className="pb-20 md:pb-32">
            <div className="container-x">
              <MediaGrid media={media} title={t(p.title)} onOpen={openImage} />
            </div>
          </section>
        )}

        {p.before_image_url && p.after_image_url && (
          <section className="pb-20 md:pb-32">
            <div className="container-x">
              <Reveal>
                <h2 className="mb-8 text-3xl font-medium md:text-5xl">
                  <Text value={"Avant "} />
                  <span className="font-display italic text-clay">
                    <Text value={"/ après"} />
                  </span>
                </h2>
                <BeforeAfter before={p.before_image_url} after={p.after_image_url} />
              </Reveal>
            </div>
          </section>
        )}

        {next && next.slug !== p.slug && (
          <section className="border-t">
            <Link to="/realisations/$slug" params={{ slug: next.slug }} className="group block">
              <div className="container-x grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
                <div>
                  <p className="eyebrow">
                    <Text value={"Projet suivant"} />
                  </p>
                  <p className="mt-4 text-4xl font-medium tracking-tight transition-colors group-hover:text-clay md:text-6xl">
                    <Text value={next.title} />
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    <Text value={next.client_category} />
                  </p>
                </div>
                {next.cover_url && (
                  <div className="overflow-hidden rounded-3xl bg-beige">
                    <img
                      src={next.cover_url}
                      alt={t(next.title)}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </Link>
          </section>
        )}
      </article>

      <Lightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </SiteLayout>
  );
}
function MediaGrid({
  media,
  title,
  onOpen,
}: {
  media: PublicMedia[];
  title: string;
  onOpen: (src: string) => void;
}) {
  const t = useT();
  const phones = media.filter((m) => m.frame === "phone" && m.kind !== "embed");
  const rest = media.filter((m) => !(m.frame === "phone" && m.kind !== "embed"));
  return (
    <div className="space-y-6">
      {phones.length > 0 && (
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-sand to-beige px-6 py-14 md:px-14 md:py-20">
            <div
              className={cn(
                "mx-auto grid max-w-5xl gap-6 md:gap-10",
                phones.length === 1
                  ? "max-w-xs"
                  : phones.length === 2
                    ? "grid-cols-2 max-w-xl"
                    : "grid-cols-2 md:grid-cols-3",
              )}
            >
              {phones.map((m) => (
                <figure key={m.id}>
                  <PhoneFrame>
                    <MediaContent m={m} title={t(title)} onOpen={onOpen} fill />
                  </PhoneFrame>
                  {m.caption && (
                    <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                      <Text value={m.caption} />
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {rest.map((m, i) => {
          const wide = m.frame === "laptop" || m.kind !== "image" || i % 3 === 0;
          return (
            <Reveal key={m.id} className={cn(wide && "md:col-span-2")}>
              <figure>
                {m.frame === "laptop" ? (
                  <div className="rounded-[2rem] bg-gradient-to-br from-sand to-beige px-6 py-12 md:px-20 md:py-20">
                    <LaptopFrame className="mx-auto max-w-4xl">
                      <MediaContent m={m} title={t(title)} onOpen={onOpen} fill />
                    </LaptopFrame>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[2rem] bg-beige">
                    <MediaContent m={m} title={t(title)} onOpen={onOpen} />
                  </div>
                )}
                {m.caption && (
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    <Text value={m.caption} />
                  </figcaption>
                )}
              </figure>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
function MediaContent({
  m,
  title,
  onOpen,
  fill = false,
}: {
  m: PublicMedia;
  title: string;
  onOpen: (src: string) => void;
  fill?: boolean;
}) {
  const t = useT();
  const fillCls = "absolute inset-0 h-full w-full object-cover object-top";
  if (m.kind === "embed") {
    const src = toEmbedUrl(m.url);
    if (!src) return null;
    return (
      <div className={fill ? "absolute inset-0" : "relative aspect-video w-full"}>
        <iframe
          src={src}
          title={t(m.caption || `Vidéo — ${title}`)}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  if (m.kind === "video") {
    return (
      <video
        src={m.url}
        controls
        playsInline
        preload="metadata"
        className={fill ? fillCls : "w-full bg-ink"}
        aria-label={t(m.caption || `Vidéo — ${title}`)}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(m.url)}
      className={cn("group block w-full cursor-zoom-in", fill && "absolute inset-0")}
      aria-label={t("Agrandir l'image")}
    >
      <img
        src={m.url}
        alt={t(m.caption || title)}
        loading="lazy"
        decoding="async"
        className={cn(
          fill ? fillCls : "w-full transition-transform duration-[1.2s] group-hover:scale-[1.02]",
        )}
      />
    </button>
  );
}
