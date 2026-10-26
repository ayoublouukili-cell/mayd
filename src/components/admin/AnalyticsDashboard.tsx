import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, MousePointerClick, Users, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  visitors: number;
  views: number;
  clicks: number;
  daily: { day: string; views: number; clicks: number }[];
  pages: { path: string; count: number }[];
  targets: { target: string; count: number }[];
};

export function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_analytics", { p_days: days });
      if (error) throw error;
      return data as unknown as Stats;
    },
    refetchInterval: 60_000,
  });
  const max = Math.max(1, ...(data?.daily.map((d) => d.views) ?? []));
  return (
    <section className="mb-12" aria-label="Statistiques du site">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-muted-foreground">
            MAYD · Administration
          </p>
          <h2 className="mt-2 text-3xl font-medium">Tableau de bord</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            L'activité de votre site, actualisée chaque minute.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Période des statistiques"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-full border bg-card px-4 py-2 text-sm"
          >
            {[7, 30, 90].map((d) => (
              <option key={d} value={d}>
                {d} derniers jours
              </option>
            ))}
          </select>
          <button
            aria-label="Actualiser les statistiques"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="rounded-full border p-3 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      {isLoading && <Skeleton className="h-32 w-full rounded-3xl" />}
      {error && (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-card p-5">
          <p>
            Les statistiques sont indisponibles. Vérifiez que la migration analytics a été appliquée
            à Supabase.
          </p>
          <button onClick={() => void refetch()} className="mt-3 text-sm underline">
            Réessayer
          </button>
        </div>
      )}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Visiteurs uniques", value: data.visitors, icon: Users },
              { label: "Pages vues", value: data.views, icon: Eye },
              { label: "Clics", value: data.clicks, icon: MousePointerClick },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border bg-card p-6">
                <card.icon className="mb-5 h-5 w-5 text-clay" />
                <p className="text-4xl font-medium">{card.value.toLocaleString("fr-FR")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl border bg-card p-6">
            <h3 className="font-medium">Visites par jour</h3>
            {data.daily.length ? (
              <div
                className="mt-6 flex h-32 items-end gap-1 overflow-x-auto"
                role="img"
                aria-label="Pages vues par jour"
              >
                {data.daily.map((d) => (
                  <div
                    key={d.day}
                    title={`${d.day} : ${d.views} pages vues, ${d.clicks} clics`}
                    className="min-w-2 flex-1 rounded-t bg-clay"
                    style={{ height: `${Math.max(2, (d.views / max) * 100)}%` }}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-sm text-muted-foreground">
                Les premières visites apparaîtront ici.
              </p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Visiteurs estimés par navigateur. Les pages admin sont exclues. Période : heure du
              Maroc.
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Pages les plus visitées",
                items: data.pages.map((p) => ({ label: p.path, count: p.count })),
              },
              {
                title: "Liens et boutons les plus cliqués",
                items: data.targets.map((t) => ({ label: t.target, count: t.count })),
              },
            ].map((list) => (
              <div key={list.title} className="rounded-3xl border bg-card p-6">
                <h3 className="mb-4 font-medium">{list.title}</h3>
                {list.items.length ? (
                  <ul className="divide-y">
                    {list.items.map((item) => (
                      <li key={item.label} className="flex justify-between gap-4 py-3 text-sm">
                        <span className="truncate" title={item.label}>
                          {item.label}
                        </span>
                        <span>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune donnée pour cette période.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
