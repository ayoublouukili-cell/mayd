import { useState, type CSSProperties } from "react";
import { Text, useT } from "@/lib/i18n/Preferences";
import type { Demo } from "@/lib/demonstrations";
import { BRAND_UNIVERSES } from "@/lib/showroom-catalog";
import { ConceptMark } from "./ConceptCover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function BrandExperience({ demo }: { demo: Demo }) {
  const t = useT(),
    brand = BRAND_UNIVERSES[demo.theme]!;
  const [application, setApplication] = useState<number | null>(null);
  const applications = [
    "Carte de visite",
    demo.theme === "restaurant"
      ? "Packaging"
      : demo.theme === "gaming"
        ? "Pass membre"
        : "Enseigne",
    "Publication de marque",
  ];
  const style = {
    "--brand-1": brand.palette[0],
    "--brand-2": brand.palette[1],
    "--brand-3": brand.palette[2],
  } as CSSProperties;
  function Artwork({ index }: { index: number }) {
    return (
      <div className={`brand-application application-${index} theme-${demo.theme}`}>
        {index === 2 && <img src={demo.images[4]} alt="" />}
        <div>
          <ConceptMark demo={demo} />
          <strong>
            <Text value={demo.name} />
          </strong>
          <span>
            <Text value={index === 2 ? demo.headline : demo.sector} />
          </span>
        </div>
        <span className="application-motif" aria-hidden="true">
          <ConceptMark demo={demo} />
        </span>
        <small>
          <Text value="Concept de démonstration" />
        </small>
      </div>
    );
  }
  return (
    <section className={`brand-experience demo-${demo.theme}`} style={style}>
      <div className="brand-intro">
        <p className="eyebrow">
          <Text value="Identité visuelle" />
        </p>
        <h2>
          <Text value={demo.name} />
        </h2>
        <p>
          <Text value={brand.direction} />
        </p>
      </div>
      <div className="brand-system">
        <div className="brand-signature">
          <ConceptMark demo={demo} />
          <strong>
            <Text value={demo.name} />
          </strong>
          <span>
            <Text value="Signature conceptuelle" />
          </span>
        </div>
        <div className="brand-specs">
          <h3>
            <Text value="Palette de marque" />
          </h3>
          <div className="brand-palette">
            {brand.palette.map((color) => (
              <div key={color}>
                <i style={{ background: color }} />
                <code dir="ltr">{color.toUpperCase()}</code>
              </div>
            ))}
          </div>
          <h3>
            <Text value="Typographies" />
          </h3>
          <p className={brand.type === "Instrument Serif" ? "font-display" : "font-sans"}>
            {brand.type} <span>+ Geist / Noto Sans Arabic</span>
          </p>
          <p className="brand-type-sample">
            <Text value={demo.headline} />
          </p>
          <h3>
            <Text value="Motif graphique" />
          </h3>
          <p>
            <Text value={brand.motif} />
          </p>
          <div className="brand-pattern" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <ConceptMark key={i} demo={demo} />
            ))}
          </div>
        </div>
      </div>
      <div className="brand-applications-heading">
        <h3>
          <Text value="La marque en situation" />
        </h3>
        <p>
          <Text value="Explorations de marque · Supports fictifs conçus pour cette démonstration." />
        </p>
      </div>
      <div className="brand-applications">
        {applications.map((label, i) => (
          <button
            type="button"
            key={label}
            onClick={() => setApplication(i)}
            aria-label={t("Agrandir : ") + t(label)}
          >
            <Artwork index={i} />
            <span>
              <Text value={label} />{" "}
              <span className="direction-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </button>
        ))}
      </div>
      <Dialog
        open={application !== null}
        onOpenChange={(open) => {
          if (!open) setApplication(null);
        }}
      >
        <DialogContent style={style} className="max-w-3xl max-h-[90dvh] overflow-auto">
          <DialogTitle>
            <Text value={demo.name} /> · <Text value={applications[application ?? 0]} />
          </DialogTitle>
          <DialogDescription>
            <Text value="Concept de démonstration · Aperçu éditorial fictif" />
          </DialogDescription>
          <Artwork index={application ?? 0} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
