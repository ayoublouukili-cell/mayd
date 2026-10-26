import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { Reveal } from "./Reveal";
import { OfficialLogo } from "./OfficialLogo";
export function AboutSection({ showLink = true }: { showLink?: boolean }) {
  const t = useT();
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <section className="py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <div>
            <div
              className={`relative overflow-hidden rounded-[2rem] ${s.portrait_url ? "aspect-[4/5] bg-beige" : ""}`}
            >
              <img
                src={s.portrait_url ?? "/images/mayd-team.png"}
                alt={
                  s.portrait_url
                    ? t(`Portrait de ${s.owner_name}`)
                    : t("Deux personnes dans un bureau MAYD DIGITAL")
                }
                loading="lazy"
                className={`block w-full ${s.portrait_url ? "h-full object-cover" : "h-auto"}`}
              />
            </div>
            <div className="mt-4 ml-auto w-fit rounded-2xl bg-card px-6 py-4 shadow-lift">
              <p className="font-display text-2xl italic sm:text-3xl">
                <Text value={"Mehdi et Ayoub"} />
              </p>
              <p className="text-sm text-muted-foreground">
                <Text value={"Fondateurs de "} />
                <Text value={s.brand_name} /> <Text value={s.brand_suffix} />
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <div className="mb-6">
            <OfficialLogo name={`${s.brand_name} ${s.brand_suffix}`} className="!w-52" themeAware />
          </div>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-clay" />
            <Text value={"À propos "} />
          </p>
          <h2 className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            <Text value={"Derrière chaque projet, "} />
            <span className="font-display italic">
              <Text value={"une vision."} />
            </span>
          </h2>
          <div className="mt-8 space-y-5 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            <p>
              <span className="text-foreground">
                <Text value={s.brand_name} /> <Text value={s.brand_suffix} />
                <Text value={" est un studio de création digitale fondé par Mehdi et Ayoub. "} />
              </span>
              <Text value={" "} />
              <Text
                value={
                  "Nous accompagnons les entreprises dans la création de sites web modernes et le développement de leur présence professionnelle sur Instagram, Facebook et TikTok. "
                }
              />
            </p>
            <p>
              <Text
                value={
                  "Notre objectif : transformer leurs idées en réalisations digitales concrètes, modernes et adaptées à leur activité. "
                }
              />
            </p>
          </div>
          {showLink && (
            <Link
              to="/a-propos"
              className="group mt-10 inline-flex items-center gap-2 border-b border-foreground/20 pb-1 font-medium transition-colors hover:border-clay hover:text-clay"
            >
              <Text value={"En savoir plus sur nous "} />
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
