import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { LaptopFrame, PhoneFrame } from "./devices";
import { MockFacebook, MockInstagram, MockTikTok, MockWebsite } from "./screens";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SiteLayout";
export const SERVICES: {
  id: string;
  num: string;
  title: string;
  description: string;
  visual: () => ReactNode;
  includes: string[];
}[] = [
  {
    id: "sites-web",
    num: "01",
    title: "Création de sites web",
    description:
      "Un site web moderne et professionnel conçu pour présenter votre activité, valoriser vos services et faciliter la prise de contact.",
    visual: () => (
      <LaptopFrame className="mx-auto w-[88%]">
        <MockWebsite animated />
      </LaptopFrame>
    ),
    includes: [
      "Design sur mesure, adapté à votre image",
      "Consultation parfaite sur mobile, tablette et ordinateur",
      "Présentation de vos services, horaires et coordonnées",
      "Boutons de contact, d'appel et d'itinéraire",
      "Bases du référencement naturel",
    ],
  },
  {
    id: "instagram",
    num: "02",
    title: "Instagram professionnel",
    description:
      "Un profil Instagram soigné qui reflète l'identité de votre entreprise et met en valeur vos produits et services.",
    visual: () => (
      <PhoneFrame className="mx-auto w-[46%]">
        <MockInstagram />
      </PhoneFrame>
    ),
    includes: [
      "Création ou reprise du compte professionnel",
      "Photo de profil, biographie et lien optimisés",
      "Highlights (stories à la une) cohérents",
      "Ligne graphique pour vos publications",
      "Boutons de contact configurés",
    ],
  },
  {
    id: "facebook",
    num: "03",
    title: "Facebook professionnel",
    description:
      "Une page Facebook complète et professionnelle pour renforcer votre visibilité et faciliter les échanges avec vos clients.",
    visual: () => (
      <PhoneFrame className="mx-auto w-[46%]">
        <MockFacebook />
      </PhoneFrame>
    ),
    includes: [
      "Création de la page et des informations clés",
      "Photo de couverture et visuels à votre image",
      "Bouton d'action : réserver, appeler, envoyer un message",
      "Sections services, horaires et localisation",
      "Premières publications de présentation",
    ],
  },
  {
    id: "tiktok",
    num: "04",
    title: "TikTok professionnel",
    description:
      "Une présence TikTok adaptée à votre activité pour présenter votre univers et renforcer votre visibilité digitale.",
    visual: () => (
      <PhoneFrame className="mx-auto w-[46%]">
        <MockTikTok />
      </PhoneFrame>
    ),
    includes: [
      "Création du compte professionnel",
      "Profil, biographie et lien configurés",
      "Identité visuelle des couvertures de vidéos",
      "Idées de formats adaptées à votre activité",
      "Conseils de publication",
    ],
  },
];
export function ServicesSection() {
  const t = useT();
  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={t("Services")}
            title={
              <>
                <Text value={"Votre présence digitale, "} />
                <span className="font-display italic">
                  <Text value={"de A à Z."} />
                </span>
              </>
            }
            subtitle={t(
              "Des solutions adaptées pour valoriser votre activité et faciliter votre découverte par de nouveaux clients.",
            )}
          />
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={(i % 2) * 120}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div
                  className={`relative flex aspect-[4/3] justify-center overflow-hidden bg-gradient-to-br from-sand to-beige ${svc.id === "sites-web" ? "items-center p-8" : "items-start px-8 pt-12"}`}
                >
                  <span className="absolute left-6 top-5 font-display text-6xl italic text-foreground/10">
                    <Text value={svc.num} />
                  </span>
                  <div className="w-full transition-transform duration-700 group-hover:scale-[1.03]">
                    <Text value={svc.visual()} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-9">
                  <p className="text-sm text-clay">
                    <Text value={"Service "} />
                    <Text value={svc.num} />
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
                    <Text value={svc.title} />
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    <Text value={svc.description} />
                  </p>
                  <Link
                    to="/services"
                    hash={svc.id}
                    className="mt-8 inline-flex w-fit items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-medium transition-colors hover:border-clay hover:text-clay"
                  >
                    <Text value={"En savoir plus "} />
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
