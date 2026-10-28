import { Text, useT, Count } from "@/lib/i18n/Preferences";
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Demo, DemoItem } from "@/lib/demonstrations";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { DemoGallery } from "./DemoGallery";
import { DemoForm } from "./DemoForm";
import { PreferenceControls } from "@/components/site/PreferenceControls";
import { WebsiteHero, RestaurantMenu } from "./SiteDirections";
import { Brand } from "@/components/site/Header";
import { ConceptMark } from "./ConceptCover";
import { BRAND_UNIVERSES } from "@/lib/showroom-catalog";
export function DemoCta() {
  return (
    <section className="demo-cta">
      <p className="eyebrow">
        <Text value={"Votre projet commence ici"} />
      </p>
      <h2>
        <Text value={"Et si votre entreprise était"} />
        <Text value={" "} />
        <span className="font-display italic text-clay">
          <Text value={"la prochaine ?"} />
        </span>
      </h2>
      <Link to="/contact" className="demo-primary">
        <Text value={"Demander un devis "} />
        <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
function Catalog({ demo, prefix }: { demo: Demo; prefix: string }) {
  const t = useT();
  const [type, setType] = useState("Tous");
  const [mode, setMode] = useState("Tous");
  const [selected, setSelected] = useState<DemoItem | null>(null);
  const [comparison, setComparison] = useState<string[]>([]);
  useEffect(() => {
    const choose = (event: Event) => {
      const detail = (event as CustomEvent<{ prefix: string; mode: string }>).detail;
      if (detail.prefix === prefix) setMode(detail.mode);
    };
    window.addEventListener("demo-catalog-mode", choose);
    return () => window.removeEventListener("demo-catalog-mode", choose);
  }, [prefix]);
  const list = demo.items.filter(
    (item) => (type === "Tous" || item.type === type) && (mode === "Tous" || item.mode === mode),
  );
  const isProperty = demo.theme === "immobilier" || demo.theme === "habitat";
  const itemKind = isProperty
    ? "catalog.project.type"
    : demo.theme === "voitures"
      ? "catalog.vehicle.type"
      : "catalog.product.type";
  const filterLabel = isProperty
    ? "catalog.property.filter"
    : demo.theme === "voitures"
      ? "catalog.vehicle.filter"
      : demo.slug === "demo-boutique-mode"
        ? "Collection"
        : "catalog.product.filter";
  return (
    <section id={`${prefix}-catalogue`} className="demo-section">
      <p className="demo-kicker">
        <Text value={"La sélection"} />
      </p>
      <h2>
        <Text value={demo.collection} />
      </h2>
      <p className="demo-smallprint">
        <Text
          value={
            "Catalogue fictif · Photos d’illustration · Prix illustratifs en dirhams marocains (MAD). "
          }
        />
      </p>
      <div className="demo-filters">
        <label>
          <Text value={"Type de "} />
          <Text value={itemKind} />
          <select
            aria-label={t("Filtrer par type")}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Tous">
              <Text value={"Tous les types"} />
            </option>
            {[...new Set(demo.items.map((i) => i.type))].map((t) => (
              <option key={t} value={t}>
                <Text value={t} />
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text value={filterLabel} />
          <select
            aria-label={t(
              isProperty
                ? "Filtrer achat ou location"
                : demo.theme === "boutique"
                  ? "catalog.product.filter-label"
                  : "Filtrer par transmission",
            )}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="Tous">
              <Text value={"Toutes les options"} />
            </option>
            {[...new Set(demo.items.map((i) => i.mode))].map((m) => (
              <option key={m} value={m}>
                <Text value={m} />
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="demo-outline"
          onClick={() => {
            setMode("Tous");
            setType("Tous");
          }}
        >
          <Text value={"Réinitialiser "} />
        </button>
      </div>
      <p role="status" className="demo-smallprint">
        <Count value={list.length} kind="results" />
      </p>
      <div className="demo-catalog">
        {list.map((item) => (
          <article key={item.title} className="demo-catalog-card">
            <button
              type="button"
              className="demo-catalog-image"
              onClick={() => setSelected(item)}
              aria-label={`${t("Découvrir la fiche")} : ${t(item.title)}`}
            >
              <img src={item.photo ?? demo.images[item.image]} alt={t(item.title)} loading="lazy" />
              <span>
                <Text value={item.mode} />
              </span>
            </button>
            <div className="demo-catalog-copy">
              <p className="demo-kicker">
                <Text value={item.type} />
              </p>
              {demo.theme === "voitures" && (
                <button
                  type="button"
                  className="compare-toggle"
                  aria-pressed={comparison.includes(item.title)}
                  onClick={() =>
                    setComparison((current) =>
                      current.includes(item.title)
                        ? current.filter((v) => v !== item.title)
                        : [...current.slice(-1), item.title],
                    )
                  }
                >
                  <Text
                    value={
                      comparison.includes(item.title) ? "Retirer de la comparaison" : "Comparer"
                    }
                  />
                </button>
              )}
              <h3>
                <Text value={item.title} />
              </h3>
              <p className="demo-price">
                <Text value={item.price} />
              </p>
              <p>
                {item.features.map((feature, index) => (
                  <span key={feature}>
                    {index > 0 && " · "}
                    <Text value={feature} />
                  </span>
                ))}
              </p>
              <button type="button" className="demo-outline" onClick={() => setSelected(item)}>
                <Text value={"Découvrir la fiche "} />
                <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {demo.theme === "voitures" && comparison.length > 0 && (
        <div className="vehicle-comparison" aria-live="polite">
          <h3>
            <Text value="Comparaison de véhicules" />
          </h3>
          <div>
            {comparison.map((title) => {
              const item = demo.items.find((i) => i.title === title)!;
              return (
                <article key={title}>
                  <img src={item.photo ?? demo.images[item.image]} alt={t(item.title)} />
                  <h4>
                    <Text value={title} />
                  </h4>
                  <p>
                    <Text value={item.price} />
                  </p>
                  <p>
                    <Text value={item.mode} />
                  </p>
                  {item.features.map((f) => (
                    <p key={f}>
                      <Text value={f} />
                    </p>
                  ))}
                </article>
              );
            })}
          </div>
        </div>
      )}
      {list.length === 0 && (
        <div className="demo-empty">
          <Text value={"Aucun exemple pour ces filtres. Essayez une autre combinaison. "} />
        </div>
      )}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-auto rounded-2xl sm:max-w-2xl">
          <DialogTitle>
            <Text value={selected?.title} />
          </DialogTitle>
          <DialogDescription>
            <Text
              value={
                demo.theme === "boutique"
                  ? "catalog.product.dialog"
                  : "Bien ou véhicule fictif · Concept de démonstration"
              }
            />
          </DialogDescription>
          {selected && (
            <>
              <img
                className="aspect-video w-full rounded-xl object-cover"
                src={selected.photo ?? demo.images[selected.image]}
                alt={t(selected.title)}
              />
              <p>
                <Text value={selected.details} />
              </p>
              <p className="font-semibold">
                <Text value={selected.price} />
                <Text value={"· Tarif illustratif"} />
              </p>
              <ul className="flex flex-wrap gap-2">
                {selected.features.map((f) => (
                  <li key={f} className="rounded-full bg-beige px-3 py-1 text-sm">
                    <Text value={f} />
                  </li>
                ))}
              </ul>
              <DialogClose asChild>
                <a className="demo-primary" href={`#${prefix}-reservation`}>
                  <Text value={demo.action} />
                </a>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
export function DemoWebsite({ demo, full = false }: { demo: Demo; full?: boolean }) {
  const t = useT();
  const prefix = full ? "site" : "apercu";
  const services = (
    <section id={`${prefix}-services`} className="demo-section">
      <p className="demo-kicker">
        <Text value={demo.theme === "gaming" ? "Jouez à votre rythme" : "Pensé pour vous"} />
      </p>
      <h2>
        <Text
          value={
            demo.items.length ? "Un parcours simple, une expérience soignée." : demo.collection
          }
        />
      </h2>
      <div className="demo-services">
        {demo.services.map((s, i) => (
          <article key={s.name}>
            <span className="demo-service-number">
              <Text value={"0"} />
              <Text value={i + 1} />
            </span>
            <h3>
              <Text value={s.name} />
            </h3>
            <p>
              <Text value={s.text} />
            </p>
            <p className="demo-price">
              <Text value={s.price} />
            </p>
            <a href={`#${prefix}-reservation`}>
              <Text value={"Essayer ce parcours →"} />
            </a>
          </article>
        ))}
      </div>
      <p className="demo-smallprint">
        <Text value={"Tous les tarifs sont illustratifs. Aucune offre réelle n’est proposée. "} />
      </p>
    </section>
  );
  const events = demo.events.length > 0 && (
    <section className="demo-section">
      <p className="demo-kicker">
        <Text value={"Au-delà de la partie"} />
      </p>
      <h2>
        <Text value={"La communauté au centre du jeu."} />
      </h2>
      <div className="demo-events">
        {demo.events.map((e, i) => (
          <article key={e.title}>
            <img src={demo.images[i + 2]} alt={t(e.title)} loading="lazy" />
            <div>
              <span>
                <Text value={"Événement fictif · Programme conceptuel"} />
              </span>
              <h3>
                <Text value={e.title} />
              </h3>
              <p>
                <Text value={e.text} />
              </p>
              <a className="demo-outline" href={`#${prefix}-reservation`}>
                <Text value={"Simuler ma participation → "} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
  const gallery = (
    <section id={`${prefix}-galerie`} className="demo-section">
      <p className="demo-kicker">
        <Text value={"L’univers en images"} />
      </p>
      <h2>
        <Text
          value={
            demo.theme === "coiffure"
              ? "Le détail fait la différence."
              : "Entrez dans l’expérience."
          }
        />
      </h2>
      <p className="demo-smallprint">
        <Text value={"Photographies d’illustration. Cliquez sur une image pour l’agrandir. "} />
      </p>
      <DemoGallery images={demo.images} captions={demo.captions} />
    </section>
  );
  const form = <DemoForm demo={demo} prefix={prefix} />;
  return (
    <>
      {full && (
        <div className="demo-return">
          <PreferenceControls />
          <Link to="/demonstrations/$sector" params={{ sector: demo.slug }}>
            <ArrowLeft size={16} />
            <Text value={"Retour à la démonstration "} />
          </Link>
          <div className="rounded-xl bg-paper px-3 py-1 text-ink">
            <Brand />
          </div>
          <span>
            <Text value={"Concept de démonstration · Entreprise fictive"} />
          </span>
        </div>
      )}
      <div
        className={`demo-website demo-${demo.theme}`}
        style={
          {
            "--brand-1": BRAND_UNIVERSES[demo.theme]?.palette[0],
            "--brand-2": BRAND_UNIVERSES[demo.theme]?.palette[1],
            "--brand-3": BRAND_UNIVERSES[demo.theme]?.palette[2],
          } as CSSProperties
        }
      >
        <nav className="demo-site-nav" aria-label={t(`Navigation du site ${demo.name}`)}>
          <a className="demo-site-brand" href={`#${prefix}-accueil`}>
            <ConceptMark demo={demo} />
            <Text value={demo.name} />
            <span>
              <Text value={"Concept"} />
            </span>
          </a>
          <div>
            <a
              href={`#${prefix}-${demo.theme === "restaurant" ? "carte" : demo.items.length ? "catalogue" : "services"}`}
            >
              <Text
                value={
                  demo.theme === "restaurant"
                    ? "La carte"
                    : demo.theme === "gaming"
                      ? "Forfaits"
                      : demo.items.length
                        ? "Catalogue"
                        : "Prestations"
                }
              />
            </a>
            <a href={`#${prefix}-galerie`}>
              <Text value={"Galerie"} />
            </a>
            <a className="demo-primary" href={`#${prefix}-reservation`}>
              <Text
                value={
                  demo.theme === "boutique"
                    ? "catalog.product.action"
                    : demo.theme === "habitat"
                      ? "Visiter"
                      : "Réserver"
                }
              />
            </a>
          </div>
        </nav>
        <WebsiteHero demo={demo} prefix={prefix} />
        <div className="demo-site-content">
          {demo.theme === "habitat" ? (
            <>
              <Catalog demo={demo} prefix={prefix} />
              <div className="property-story">
                {services}
                {gallery}
              </div>
              {form}
            </>
          ) : demo.theme === "boutique" ? (
            <>
              <Catalog demo={demo} prefix={prefix} />
              <div className="botanical-services">{services}</div>
              {gallery}
              {form}
            </>
          ) : demo.theme === "azahar" ? (
            <>
              <RestaurantMenu demo={demo} prefix={prefix} />
              {events}
              {gallery}
              {services}
              {form}
            </>
          ) : demo.theme === "cadence" ? (
            <>
              {services}
              {events}
              {gallery}
              {form}
            </>
          ) : demo.theme === "arcade" ? (
            <>
              {events}
              {services}
              {gallery}
              {form}
            </>
          ) : demo.theme === "immobilier" ? (
            <>
              <Catalog demo={demo} prefix={prefix} />
              <div className="property-story">
                {services}
                {gallery}
              </div>
              {form}
            </>
          ) : demo.theme === "gaming" ? (
            <>
              {events}
              {services}
              {gallery}
              {form}
            </>
          ) : demo.theme === "coiffure" ? (
            <>
              {gallery}
              <div className="salon-ritual">
                {services}
                {form}
              </div>
            </>
          ) : demo.theme === "voitures" ? (
            <>
              <Catalog demo={demo} prefix={prefix} />
              {services}
              {gallery}
              {form}
            </>
          ) : demo.theme === "restaurant" ? (
            <>
              <RestaurantMenu demo={demo} prefix={prefix} />
              {gallery}
              {services}
              {form}
            </>
          ) : (
            <>
              {services}
              {gallery}
              {form}
            </>
          )}
        </div>
        <footer className="demo-site-footer">
          <strong>
            <Text value={demo.name} />
          </strong>
          <span>
            <Text value={"Entreprise fictive · Concept de démonstration par MAYD DIGITAL"} />
          </span>
          <a href={`#${prefix}-accueil`}>
            <Text value={"Retour en haut ↑"} />
          </a>
        </footer>
      </div>
      {full && <DemoCta />}
    </>
  );
}
