import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { OfficialLogo } from "./OfficialLogo";
import { PreferenceControls } from "./PreferenceControls";
export const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/demonstrations", label: "Démonstrations" },
  { to: "/realisations", label: "Réalisations" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;
export function Brand({
  onClick,
  themeAware = false,
}: {
  onClick?: () => void;
  themeAware?: boolean;
}) {
  const t = useT();
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <Link
      to="/"
      onClick={onClick}
      className="site-brand group flex shrink-0 items-baseline gap-2 whitespace-nowrap"
      aria-label={t(`${s.brand_name} ${s.brand_suffix} — accueil`)}
    >
      <OfficialLogo name={`${s.brand_name} ${s.brand_suffix}`} themeAware={themeAware} />
    </Link>
  );
}
export function Header() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 bg-background/95 transition-all duration-500",
        scrolled || open ? "shadow-[0_1px_0_var(--color-border)]" : "",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Brand themeAware onClick={() => setOpen(false)} />

        <nav aria-label={t("Navigation principale")} className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {({ isActive }) => (
                <>
                  <Text value={l.label} />
                  <span
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-clay transition-transform duration-500",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <PreferenceControls />
          </div>
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border bg-card/60 px-3 text-sm font-medium transition-colors hover:bg-accent sm:px-4"
            aria-label={t("Connexion admin")}
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <Text value="Login" />
          </Link>
          <Link
            to="/contact"
            className="group hidden items-center gap-2 rounded-full bg-primary py-2.5 ps-5 pe-2.5 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:bg-ink-soft 2xl:inline-flex"
          >
            <Text value={"Démarrer un projet "} />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-clay-foreground transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-full border bg-card/60 xl:hidden"
            aria-label={t(open ? "Fermer le menu" : "Ouvrir le menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-background transition-all duration-500 md:top-20 xl:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav
          aria-label={t("Navigation mobile")}
          className="container-x flex min-h-full flex-col pb-10 pt-4"
        >
          <PreferenceControls mobile />
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between border-b py-3 font-display text-3xl transition-all duration-500 data-[status=active]:text-clay",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            >
              <Text value={l.label} />
              <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-medium text-primary-foreground"
          >
            <Text value={"Démarrer un projet "} />
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
