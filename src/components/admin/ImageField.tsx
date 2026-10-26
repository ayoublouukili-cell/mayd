import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeMedia, uploadMedia, useMediaUrl } from "@/lib/admin-storage";
import { cn } from "@/lib/utils";

/** Single image picker that uploads immediately and reports the new stored value. */
export function ImageField({
  label,
  hint,
  value,
  folder,
  onChange,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  hint?: string;
  value: string | null;
  folder: string;
  onChange: (next: string | null) => Promise<void> | void;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const url = useMediaUrl(value);

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Choisissez un fichier image (JPG, PNG, WebP)."); return; }
    setBusy(true);
    try {
      const path = await uploadMedia(file, folder);
      const previous = value;
      await onChange(path);
      await removeMedia(previous);
      toast.success("Image enregistrée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function clear() {
    setBusy(true);
    try {
      const previous = value;
      await onChange(null);
      await removeMedia(previous);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className={cn("group relative mt-3 overflow-hidden rounded-2xl border border-dashed bg-background", aspect)}>
        {url ? (
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <button type="button" onClick={() => input.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ImagePlus className="h-6 w-6" />
            Ajouter une image
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {url && !busy && (
          <div className="absolute inset-x-2 bottom-2 flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="flex-1 rounded-full bg-background/95 px-3 py-2 text-xs font-medium shadow-soft">
              Remplacer
            </button>
            <button type="button" onClick={clear} className="rounded-full bg-background/95 px-3 py-2 text-destructive shadow-soft" aria-label={`Retirer ${label}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}
