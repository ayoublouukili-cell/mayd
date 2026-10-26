import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { LaptopFrame, PhoneFrame, ScreenImage } from "./devices";
import { MockFacebook, MockInstagram, MockWebsite } from "./screens";
const SECTORS = [
  "Restaurants",
  "Cafés",
  "Salons de beauté",
  "Boutiques",
  "Entrepreneurs",
  "Artisans",
  "Petites entreprises",
  "Commerces de proximité",
];
export function Hero() {
  const t = useT();
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[640px] w-[640px] rounded-full bg-beige/70 blur-3xl"
      />
      <div className="container-x relative grid items-center gap-16 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="lg:col-span-6">
          <h1
            className="text-balance text-[2.6rem] font-medium leading-[1.02] tracking-tight animate-enter sm:text-6xl xl:text-[4.6rem]"
            style={{ animationDelay: "80ms" }}
          >
            <Text value={"Votre entreprise. Notre créativité."} />
            <Text value={" "} />
            <span className="font-display italic text-clay">
              <Text value={"Une nouvelle dimension digitale."} />
            </span>
          </h1>
          <p
            className="mt-8 max-w-xl text-pretty text-lg text-muted-foreground animate-enter md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            <Text
              value={
                "Sites web, réseaux sociaux et identité digitale : nous transformons votre activité en une présence professionnelle, moderne et attractive. "
              }
            />
          </p>
          <div
            className="mt-10 flex flex-col gap-3 animate-enter xl:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/realisations"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary py-4 ps-7 pe-4 text-sm font-medium text-primary-foreground transition-all hover:gap-4 hover:bg-ink-soft"
            >
              <Text value={"Explorer nos réalisations "} />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-clay-foreground transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-7 py-4 text-base font-medium transition-colors hover:border-foreground hover:bg-card"
            >
              <Text value={"Discutons de votre projet "} />
            </Link>
          </div>
          <Link
            to="/demonstrations"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            <Text value={"Choisir mon secteur · Nos démonstrations "} />
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
            <div
              className="absolute left-0 top-[6%] w-[84%] animate-enter"
              style={{ animationDelay: "300ms" }}
            >
              <div className="animate-float">
                <LaptopFrame>
                  {s.hero_laptop_url ? (
                    <ScreenImage src={s.hero_laptop_url} alt={t("Aperçu d'un site web")} />
                  ) : (
                    <MockWebsite animated />
                  )}
                </LaptopFrame>
              </div>
            </div>
            <div
              className="absolute bottom-[2%] right-[2%] w-[27%] animate-enter"
              style={{ animationDelay: "480ms" }}
            >
              <div className="animate-float-delayed">
                <PhoneFrame>
                  {s.hero_phone_1_url ? (
                    <ScreenImage src={s.hero_phone_1_url} alt={t("Aperçu d'un profil Instagram")} />
                  ) : (
                    <MockInstagram />
                  )}
                </PhoneFrame>
              </div>
            </div>
            <div
              className="absolute bottom-[12%] right-[26%] w-[22%] animate-enter max-sm:hidden"
              style={{ animationDelay: "620ms" }}
            >
              <div className="animate-float">
                <PhoneFrame className="rotate-[-4deg]">
                  {s.hero_phone_2_url ? (
                    <ScreenImage
                      src={s.hero_phone_2_url}
                      alt={t("Aperçu d'une page professionnelle")}
                    />
                  ) : (
                    <MockFacebook />
                  )}
                </PhoneFrame>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x relative hidden justify-center pb-10 md:flex">
        <a
          href="#services"
          className="group flex flex-col items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="flex h-10 w-6 justify-center rounded-full border border-foreground/25 pt-2">
            <span className="h-2 w-1 rounded-full bg-clay animate-scroll-dot" />
          </span>
          <span className="flex items-center gap-1 transition-colors group-hover:text-foreground">
            <Text value={"Défiler "} />
            <ArrowDown className="h-3 w-3" />
          </span>
        </a>
      </div>

      <div className="border-y bg-card/50 py-5" aria-label={t("Secteurs accompagnés")}>
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pe-12">
            {[...SECTORS, ...SECTORS].map((x, i) => (
              <span
                key={i}
                className="flex items-center gap-12 whitespace-nowrap font-display text-2xl italic text-muted-foreground"
              >
                <Text value={x} />
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
