import { Text, useT } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe, Instagram, Facebook } from "lucide-react";
import { DEMOS } from "@/lib/demonstrations";
export function ShowroomSection({ page = false }: { page?: boolean }) {
  const t = useT();
  const Heading = page ? "h1" : "h2";
  return (
    <section id="demonstrations" className="showroom-section scroll-mt-24">
      <div className="container-x">
        <div className="showroom-intro">
          <p className="eyebrow !text-[#c8b17c]">
            <Text value={"Nos démonstrations · Choisissez votre univers"} />
          </p>
          <Heading className="mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.07] tracking-tight md:text-6xl">
            <Text value={"Imaginez votre entreprise"} />
            <Text value={" "} />
            <span className="font-display italic text-[#c8b17c]">
              <Text value={"en digital."} />
            </span>
          </Heading>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            <Text
              value={
                "Explorez nos concepts de sites web et de pages professionnelles sur Instagram, Facebook et TikTok. "
              }
            />
          </p>
          <p className="mt-4 text-sm text-white/55">
            <Text
              value={
                "Onze marques fictives, onze identités. Aucun de ces concepts ne représente un client réel."
              }
            />
          </p>
        </div>
        <div className="showroom-cards">
          {DEMOS.map((demo, i) => (
            <Link
              key={demo.slug}
              to="/demonstrations/$sector"
              params={{ sector: demo.slug }}
              className={`showroom-card demo-${demo.theme}`}
            >
              <img
                src={demo.images[0]}
                alt={t(`${demo.sector} : univers ${demo.name}`)}
                loading="lazy"
              />
              <span className="showroom-card-overlay" />
              <div className="showroom-card-top">
                <span className="concept-badge">
                  <Text value={"Concept de démonstration"} />
                </span>
                <span className="text-sm text-white/70">
                  <Text value={"0"} />
                  <Text value={i + 1} />
                </span>
              </div>
              <div className="showroom-card-copy">
                <p className="text-sm text-white/75">
                  <Text value={demo.sector} />
                </p>
                <h3>
                  <Text value={demo.name} />
                </h3>
                <div className="showroom-platforms">
                  <span>
                    <Instagram size={13} />
                    <Text value={"Instagram "} />
                  </span>
                  <span>
                    <Facebook size={13} />
                    <Text value={"Facebook "} />
                  </span>
                  <span>
                    <Text value={"♪ TikTok"} />
                  </span>
                  <span>
                    <Globe size={13} />
                    <Text value={"Site web "} />
                  </span>
                </div>
                <span className="showroom-explore">
                  <Text value={"Explorer la démonstration "} />
                  <ArrowUpRight size={22} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
