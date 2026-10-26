import { PreferenceControls } from "@/components/site/PreferenceControls";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text } from "@/lib/i18n/Preferences";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ redirect: z.string().optional() });
function safeRedirect(path?: string) {
  return path && /^\/admin(?:\/|$)/.test(path) && !path.includes("\\") ? path : "/admin";
}
export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: safeRedirect(search.redirect) });
  },
  head: ({ matches }) =>
    localizeHead(
      {
        meta: [
          { title: "Connexion · Espace administrateur" },
          { name: "description", content: "Accès privé à l'espace d'administration du portfolio." },
          { name: "robots", content: "noindex" },
        ],
      },
      localeFromMatches(matches),
    ),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col">
        <Link
          to="/"
          className="relative z-10 flex items-center gap-2 text-sm text-paper/60 hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" />
          <Text value="Retour au site" />
        </Link>
        <div className="relative z-10 mt-auto">
          <p className="font-display text-6xl italic leading-none">
            <Text value="Espace" />
          </p>
          <p className="text-6xl font-medium">
            <Text value="administrateur" />
          </p>
          <p className="mt-6 max-w-sm text-paper/60">
            <Text value="Gérez vos réalisations, vos médias et vos coordonnées sans toucher au code." />
          </p>
        </div>
        <img
          src="/demo/cafe.jpg"
          alt=""
          className="absolute -right-24 top-24 w-[70%] rotate-6 rounded-3xl opacity-30"
        />
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <PreferenceControls />
          </div>
          <Link
            to="/"
            className="mb-10 flex items-center gap-2 text-sm text-muted-foreground lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            <Text value="Retour au site" />
          </Link>
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-clay/10 text-clay">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-medium tracking-tight">
            <Text value="Connexion admin" />
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <Text value="Connectez-vous avec votre identifiant et votre mot de passe." />
          </p>
          <AdminLoginForm
            onSuccess={() => void navigate({ to: safeRedirect(search.redirect), replace: true })}
          />
        </div>
      </div>
    </div>
  );
}
