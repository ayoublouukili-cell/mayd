import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShowroomSection } from "@/components/showroom/ShowroomSection";
import { DemoCta } from "@/components/showroom/DemoWebsite";
import { settingsQuery } from "@/lib/queries";
export const Route = createFileRoute("/demonstrations/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  head: ({ matches }) =>
    localizeHead(
      {
        meta: [
          { title: "Nos démonstrations · MAYD DIGITAL" },
          {
            name: "description",
            content:
              "Explorez onze concepts fictifs : immobilier, gaming, coiffure, location de voitures, restaurant, sport et commerce. Sites web, Instagram, Facebook et TikTok.",
          },
        ],
      },
      localeFromMatches(matches),
    ),
  component: () => (
    <SiteLayout>
      <div className="pt-16 md:pt-20">
        <ShowroomSection page />
        <DemoCta />
      </div>
    </SiteLayout>
  ),
});
