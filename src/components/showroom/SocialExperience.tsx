import { Text, useT } from "@/lib/i18n/Preferences";
import { useState } from "react";
import {
  Instagram,
  Facebook,
  Grid3X3,
  Bookmark,
  Heart,
  MessageCircle,
  Camera,
  ArrowUpRight,
} from "lucide-react";
import type { Demo } from "@/lib/demonstrations";
import { DemoGallery } from "./DemoGallery";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function SocialExperience({
  demo,
  platform,
}: {
  demo: Demo;
  platform: "instagram" | "facebook" | "tiktok";
}) {
  const t = useT();
  const [story, setStory] = useState<number | null>(null);
  const facebook = platform === "facebook";
  const tiktok = platform === "tiktok";
  return (
    <div className={`social-experience demo-${demo.theme}`}>
      <aside className="social-editorial">
        <p className="demo-kicker">
          <Text
            value={
              facebook
                ? "La vitrine de proximité"
                : tiktok
                  ? "Le mouvement, en intention"
                  : "Une identité qui se reconnaît"
            }
          />
        </p>
        <h2>
          <Text
            value={
              facebook
                ? "Raconter. Présenter. Donner envie."
                : tiktok
                  ? "Des idées qui captent le regard."
                  : "Une première impression mémorable."
            }
          />
        </h2>
        <p>
          <Text value={demo.bio} />
        </p>
        <div className="social-editorial-tags">
          {demo.stories.map((s) => (
            <span key={s}>
              <Text value={s} />
            </span>
          ))}
        </div>
        <p className="demo-smallprint">
          <Text
            value={
              "Maquette éditoriale · Entreprise fictive · Aucune audience ni résultat revendiqué. Les interactions ouvrent les contenus de démonstration. "
            }
          />
        </p>
        {tiktok && (
          <p className="social-video-notice">
            <Text
              value={
                "Aperçus de contenu uniquement : aucune vidéo n’est disponible et aucune lecture n’est simulée. "
              }
            />
          </p>
        )}
      </aside>
      <div className={facebook ? "facebook-preview" : "social-phone"}>
        {!facebook && (
          <div className="phone-status">
            <span>
              <Text value={"9:41"} />
            </span>
            <span className="phone-notch" />
            <span>
              <Text value={"••• ▰"} />
            </span>
          </div>
        )}
        <div className="social-appbar">
          {facebook ? (
            <Facebook size={20} className="text-blue-600" />
          ) : tiktok ? (
            <span className="font-bold text-lg">
              <Text value={"♪ TikTok"} />
            </span>
          ) : (
            <Instagram size={20} />
          )}
          <strong>
            <Text value={facebook ? "Page professionnelle" : demo.handle} />
          </strong>
          <span className="social-concept-pill">
            <Text value={"Concept"} />
          </span>
        </div>
        {facebook && (
          <div className="facebook-cover">
            <img src={demo.images[0]} alt={t(`Couverture ${demo.name}`)} />
            <span>
              <Text value={demo.headline} />
            </span>
          </div>
        )}
        <div className="social-profile">
          <div className="social-avatar" style={{ backgroundImage: `url(${demo.images[1]})` }}>
            <span>
              <Text value={demo.initials} />
            </span>
          </div>
          <div>
            <h3>
              <Text value={demo.name} />
            </h3>
            <p>
              <Text value={demo.sector} />
            </p>
            <span className="social-concept-pill">
              <Text value={"Concept de démonstration"} />
            </span>
          </div>
        </div>
        <div className="social-bio">
          <p>
            <Text value={demo.bio} />
          </p>
          <button
            type="button"
            className="social-site-link"
            onClick={() => {
              document
                .querySelector<HTMLButtonElement>('[role="tab"][data-platform="site"]')
                ?.click();
              document
                .querySelector<HTMLButtonElement>('[role="tab"][data-platform="site"]')
                ?.focus();
            }}
          >
            <Text value={"Découvrir le site de démonstration "} />
            <ArrowUpRight size={13} />
          </button>
        </div>
        {!facebook && !tiktok && (
          <div className="social-stories" aria-label={t("Stories à la une")}>
            {demo.stories.map((s, i) => (
              <button type="button" key={s} onClick={() => setStory(i)}>
                <span>
                  <img src={demo.images[i]} alt={t("")} />
                </span>
                <Text value={s} />
              </button>
            ))}
          </div>
        )}
        {facebook ? (
          <div className="facebook-body">
            <section className="facebook-about">
              <h4>
                <Text value={"À propos"} />
              </h4>
              <p>
                <Text value={demo.intro} />
              </p>
              <h4>
                <Text value={"Services"} />
              </h4>
              {demo.services.map((s) => (
                <p key={s.name}>
                  <strong>
                    <Text value={s.name} />
                  </strong>
                  <br />
                  <Text value={s.text} />
                </p>
              ))}
            </section>
            <section>
              <h4>
                <Text value={"Galerie & publications"} />
              </h4>
              <DemoGallery images={demo.images} captions={demo.captions} identity={demo} />
              <div className="facebook-posts">
                {demo.captions.slice(0, 3).map((caption, i) => (
                  <article key={caption}>
                    <p>
                      <strong>
                        <Text value={demo.name} />
                      </strong>
                      <span>
                        <Text value={"Publication de démonstration"} />
                      </span>
                    </p>
                    <p>
                      <Text value={caption} />
                      <Text value={". "} />
                      <Text value={demo.services[i]?.text} />
                    </p>
                    <button
                      type="button"
                      onClick={() => setStory(i)}
                      aria-label={`${t("Ouvrir la publication : ")}${t(caption)}`}
                    >
                      <img src={demo.images[i + 2]} alt={t(caption)} loading="lazy" />
                    </button>
                    <div className="facebook-post-footer">
                      <Heart size={15} />
                      <MessageCircle size={15} />
                      <span>
                        <Text value={"Exemple de publication · Pas de compte réel"} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="social-grid-title">
              {tiktok ? <Camera size={16} /> : <Grid3X3 size={16} />}
              <span>
                <Text value={tiktok ? "Aperçus de contenu" : "Publications"} />
              </span>
              <Bookmark size={15} />
            </div>
            <DemoGallery
              images={demo.images}
              captions={demo.captions}
              vertical={tiktok}
              identity={demo}
            />
          </>
        )}
        {!facebook && (
          <div className="phone-bottom">
            <Text value={"Maquette "} />
            <Text value={tiktok ? "TikTok" : "Instagram"} />
            <Text value={"· MAYD DIGITAL "} />
          </div>
        )}
      </div>
      <Dialog
        open={story !== null}
        onOpenChange={(open) => {
          if (!open) setStory(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-auto rounded-2xl">
          <DialogTitle>
            <Text value={facebook ? demo.captions[story ?? 0] : demo.stories[story ?? 0]} />
          </DialogTitle>
          <DialogDescription>
            <Text value={"Concept de démonstration · Aperçu éditorial fictif"} />
          </DialogDescription>
          <img
            className="max-h-[65dvh] w-full rounded-xl object-cover"
            src={demo.images[(story ?? 0) + (facebook ? 2 : 0)]}
            alt={t(facebook ? demo.captions[story ?? 0] : demo.stories[story ?? 0])}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
