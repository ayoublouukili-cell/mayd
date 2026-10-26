import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text, useT } from "@/lib/i18n/Preferences";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { SiteLayout, SectionHeading } from "@/components/site/SiteLayout";
import { SERVICES } from "@/components/site/ServicesSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/services")({
  loader: async ({ context }) => {
    const s = await context.queryClient.ensureQueryData(settingsQuery);
    return { brand: `${s.brand_name} ${s.brand_suffix}` };
  },
  head: ({ loaderData, matches }) => {
    const title = `Services · ${loaderData?.brand ?? "MAYD DIGITAL"}`;
    const description =
      "Création de sites web, Instagram, Facebook et TikTok professionnels : découvrez les services pour construire votre présence digitale de A à Z.";
    return localizeHead(
      {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ],
      },
      localeFromMatches(matches),
    );
  },
  component: ServicesPage,
});
function ServicesPage() {
  const t = useT();
  return (
    <SiteLayout>
      <section className="pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow={t("Services")}
              title={
                <>
                  <Text value={"Votre présence digitale, "} />
                  <span className="font-display italic text-clay">
                    <Text value={"de A à Z."} />
                  </span>
                </>
              }
              subtitle={t(
                "Des solutions adaptées pour valoriser votre activité et faciliter votre découverte par de nouveaux clients.",
              )}
            />
          </Reveal>
          <nav aria-label={t("Services")} className="mt-12 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border bg-card px-5 py-2.5 text-sm transition-colors hover:border-foreground"
              >
                <span className="me-2 text-clay">
                  <Text value={s.num} />
                </span>
                <Text value={s.title} />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-x space-y-6 pb-24">
        {SERVICES.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <Reveal>
              <div className="grid overflow-hidden rounded-[2rem] border bg-card lg:grid-cols-2">
                <div
                  className={cn(
                    "flex items-center justify-center bg-gradient-to-br from-sand to-beige p-10 md:p-16",
                    i % 2 === 1 && "lg:order-2",
                  )}
                >
                  <div className="w-full max-w-md">
                    <Text value={s.visual()} />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-14">
                  <span className="font-display text-6xl italic text-foreground/15">
                    <Text value={s.num} />
                  </span>
                  <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
                    <Text value={s.title} />
                  </h2>
                  <p className="mt-5 text-lg text-muted-foreground">
                    <Text value={s.description} />
                  </p>
                  <ul className="mt-8 space-y-3">
                    {s.includes.map((inc) => (
                      <li key={inc} className="flex gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clay/15 text-clay">
                          <Check className="h-3 w-3" />
                        </span>
                        <Text value={inc} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center gap-3 rounded-full bg-primary py-3 ps-6 pe-3 text-sm font-medium text-primary-foreground transition-all hover:gap-4"
                    >
                      <Text value={"Demander ce service "} />
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-clay-foreground transition-transform group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                    <Link
                      to="/realisations"
                      className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
                    >
                      <Text value={"Voir des réalisations "} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <ProcessSection />
    </SiteLayout>
  );
}
