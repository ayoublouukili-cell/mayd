import { Text, useT } from "@/lib/i18n/Preferences";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SiteLayout";
const STEPS = [
  {
    num: "01",
    title: "Échange",
    text: "Nous discutons de votre activité, de vos besoins et de vos objectifs.",
  },
  {
    num: "02",
    title: "Proposition",
    text: "Nous vous proposons une solution digitale adaptée à votre projet.",
  },
  {
    num: "03",
    title: "Création",
    text: "Nous concevons votre présence digitale avec une attention particulière aux détails.",
  },
  {
    num: "04",
    title: "Mise en ligne",
    text: "Votre projet prend vie sur le web et les plateformes adaptées à votre activité.",
  },
];
export function ProcessSection() {
  const t = useT();
  const [active, setActive] = useState(0);
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={t("Méthode")}
            title={
              <>
                <Text value={"Une méthode simple, "} />
                <span className="font-display italic">
                  <Text value={"en quatre étapes."} />
                </span>
              </>
            }
          />
        </Reveal>

        <Reveal className="mt-16">
          <div className="relative hidden md:block" aria-hidden>
            <div className="absolute left-0 right-0 top-[11px] h-px bg-border" />
            <div
              className="absolute left-0 top-[11px] h-px bg-clay transition-all duration-700"
              style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <ol className="grid gap-4 md:grid-cols-4 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.num}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={active === i ? "step" : undefined}
                  className="group w-full text-left"
                >
                  <span
                    className={cn(
                      "relative z-10 hidden h-6 w-6 items-center justify-center rounded-full border-2 bg-background transition-all duration-500 md:flex",
                      i <= active ? "border-clay" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        i <= active ? "bg-clay" : "bg-transparent",
                      )}
                    />
                  </span>
                  <div
                    className={cn(
                      "mt-0 rounded-3xl border p-7 transition-all duration-500 md:mt-8",
                      active === i
                        ? "border-foreground bg-primary text-primary-foreground shadow-lift"
                        : "bg-card",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-5xl italic",
                        active === i ? "text-clay" : "text-foreground/20",
                      )}
                    >
                      <Text value={s.num} />
                    </span>
                    <h3 className="mt-6 text-2xl font-medium">
                      <Text value={s.title} />
                    </h3>
                    <p
                      className={cn(
                        "mt-3",
                        active === i ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      <Text value={s.text} />
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
