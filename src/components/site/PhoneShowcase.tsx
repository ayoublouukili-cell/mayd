import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Menu,
  MoveDown,
  Signal,
  Wifi,
  BatteryFull,
} from "lucide-react";
import type { PublicProject } from "@/lib/public-data.functions";
import { DEMOS } from "@/lib/demonstrations";
import { BRAND_UNIVERSES } from "@/lib/showroom-catalog";
import { phoneShowcaseFrame } from "@/lib/phone-showcase";
import { settingsQuery } from "@/lib/queries";
import { Text, useT } from "@/lib/i18n/Preferences";

type Slide = {
  id: string;
  title: string;
  category: string;
  headline: string;
  image: string;
  secondImage: string;
  accent: string;
  paper: string;
  ink: string;
  demo: boolean;
  slug: string;
  screenshot: boolean;
};

function PhoneScreen({ slide }: { slide: Slide }) {
  return (
    <div
      className="phone-showcase-screen-content"
      style={
        {
          "--screen-accent": slide.accent,
          "--screen-paper": slide.paper,
          "--screen-ink": slide.ink,
        } as CSSProperties
      }
    >
      <div className="phone-showcase-status">
        <span>9:41</span>
        <span>
          <Signal />
          <Wifi />
          <BatteryFull />
        </span>
      </div>
      {slide.screenshot ? (
        <img className="phone-showcase-screenshot" src={slide.image} alt="" loading="lazy" />
      ) : (
        <>
          <div className="phone-showcase-site-nav">
            <strong>{slide.title}</strong>
            <Menu />
          </div>
          <div className="phone-showcase-screen-hero">
            <img src={slide.image} alt="" loading="lazy" decoding="async" />
            <div>
              <span>
                <Text value={slide.category} />
              </span>
              <strong>
                <Text value={slide.headline} />
              </strong>
              <i>
                <Text value="Découvrir" />
                <ArrowUpRight />
              </i>
            </div>
          </div>
          <div className="phone-showcase-screen-editorial">
            <span>
              01 / <Text value="L'essentiel" />
            </span>
            <strong>
              <Text value="Une expérience à votre image." />
            </strong>
            <div>
              <img src={slide.secondImage} alt="" loading="lazy" decoding="async" />
              <p>
                <Text value="Chaque détail compte." />
                <ArrowUpRight />
              </p>
            </div>
          </div>
          <div className="phone-showcase-screen-bottom">
            <span>{slide.title}</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </>
      )}
      <div className="phone-showcase-home-indicator" />
    </div>
  );
}

export function PhoneShowcase({ projects }: { projects: PublicProject[] }) {
  const t = useT();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const section = useRef<HTMLElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [index, setIndex] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const slides = useMemo<Slide[]>(() => {
    const published = [...projects]
      .filter((p) => p.cover_url)
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        title: p.title,
        category: p.client_category || "Réalisation",
        headline: p.short_description || p.title,
        image: p.cover_url!,
        secondImage: p.cover_url!,
        accent: "#b39767",
        paper: "#f3f0e6",
        ink: "#20352d",
        demo: p.is_demo,
        slug: p.slug,
        screenshot: true,
      }));
    const concepts = ["immobilier", "restaurant", "gaming", "coiffure"].flatMap((theme) => {
      const demo = DEMOS.find((d) => d.theme === theme);
      if (!demo) return [];
      const palette = BRAND_UNIVERSES[theme]!.palette;
      return [
        {
          id: demo.slug,
          title: demo.name,
          category: demo.sector,
          headline: demo.headline,
          image: demo.images[0]!,
          secondImage: demo.images[2]!,
          accent: palette[0],
          paper: palette[1],
          ink: palette[2],
          demo: true,
          slug: demo.slug,
          screenshot: false,
        },
      ];
    });
    return [...published, ...concepts].slice(0, 4);
  }, [projects]);
  const slide = slides[Math.min(index, slides.length - 1)]!;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)");
    const change = () => setManualMode(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (manualMode) {
      phone.current?.style.setProperty("--phone-rotation", "0deg");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
      const next = phoneShowcaseFrame(progress, slides.length);
      phone.current?.style.setProperty("--phone-rotation", `${next.rotation}deg`);
      progressBar.current?.style.setProperty("transform", `scaleX(${progress})`);
      if (next.index !== currentIndex.current) {
        currentIndex.current = next.index;
        setIndex(next.index);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [manualMode, slides.length]);

  function goTo(next: number) {
    const bounded = Math.max(0, Math.min(slides.length - 1, next));
    if (manualMode || !section.current) {
      currentIndex.current = bounded;
      setIndex(bounded);
      phone.current?.style.setProperty("--phone-rotation", "0deg");
      return;
    }
    const rect = section.current.getBoundingClientRect();
    const top =
      window.scrollY +
      rect.top +
      ((rect.height - window.innerHeight) * bounded) / Math.max(1, slides.length - 1);
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      ref={section}
      id="projets-360"
      className="phone-showcase"
      aria-labelledby="phone-showcase-title"
      style={{ "--showcase-count": slides.length } as CSSProperties}
    >
      <div className="phone-showcase-sticky">
        <div className="phone-showcase-topline container-x">
          <span>
            <Text value="Un autre regard sur nos projets" />
          </span>
          <span>
            DESIGN IN MOTION <i /> 360°
          </span>
        </div>
        <div className="phone-showcase-layout container-x">
          <div className="phone-showcase-copy">
            <p className="eyebrow">
              <span /> <Text value="Explorez autrement" />
            </p>
            <h2 id="phone-showcase-title">
              <Text value="Un tour." />
              <br />
              <em>
                <Text value="Un nouvel univers." />
              </em>
            </h2>
            <p className="phone-showcase-description">
              <Text value="Faites défiler. Le téléphone tourne, les projets se révèlent. Une nouvelle perspective à chaque tour." />
            </p>
            <a
              href="#projets-360"
              className="phone-showcase-scroll"
              aria-label={t("Explorer les projets à 360 degrés")}
            >
              <span>
                <ArrowDown />
              </span>
              <Text value="Au fil du scroll" />
            </a>
          </div>
          <div className="phone-showcase-stage" aria-hidden="true">
            <span className="phone-showcase-giant">360</span>
            <div className="phone-showcase-orbit" />
            <div className="phone-showcase-shadow" />
            <div className="phone-showcase-perspective">
              <div ref={phone} className="phone-showcase-device">
                <div className="phone-showcase-front">
                  <div className="phone-showcase-glass">
                    <PhoneScreen slide={slide} />
                    <div className="phone-showcase-island">
                      <i />
                    </div>
                  </div>
                </div>
                <div className="phone-showcase-back">
                  <div className="phone-showcase-cameras">
                    <i />
                    <i />
                    <i />
                    <span />
                  </div>
                  <span className="phone-showcase-engraving">
                    {settings.brand_name}
                    <small>{settings.brand_suffix}</small>
                  </span>
                  <span className="phone-showcase-back-caption">DESIGNED TO STAND OUT</span>
                </div>
                <div className="phone-showcase-edge phone-showcase-edge-left">
                  <i />
                  <i />
                </div>
                <div className="phone-showcase-edge phone-showcase-edge-right">
                  <i />
                </div>
                <div className="phone-showcase-edge-top" />
                <div className="phone-showcase-edge-bottom" />
              </div>
            </div>
            <span className="phone-showcase-stage-label">
              <MoveDown /> SCROLL TO ROTATE
            </span>
          </div>
          <div className="phone-showcase-project">
            <div className="phone-showcase-project-counter">
              <span>{String(index + 1).padStart(2, "0")}</span> /{" "}
              {String(slides.length).padStart(2, "0")}
            </div>
            <div key={slide.id} className="phone-showcase-project-info">
              <span className="phone-showcase-project-kind">
                <Text value={slide.demo ? "Concept de démonstration" : "Projet publié"} />
              </span>
              <h3>{slide.title}</h3>
              <p>
                <Text value={slide.category} />
              </p>
              {slide.screenshot ? (
                <Link
                  to="/realisations/$slug"
                  params={{ slug: slide.slug }}
                  className="phone-showcase-project-link"
                >
                  <Text value="Découvrir le projet" />
                  <ArrowUpRight />
                </Link>
              ) : (
                <Link
                  to="/demonstrations/$sector"
                  params={{ sector: slide.slug }}
                  className="phone-showcase-project-link"
                >
                  <Text value="Explorer le concept" />
                  <ArrowUpRight />
                </Link>
              )}
            </div>
            <div className="phone-showcase-controls">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label={t("Projet précédent")}
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === slides.length - 1}
                aria-label={t("Projet suivant")}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="phone-showcase-bottom container-x">
          <div className="phone-showcase-dots" aria-label={t("Choisir un projet")}>
            {slides.map((item, i) => (
              <button
                type="button"
                key={item.id}
                onClick={() => goTo(i)}
                aria-label={`${t("Voir le projet")} ${item.title}`}
                aria-pressed={index === i}
              >
                <span />
                <span className="phone-showcase-dot-number">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <p>
            <Text value="La créativité, sous tous les angles." />
          </p>
          <span aria-hidden="true">{settings.brand_name}®</span>
        </div>
        <div className="phone-showcase-track" aria-hidden="true">
          <div ref={progressBar} />
        </div>
      </div>
    </section>
  );
}
