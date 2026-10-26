import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { useT } from "@/lib/i18n/Preferences";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { findDemo } from "@/lib/demonstrations";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DemoExperience } from "@/components/showroom/DemoExperience";
import { settingsQuery } from "@/lib/queries";
import { demoPlatform, type DemoPlatform } from "@/lib/showroom-catalog";
export const Route = createFileRoute("/demonstrations/$sector/")({
  validateSearch: (search: Record<string, unknown>): { platform?: DemoPlatform } => ({
    platform: demoPlatform(search["platform"]),
  }),
  loader: async ({ params, context }) => {
    const demo = findDemo(params.sector);
    if (!demo) throw notFound();
    await context.queryClient.ensureQueryData(settingsQuery);
    return demo;
  },
  head: ({ loaderData, matches }) =>
    localizeHead(
      {
        meta: [
          { title: `${loaderData?.name ?? "Concept introuvable"} · Démonstration · MAYD DIGITAL` },
          {
            name: "description",
            content: `Concept de démonstration ${loaderData?.name ?? ""} : cinq expériences digitales pour une entreprise fictive.`,
          },
        ],
      },
      localeFromMatches(matches),
    ),
  component: DemoPage,
});
function DemoPage() {
  const demo = Route.useLoaderData();
  const { platform } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <SiteLayout>
      <DemoExperience
        key={demo.slug}
        demo={demo}
        platform={platform ?? "instagram"}
        onPlatformChange={(value) =>
          void navigate({
            search: { platform: demoPlatform(value) },
            replace: true,
            resetScroll: false,
          })
        }
      />
    </SiteLayout>
  );
}
