import { Text, useT } from "@/lib/i18n/Preferences";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Demo } from "@/lib/demonstrations";
export function DemoGallery({
  images,
  captions,
  vertical = false,
  identity,
}: {
  images: string[];
  captions: string[];
  vertical?: boolean;
  identity?: Demo;
}) {
  const t = useT();
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <div
        className={`demo-gallery ${vertical ? "demo-gallery-vertical" : ""} ${identity ? `editorial-grid editorial-${identity.theme}` : ""}`}
      >
        {images.map((src, i) => (
          <button
            type="button"
            key={`${src}-${i}`}
            className="demo-photo"
            onClick={() => setSelected(i)}
            aria-label={`${t("Agrandir : ")}${t(captions[i])}`}
          >
            <img src={src} alt={t(captions[i])} loading="lazy" />
            <span className="demo-photo-shade" />
            {identity && (
              <>
                <span className="editorial-brand">
                  <Text value={identity.name} />
                </span>
                <span className="editorial-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </>
            )}
            <span className="demo-photo-label">
              {vertical && (
                <small>
                  <Text value={"Aperçu de contenu"} />
                </small>
              )}
              <Text value={captions[i]} />
            </span>
            <Expand size={16} className="demo-expand" />
          </button>
        ))}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[95dvh] max-w-4xl overflow-auto rounded-2xl p-5">
          <DialogTitle>
            <Text value={captions[selected ?? 0]} />
          </DialogTitle>
          <DialogDescription>
            <Text value={"Concept de démonstration ·"} />
            <Text value={" "} />
            <Text
              value={
                vertical
                  ? "Aperçu visuel, aucune vidéo disponible."
                  : "Photographie d’illustration."
              }
            />
          </DialogDescription>
          <img
            className="max-h-[65dvh] w-full rounded-lg object-contain"
            src={images[selected ?? 0]}
            alt={t(captions[selected ?? 0])}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="demo-outline"
              aria-label={t("Image précédente")}
              onClick={() => setSelected(((selected ?? 0) - 1 + images.length) % images.length)}
            >
              <ChevronLeft size={18} />
              <Text value={"Précédente "} />
            </button>
            <span>
              <Text value={(selected ?? 0) + 1} />
              <Text value={"/ "} />
              <Text value={images.length} />
            </span>
            <button
              type="button"
              className="demo-outline"
              aria-label={t("Image suivante")}
              onClick={() => setSelected(((selected ?? 0) + 1) % images.length)}
            >
              <Text value={"Suivante "} />
              <ChevronRight size={18} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
