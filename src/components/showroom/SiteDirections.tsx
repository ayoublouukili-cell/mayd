import { Text, useT } from "@/lib/i18n/Preferences";
import type { Demo } from "@/lib/demonstrations";

export function WebsiteHero({ demo, prefix }: { demo: Demo; prefix: string }) {
  const t = useT();
  const picture = (i: number, className = "") => (
    <img
      className={className}
      src={demo.images[i]}
      alt={t(demo.captions[i])}
      fetchPriority={i === 0 ? "high" : "auto"}
    />
  );
  const headline = (
    <>
      <p className="demo-kicker">
        <Text value={demo.sector} />
      </p>
      <h1>
        <Text value={demo.headline} />
      </h1>
      <p className="direction-intro">
        <Text value={demo.intro} />
      </p>
    </>
  );
  const action = (target: string, label: string) => (
    <a className="demo-primary" href={`#${prefix}-${target}`}>
      <Text value={label} />
      <span className="direction-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
  const link = (label: string, mode: string) => (
    <a
      href={`#${prefix}-catalogue`}
      className="property-search-choice"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("demo-catalog-mode", { detail: { prefix, mode } }))
      }
    >
      <Text value={label} />
      <span className="direction-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
  if (demo.theme === "habitat")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero habitat-hero">
        <div className="habitat-copy">
          {headline}
          <div className="habitat-actions">
            {link("Acheter", "Achat")}
            {link("Louer", "Location")}
          </div>
          <span className="habitat-index">
            <Text value="concept.habitat.index" />
          </span>
        </div>
        <div className="habitat-visual">
          {picture(0)}
          <span>
            <Text value={demo.name} />
          </span>
          <div>
            <strong>
              <Text value={demo.items[0]?.price ?? demo.sector} />
            </strong>
            {picture(1)}
          </div>
        </div>
      </section>
    );
  if (demo.theme === "arcade")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero arcade-hero">
        <div className="arcade-topline">
          <span>{demo.handle}</span>
          <span>
            <Text value={demo.name} /> / <Text value={demo.sector} />
          </span>
        </div>
        <div className="arcade-copy">
          {headline}
          {action("services", "Choisir une session")}
        </div>
        <div className="arcade-screen">
          {picture(0)}
          <span className="arcade-screen-tag">
            {demo.initials} / <Text value="concept.arcade.play" />
          </span>
          <div>
            <strong>
              <Text value={demo.services[0]!.name} />
            </strong>
            <span>
              <Text value={demo.services[0]!.price} />
            </span>
          </div>
        </div>
        <div className="arcade-score">
          <span>01</span>
          <Text value={demo.events[0]!.title} />
          <span>↗</span>
        </div>
      </section>
    );
  if (demo.theme === "boutique")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero botanical-hero">
        <div className="botanical-copy">
          <span className="botanical-overline">
            <Text value={demo.name} /> · <Text value={demo.sector} />
          </span>
          {headline}
          {action("catalogue", "Explorer les rituels")}
          <p className="botanical-note">
            <Text value={demo.services[0]!.text} />
          </p>
        </div>
        <div className="botanical-visual">
          {picture(0)}
          <div>
            {picture(2)}
            <strong>
              <Text value={demo.items[0]!.title} />
            </strong>
            <span>
              <Text value={demo.items[0]!.price} />
            </span>
          </div>
        </div>
        <span className="botanical-seal">{demo.initials}</span>
      </section>
    );
  if (demo.theme === "azahar")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero azahar-hero">
        <div className="azahar-heading">
          <span className="azahar-rule">
            <Text value="concept.azahar.name" />
          </span>
          {headline}
          {action("carte", "Composer votre moment")}
        </div>
        <div className="azahar-table">
          {picture(0)}
          <span>
            <Text value="concept.azahar.index" />
          </span>
          {picture(1)}
        </div>
        <p className="azahar-foot">
          <Text value={demo.services[0]!.text} />
        </p>
      </section>
    );
  if (demo.theme === "cadence")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero cadence-hero">
        <div className="cadence-number" aria-hidden="true">
          01
        </div>
        <div className="cadence-copy">
          {headline}
          {action("services", "Trouver mon rythme")}
          <div className="cadence-tags">
            {demo.stories.slice(1, 4).map((story) => (
              <span key={story}>
                <Text value={story} />
              </span>
            ))}
          </div>
        </div>
        <div className="cadence-visual">
          {picture(0)}
          <span>
            <Text value={demo.events[0]!.title} />
          </span>
        </div>
      </section>
    );
  if (demo.theme === "immobilier")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero property-hero">
        <div className="property-heading">
          {headline}
          <div className="property-search">
            <p>
              <Text value="Votre prochaine adresse" />
            </p>
            {link("Acheter", "Achat")}
            {link("Louer", "Location")}
          </div>
        </div>
        <div className="property-visual">
          {picture(0)}
          <span>
            Horizon Immobilier · <Text value="Espaces à vivre" />
          </span>
        </div>
        <div className="property-editorial">
          <span>01 / 04</span>
          <p>
            <Text value="L’architecture au service de vos envies." />
          </p>
        </div>
      </section>
    );
  if (demo.theme === "gaming")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero gaming-hero">
        <div className="gaming-grid" aria-hidden="true" />
        <div className="gaming-heading">
          <span className="gaming-label">
            NEXPLAY / <Text value="Entrez dans la partie" />
          </span>
          {headline}
          {action("services", "Choisir mon forfait")}
        </div>
        <div className="gaming-visual">
          {picture(0)}
          <span>
            <Text value="Ordinateurs" /> / <Text value="Consoles de jeux" />
          </span>
          <div>
            {picture(2)}
            <strong>
              <Text value="Le collectif avant tout." />
            </strong>
          </div>
        </div>
        <div className="gaming-ticker">
          <span>
            <Text value="Ordinateurs" />
          </span>
          <span>
            <Text value="Consoles de jeux" />
          </span>
          <span>
            <Text value="Événements" />
          </span>
          <span>
            <Text value="Communauté" />
          </span>
        </div>
      </section>
    );
  if (demo.theme === "coiffure")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero salon-hero">
        <div className="salon-vertical" aria-hidden="true">
          ÉCLAT / STUDIO
        </div>
        <div className="salon-heading">
          {headline}
          {action("reservation", "Prendre un moment pour soi")}
        </div>
        <div className="salon-large">{picture(0)}</div>
        <div className="salon-small">
          {picture(4)}
          <span>
            <Text value="Le geste. La matière. Vous." />
          </span>
        </div>
      </section>
    );
  if (demo.theme === "voitures")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero drive-hero">
        <div className="drive-heading">
          <p className="demo-kicker">
            Atlas Drive / <Text value="Collection de véhicules" />
          </p>
          <h1>
            <Text value={demo.headline} />
          </h1>
          <p className="direction-intro">
            <Text value={demo.intro} />
          </p>
          {action("catalogue", "Trouver mon véhicule")}
        </div>
        <div className="drive-visual">
          {picture(0)}
          <span>
            <Text value="Le voyage commence ici." />
          </span>
        </div>
        <div className="drive-quick">
          <a href={`#${prefix}-catalogue`}>
            <Text value="Comparer les véhicules" />{" "}
            <span className="direction-arrow" aria-hidden="true">
              ↘
            </span>
          </a>
          <a href={`#${prefix}-reservation`}>
            <Text value="Choisir mes dates" />{" "}
            <span className="direction-arrow" aria-hidden="true">
              ↘
            </span>
          </a>
        </div>
      </section>
    );
  if (demo.theme === "restaurant")
    return (
      <section id={`${prefix}-accueil`} className="direction-hero table-hero">
        <div className="table-heading">
          <span className="table-star" aria-hidden="true">
            ✳
          </span>
          {headline}
          {action("carte", "Découvrir la carte")}
        </div>
        <div className="table-visual">
          {picture(0)}
          <div>
            {picture(1)}
            <span>
              <Text value="De saison, avec passion." />
            </span>
          </div>
        </div>
        <a className="table-reserve" href={`#${prefix}-reservation`}>
          <Text value="À votre table" />{" "}
          <span className="direction-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </section>
    );
  return (
    <section id={`${prefix}-accueil`} className="direction-hero club-hero">
      {picture(0)}
      <div>
        {headline}
        {action("services", "Découvrir notre univers")}
      </div>
    </section>
  );
}

const MENU = [
  {
    name: "Légumes rôtis, crème citronnée",
    description: "Légumes de saison, herbes fraîches et une touche d’agrumes.",
    price: "65 MAD",
    image: 2,
  },
  {
    name: "La table du marché",
    description: "Une assiette généreuse, inspirée des produits du jour.",
    price: "140 MAD",
    image: 1,
  },
  {
    name: "Douceur au safran",
    description: "Une note délicate pour terminer le repas en douceur.",
    price: "55 MAD",
    image: 3,
  },
];
export function RestaurantMenu({ demo, prefix }: { demo: Demo; prefix: string }) {
  const t = useT();
  return (
    <section id={`${prefix}-carte`} className="restaurant-menu demo-section">
      <div>
        <p className="demo-kicker">
          <Text value="La carte de saison" />
        </p>
        <h2>
          <Text value="Des saveurs. Des rencontres." />
        </h2>
        <p className="demo-smallprint">
          <Text value="Plats et prix illustratifs · Photographies d’ambiance." />
        </p>
      </div>
      <div>
        {MENU.map((dish, i) => (
          <article key={dish.name}>
            <span>0{i + 1}</span>
            <img src={demo.images[dish.image]} alt={t(dish.name)} loading="lazy" />
            <div>
              <h3>
                <Text value={dish.name} />
              </h3>
              <p>
                <Text value={dish.description} />
              </p>
            </div>
            <strong>
              <Text value={dish.price} />
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}
