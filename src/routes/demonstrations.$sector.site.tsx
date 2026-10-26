import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { useT } from "@/lib/i18n/Preferences";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { findDemo } from "@/lib/demonstrations";
import { DemoWebsite } from "@/components/showroom/DemoWebsite";
import { settingsQuery } from "@/lib/queries";
export const Route = createFileRoute("/demonstrations/$sector/site")({
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
          { title: `${loaderData?.name ?? "Concept introuvable"} · Site fictif · MAYD DIGITAL` },
          {
            name: "description",
            content: `Site de démonstration pour ${loaderData?.sector ?? "une entreprise fictive"}. Aucune réservation réelle.`,
          },
        ],
      },
      localeFromMatches(matches),
    ),
  component: DemoSite,
});
function DemoSite() {
  const demo = Route.useLoaderData();
  return <DemoWebsite key={demo.slug} demo={demo} full />;
}
