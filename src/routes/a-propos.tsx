import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { useT } from "@/lib/i18n/Preferences";
import { createFileRoute } from "@tanstack/react-router";
import { settingsQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AboutSection } from "@/components/site/AboutSection";
import { WhySection } from "@/components/site/WhySection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { ContactSection } from "@/components/site/ContactSection";
export const Route = createFileRoute("/a-propos")({
  loader: async ({ context }) => {
    const s = await context.queryClient.ensureQueryData(settingsQuery);
    return { brand: `${s.brand_name} ${s.brand_suffix}`, owner: s.owner_name };
  },
  head: ({ loaderData, matches }) => {
    const title = `À propos · ${loaderData?.brand ?? "MAYD DIGITAL"}`;
    const description = `${loaderData?.brand ?? "MAYD DIGITAL"} est un studio de création digitale fondé par Mehdi et Ayoub. Nous accompagnons les entreprises dans la création de sites web modernes et le développement de leur présence professionnelle sur Instagram, Facebook et TikTok.`;
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
  component: AboutPage,
});
function AboutPage() {
  return (
    <SiteLayout>
      <div className="pt-16 md:pt-20">
        <AboutSection showLink={false} />
      </div>
      <WhySection />
      <ProcessSection />
      <ContactSection />
    </SiteLayout>
  );
}
