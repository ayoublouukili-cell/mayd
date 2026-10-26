import { Text } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";
import { NAV_LINKS } from "./Header";
import { OfficialLogo } from "./OfficialLogo";
export function Footer() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const year = new Date().getFullYear();
  const socials = [
    { label: "Instagram", href: s.instagram_url },
    { label: "Facebook", href: s.facebook_url },
    { label: "TikTok", href: s.tiktok_url },
  ].filter(
    (
      x,
    ): x is {
      label: string;
      href: string;
    } => !!x.href,
  );
  const wa = whatsappLink(s.whatsapp);
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center rounded-xl bg-paper px-3 py-1 text-ink dark:rounded-none dark:bg-transparent dark:p-0">
              <OfficialLogo
                name={`${s.brand_name} ${s.brand_suffix}`}
                className="!h-20 !w-56"
                themeAware
              />
            </div>
            <p className="mt-6 max-w-sm text-paper/60">
              <Text value={s.brand_description} />
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-paper py-3 ps-6 pe-3 text-sm font-medium text-ink transition-all hover:gap-4"
            >
              <Text value={"Discutons de votre projet "} />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-clay-foreground transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/40">
              <Text value={"Navigation"} />
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-paper/80 transition-colors hover:text-paper">
                    <Text value={l.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/40">
              <Text value={"Réseaux"} />
            </p>
            <ul className="mt-5 space-y-3">
              {socials.length === 0 && (
                <li className="text-paper/40">
                  <Text value={"Bientôt disponibles"} />
                </li>
              )}
              {socials.map((x) => (
                <li key={x.label}>
                  <a
                    href={x.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper/80 transition-colors hover:text-paper"
                  >
                    <Text value={x.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/40">
              <Text value={"Contact"} />
            </p>
            <ul className="mt-5 space-y-3 text-paper/80">
              {s.email && (
                <li>
                  <a href={`mailto:${s.email}`} className="transition-colors hover:text-paper">
                    <Text value={s.email} />
                  </a>
                </li>
              )}
              {s.phone && (
                <li>
                  <a
                    href={`tel:${s.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-paper"
                  >
                    <Text value={s.phone} />
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-paper"
                  >
                    <Text value={"WhatsApp"} />
                  </a>
                </li>
              )}
              <li>
                <Link to="/contact" className="transition-colors hover:text-paper">
                  <Text value={"Formulaire de contact"} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 select-none overflow-hidden">
          <p className="font-display text-[11vw] leading-[0.8] text-paper/[0.06] md:text-[10vw]">
            <Text value={s.brand_name} /> <Text value={s.brand_suffix} />
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row">
          <p>
            <Text value={"© "} />
            <Text value={year} /> <Text value={s.brand_name} /> <Text value={s.brand_suffix} />
            <Text value={". Tous droits réservés."} />
          </p>
          <Link to="/admin" className="transition-colors hover:text-paper/80">
            <Text value={"Espace administrateur"} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
