import { localizeHead, localeFromMatches } from "@/lib/i18n/translate";
import { Text } from "@/lib/i18n/Preferences";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { PreferencesProvider, usePreferences } from "@/lib/i18n/Preferences";
import { DEFAULT_PREFERENCES, THEME_BOOTSTRAP } from "@/lib/i18n/settings";
import { getVisitorPreferences } from "@/lib/i18n/preferences.functions";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">
          <Text value={"Erreur 404"} />
        </p>
        <h1 className="mt-4 font-display text-6xl text-foreground">
          <Text value={"Page introuvable"} />
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <Text value={"La page que vous cherchez n'existe pas ou a été déplacée. "} />
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Text value={"Retour à l'accueil "} />
          </Link>
        </div>
      </div>
    </div>
  );
}
function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-foreground">
          <Text value={"Cette page n'a pas pu se charger"} />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <Text value={"Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil. "} />
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Text value={"Réessayer "} />
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Text value={"Accueil "} />
          </a>
        </div>
      </div>
    </div>
  );
}
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => ({ preferences: await getVisitorPreferences() }),
  head: ({ matches }) =>
    localizeHead(
      {
        meta: [
          { charSet: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { title: "MAYD DIGITAL" },
          {
            name: "description",
            content:
              "Sites web, Instagram, Facebook et TikTok professionnels pour les entreprises locales et les entrepreneurs.",
          },
          { name: "author", content: "MAYD DIGITAL" },
          { property: "og:type", content: "website" },
          { property: "og:locale", content: "fr_FR" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "theme-color", content: "#F8F7F4" },
        ],
        links: [
          { rel: "stylesheet", href: appCss },
          { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Instrument+Serif:ital@0;1&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap",
          },
        ],
      },
      localeFromMatches(matches),
    ),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) {
  const { preferences } = Route.useRouteContext();
  return (
    <PreferencesProvider initial={preferences ?? DEFAULT_PREFERENCES}>
      <DocumentShell>{children}</DocumentShell>
    </PreferencesProvider>
  );
}
function DocumentShell({ children }: { children: ReactNode }) {
  const { language, resolvedTheme } = usePreferences();
  return (
    <html
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      className={resolvedTheme === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <HeadContent />
      </head>
      <body>
        <Text value={children} />
        <Scripts />
      </body>
    </html>
  );
}
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const { language, resolvedTheme } = usePreferences();
  const previousLanguage = useRef(language);
  useEffect(() => {
    if (previousLanguage.current !== language) {
      previousLanguage.current = language;
      void router.invalidate();
    }
  }, [language, router]);
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolvedTheme === "dark" ? "#181a1d" : "#F8F7F4");
  }, [resolvedTheme]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries({ queryKey: ["admin"] });
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster
        position={language === "ar" ? "bottom-left" : "bottom-right"}
        theme={resolvedTheme}
        dir={language === "ar" ? "rtl" : "ltr"}
      />
    </QueryClientProvider>
  );
}
