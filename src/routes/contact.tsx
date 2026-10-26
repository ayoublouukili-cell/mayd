import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { useT } from "@/lib/i18n/Preferences";
import { createFileRoute } from "@tanstack/react-router";
import { settingsQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ContactSection } from "@/components/site/ContactSection";
export const Route = createFileRoute("/contact")({
  loader: async ({ context }) => {
    const s = await context.queryClient.ensureQueryData(settingsQuery);
    return { brand: `${s.brand_name} ${s.brand_suffix}` };
  },
  head: ({ loaderData, matches }) => {
    const title = `Contact · ${loaderData?.brand ?? "MAYD DIGITAL"}`;
    const description =
      "Parlons de votre activité et construisons ensemble votre présence digitale : site web, Instagram, Facebook ou TikTok.";
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
  component: ContactPage,
});
function ContactPage() {
  return (
    <SiteLayout>
      <div className="pt-16 md:pt-20">
        <ContactSection />
      </div>
    </SiteLayout>
  );
}
