import { Text, useT } from "@/lib/i18n/Preferences";
import type { Demo } from "@/lib/demonstrations";
import { BRAND_UNIVERSES } from "@/lib/showroom-catalog";
import type { CSSProperties } from "react";

export function ConceptMark({ demo }: { demo: Demo }) {
  return (
    <span className={`concept-mark mark-${demo.theme}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
export function ConceptCover({ demo, platform = "site" }: { demo: Demo; platform?: string }) {
  const t = useT(),
    brand = BRAND_UNIVERSES[demo.theme]!;
  return (
    <div
      className={`concept-cover demo-${demo.theme}`}
      data-preview={platform}
      style={
        {
          "--brand-1": brand.palette[0],
          "--brand-2": brand.palette[1],
          "--brand-3": brand.palette[2],
        } as CSSProperties
      }
    >
      {platform === "identite" ? (
        <>
          <div className="cover-brand">
            <ConceptMark demo={demo} />
            <strong>
              <Text value={demo.name} />
            </strong>
            <span>
              <Text value={brand.motif} />
            </span>
          </div>
          <div className="cover-stationery">
            <span>
              <Text value={demo.name} />
            </span>
            <ConceptMark demo={demo} />
            <small>
              <Text value={demo.sector} />
            </small>
          </div>
          <div className="cover-swatches">
            {brand.palette.map((color) => (
              <i key={color} style={{ background: color }} />
            ))}
          </div>
        </>
      ) : platform === "instagram" || platform === "facebook" || platform === "tiktok" ? (
        <>
          <div className="cover-social-bar">
            <ConceptMark demo={demo} />
            <strong>
              <Text value={demo.name} />
            </strong>
            <span>
              {platform === "instagram"
                ? "Instagram"
                : platform === "facebook"
                  ? "Facebook"
                  : "TikTok"}
            </span>
          </div>
          {platform === "facebook" && (
            <div className="cover-facebook-banner">
              <img src={demo.images[3]} alt="" loading="lazy" />
              <strong>
                <Text value={demo.headline} />
              </strong>
            </div>
          )}
          <div className="cover-posts">
            {(platform === "facebook" ? [1, 4] : [0, 2, 4]).map((n, i) => (
              <div key={n} className={`cover-post post-${i}`}>
                <img src={demo.images[n]} alt={t(demo.captions[n])} loading="lazy" />
                <span>
                  <small>
                    <Text value={demo.name} />
                  </small>
                  <Text value={demo.captions[n]} />
                </span>
                {platform === "tiktok" && (
                  <em>
                    <Text value="Aperçu de contenu" />
                  </em>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="cover-web-nav">
            <ConceptMark demo={demo} />
            <strong>
              <Text value={demo.name} />
            </strong>
            <span>
              <Text value={demo.collection} />
            </span>
          </div>
          <div className={`cover-web-layout web-${demo.theme}`}>
            <div>
              <small>
                <Text value={demo.sector} />
              </small>
              <strong>
                <Text value={demo.headline} />
              </strong>
              <span>
                <Text value={demo.action} />
                <b className="direction-arrow" aria-hidden="true">
                  ↗
                </b>
              </span>
            </div>
            <img src={demo.images[0]} alt={t(demo.headline)} loading="lazy" />
            {demo.theme === "coiffure" && <img src={demo.images[4]} alt="" loading="lazy" />}
          </div>
        </>
      )}
    </div>
  );
}
