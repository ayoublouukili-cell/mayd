import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FolderKanban, Inbox, LogOut, Settings2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    return { isAdmin: data === true };
  },
  head: () => ({
    meta: [
      { title: "Administration du portfolio" },
      { name: "description", content: "Gestion des réalisations, messages et réglages du site." },
      { property: "og:title", content: "Administration du portfolio" },
      {
        property: "og:description",
        content: "Gestion des réalisations, messages et réglages du site.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ["admin"] });
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

const NAV = [
  { to: "/admin", label: "Réalisations", icon: FolderKanban, exact: true },
  { to: "/admin/messages", label: "Messages", icon: Inbox, exact: false },
  { to: "/admin/reglages", label: "Réglages du site", icon: Settings2, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const signOut = useSignOut();

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beige">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-3xl font-medium">Accès non autorisé</h1>
          <p className="mt-3 text-muted-foreground">
            Le compte {user.email} n'a pas les droits d'administration de ce site.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={signOut}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Se déconnecter
            </button>
            <Link to="/" className="rounded-full border px-5 py-2.5 text-sm font-medium">
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
          <Link to="/admin" className="font-semibold tracking-[0.16em]">
            MAYD
          </Link>
          <nav
            className="flex flex-1 items-center gap-1 overflow-x-auto"
            aria-label="Administration"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                aria-label={n.label}
                className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                <n.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
          </nav>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:flex"
          >
            Voir le site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm"
            aria-label="Se déconnecter"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {import.meta.env.DEV && import.meta.env["VITE_LOCAL_ADMIN"] === "true" && (
          <p className="mb-6 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
            Espace local · Vos changements sont enregistrés sur le PC qui héberge le site.
          </p>
        )}
        <Outlet />
      </main>
    </div>
  );
}
