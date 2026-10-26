import { Text, useT } from "@/lib/i18n/Preferences";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};
export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const t = useT();
  const open = index !== null;
  const prev = useCallback(
    () => index !== null && onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );
  const next = useCallback(
    () => index !== null && onIndex((index + 1) % images.length),
    [index, images.length, onIndex],
  );
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);
  if (!open || typeof document === "undefined") return null;
  const img = images[index];
  if (!img) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("Visionneuse d'images")}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 text-paper backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-sm text-paper/70">
        <span>
          <Text value={index + 1} />
          <Text value={"/ "} />
          <Text value={images.length} />
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20"
          aria-label={t("Fermer")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
        <img
          key={img.src}
          src={img.src}
          alt={t(img.alt)}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-lg object-contain animate-in zoom-in-95 fade-in duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20 md:left-6"
              aria-label={t("Image précédente")}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20 md:right-6"
              aria-label={t("Image suivante")}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {img.caption && (
        <p className="px-6 pb-6 text-center text-sm text-paper/70">
          <Text value={img.caption} />
        </p>
      )}
    </div>,
    document.body,
  );
}
