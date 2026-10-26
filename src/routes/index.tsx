import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text, useT } from "@/lib/i18n/Preferences";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { projectsQuery, settingsQuery } from "@/lib/queries";
import { SiteLayout, SectionHeading } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { PortfolioGallery } from "@/components/site/PortfolioGallery";
import { WhySection } from "@/components/site/WhySection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { ShowroomSection } from "@/components/showroom/ShowroomSection";
import { PhoneShowcase } from "@/components/site/PhoneShowcase";
export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [settings] = await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(projectsQuery),
    ]);
    return { brand: `${settings.brand_name} ${settings.brand_suffix}` };
  },
  head: ({ loaderData, matches }) => {
    const brand = loaderData?.brand ?? "MAYD DIGITAL";
    const title = `${brand} · Sites web & réseaux sociaux pour entreprises`;
    const description =
      "Sites web, Instagram, Facebook et TikTok professionnels : une présence digitale moderne et attractive pour les commerces, restaurants, salons et entrepreneurs.";
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
  component: HomePage,
});
function HomePage() {
  const t = useT();
  const { data: portfolio } = useSuspenseQuery(projectsQuery);
  return (
    <SiteLayout>
      <Hero />
      <PhoneShowcase projects={portfolio.projects} />
      <ShowroomSection />
      <ServicesSection />

      <section className="bg-card py-24 md:py-36" id="realisations">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t("Portfolio")}
              title={
                <span className="font-display text-6xl italic md:text-8xl">
                  <Text value={"Nos réalisations"} />
                </span>
              }
              subtitle={t(
                "Découvrez comment nous donnons une nouvelle dimension digitale aux projets.",
              )}
            />
            <Link
              to="/realisations"
              className="group inline-flex shrink-0 items-center gap-2 border-b border-foreground/20 pb-1 font-medium transition-colors hover:border-clay hover:text-clay"
            >
              <Text value={"Voir toutes les réalisations "} />
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div className="mt-14">
            <PortfolioGallery
              projects={portfolio.projects}
              unavailable={!portfolio.available}
              showConcepts
            />
          </div>
        </div>
      </section>

      <WhySection />
      <ProcessSection />
      <AboutSection />
      <ContactSection />
    </SiteLayout>
  );
}
