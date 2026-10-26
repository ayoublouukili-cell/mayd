import { Text } from "@/lib/i18n/Preferences";
import { BadgeCheck, Eye, Layers, Puzzle, MessagesSquare } from "lucide-react";
import { Reveal } from "./Reveal";
const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Une image professionnelle",
    text: "Une présentation soignée qui inspire confiance dès le premier regard.",
  },
  {
    icon: Eye,
    title: "Une meilleure visibilité en ligne",
    text: "Être présent là où vos futurs clients vous cherchent : Google et les réseaux sociaux.",
  },
  {
    icon: Layers,
    title: "Une identité digitale cohérente",
    text: "Les mêmes couleurs, le même ton et le même style sur chaque plateforme.",
  },
  {
    icon: Puzzle,
    title: "Des solutions adaptées à chaque activité",
    text: "Un restaurant, un salon ou une boutique n'ont pas les mêmes besoins. Nous nous adaptons au vôtre.",
  },
  {
    icon: MessagesSquare,
    title: "Un contact plus simple avec les clients",
    text: "Appel, message, itinéraire ou réservation : vos clients vous joignent en un geste.",
  },
];
export function WhySection() {
  return (
    <section className="bg-ink py-24 text-paper md:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-3 !text-paper/50">
            <span className="h-px w-8 bg-clay" />
            <Text value={"Pourquoi nous "} />
          </p>
          <h2 className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            <Text value={"Une présence digitale qui "} />
            <span className="font-display italic text-clay">
              <Text value={"fait la différence."} />
            </span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-paper/60">
            <Text
              value={
                "Pas de promesses chiffrées : un travail soigné, pensé pour votre activité et vos clients. "
              }
            />
          </p>
        </Reveal>
        <div className="lg:col-span-7">
          <ul className="divide-y divide-paper/10 border-y border-paper/10">
            {BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 80}>
                <div className="group flex gap-6 py-7 transition-colors md:gap-10">
                  <span className="mt-1 font-display text-xl italic text-paper/30">
                    <Text value={"0"} />
                    <Text value={i + 1} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium md:text-2xl">
                      <Text value={b.title} />
                    </h3>
                    <p className="mt-2 text-paper/60">
                      <Text value={b.text} />
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-all duration-500 group-hover:rotate-12 group-hover:border-clay group-hover:bg-clay group-hover:text-clay-foreground">
                    <b.icon className="h-5 w-5" />
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
