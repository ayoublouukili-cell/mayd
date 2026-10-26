import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text, Count } from "@/lib/i18n/Preferences";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQuery, settingsQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PortfolioGallery } from "@/components/site/PortfolioGallery";
import { Reveal } from "@/components/site/Reveal";
import { DEMOS } from "@/lib/demonstrations";
export const Route = createFileRoute("/realisations/")({
  loader: async ({ context }) => {
    const [s] = await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(projectsQuery),
    ]);
    return { brand: `${s.brand_name} ${s.brand_suffix}` };
  },
  head: ({ loaderData, matches }) => {
    const title = `Réalisations · ${loaderData?.brand ?? "MAYD DIGITAL"}`;
    const description =
      "Sites web, profils Instagram, pages Facebook et comptes TikTok : découvrez les réalisations et projets de présence digitale.";
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
  component: RealisationsPage,
});
function RealisationsPage() {
  const { data: portfolio } = useSuspenseQuery(projectsQuery);
  const projects = portfolio.projects;
  return (
    <SiteLayout>
      <section className="pb-24 pt-36 md:pb-36 md:pt-48">
        <div className="container-x">
          <Reveal className="max-w-4xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-clay" />
              <Text value="Portfolio" /> ·{" "}
              {portfolio.available && (
                <>
                  <Count value={projects.length} kind="existing" /> ·{" "}
                </>
              )}
              <Count value={DEMOS.length} kind="concepts" />
            </p>
            <h1 className="mt-6 font-display text-7xl italic leading-[0.9] md:text-[9rem]">
              <Text value={"Nos réalisations "} />
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              <Text
                value={
                  "Découvrez comment nous donnons une nouvelle dimension digitale aux projets. "
                }
              />
            </p>
          </Reveal>
          <div className="mt-16">
            <PortfolioGallery projects={projects} unavailable={!portfolio.available} showConcepts />
          </div>
          <Reveal className="mt-28 flex flex-col items-center rounded-[2rem] bg-ink px-6 py-16 text-center text-paper md:py-24">
            <h2 className="max-w-2xl text-balance text-4xl font-medium md:text-6xl">
              <Text value={"Votre entreprise pourrait être"} />
              <Text value={" "} />
              <span className="font-display italic text-clay">
                <Text value={"la prochaine."} />
              </span>
            </h2>
            <Link
              to="/contact"
              className="mt-10 rounded-full bg-paper px-7 py-4 font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              <Text value={"Discutons de votre projet "} />
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
