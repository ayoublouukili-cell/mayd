import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Film, ImagePlus, Link2, Loader2, Trash2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { removeMedia, uploadMedia, useMediaUrl } from "@/lib/admin-storage";
import { refreshAll } from "@/lib/admin-data";
import { toEmbedUrl } from "@/lib/site";
import type { Database } from "@/integrations/supabase/types";

type Media = Database["public"]["Tables"]["project_media"]["Row"];
type Frame = Database["public"]["Enums"]["media_frame"];

const FRAMES: { value: Frame; label: string }[] = [
  { value: "none", label: "Sans cadre" },
  { value: "laptop", label: "Ordinateur" },
  { value: "phone", label: "Smartphone" },
];

function Preview({ m }: { m: Media }) {
  const url = useMediaUrl(m.kind === "embed" ? null : m.url);
  if (m.kind === "embed") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-ink text-paper">
        <Youtube className="h-5 w-5" />
        <span className="text-[10px] opacity-70">Lien vidéo</span>
      </div>
    );
  }
  if (!url) return <div className="h-full w-full animate-pulse bg-beige" />;
  if (m.kind === "video") return <video src={url} muted preload="metadata" className="h-full w-full object-cover" />;
  return <img src={url} alt="" className="h-full w-full object-cover" />;
}

export function MediaManager({ projectId, media }: { projectId: string; media: Media[] }) {
  const qc = useQueryClient();
  const images = useRef<HTMLInputElement>(null);
  const videos = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [embed, setEmbed] = useState("");

  const nextOrder = () => (media.length ? Math.max(...media.map((m) => m.sort_order)) + 1 : 0);

  async function upload(files: FileList | null, kind: "image" | "video") {
    if (!files?.length) return;
    let order = nextOrder();
    let ok = 0;
    for (const [i, file] of [...files].entries()) {
      const expected = kind === "image" ? "image/" : "video/";
      if (!file.type.startsWith(expected)) {
        toast.error(`« ${file.name} » n'est pas ${kind === "image" ? "une image" : "une vidéo"}.`);
        continue;
      }
      setUploading(`Envoi ${i + 1}/${files.length} — ${file.name}`);
      try {
        const path = await uploadMedia(file, `projects/${projectId}`);
        const { error } = await supabase.from("project_media").insert({ project_id: projectId, kind, url: path, sort_order: order++ });
        if (error) {
          await removeMedia(path);
          throw new Error("Le média n'a pas pu être enregistré.");
        }
        ok++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
      }
    }
    setUploading(null);
    if (images.current) images.current.value = "";
    if (videos.current) videos.current.value = "";
    if (ok) toast.success(ok > 1 ? `${ok} médias ajoutés` : "Média ajouté");
    refreshAll(qc);
  }

  async function addEmbed() {
    if (!toEmbedUrl(embed)) { toast.error("Collez un lien YouTube ou Vimeo valide."); return; }
    const { error } = await supabase.from("project_media").insert({ project_id: projectId, kind: "embed", url: embed.trim(), sort_order: nextOrder() });
    if (error) { toast.error("Le lien n'a pas pu être ajouté."); return; }
    setEmbed("");
    toast.success("Vidéo ajoutée");
    refreshAll(qc);
  }

  async function update(m: Media, values: Partial<Media>) {
    const { error } = await supabase.from("project_media").update(values).eq("id", m.id);
    if (error) { toast.error("Modification non enregistrée."); return; }
    refreshAll(qc);
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= media.length) return;
    const list = [...media];
    const a = list[i]!;
    list[i] = list[j]!;
    list[j] = a;
    await Promise.all(list.map((m, k) => (m.sort_order === k ? null : supabase.from("project_media").update({ sort_order: k }).eq("id", m.id))));
    refreshAll(qc);
  }

  async function remove(m: Media) {
    const { error } = await supabase.from("project_media").delete().eq("id", m.id);
    if (error) { toast.error("Suppression impossible."); return; }
    if (m.kind !== "embed") await removeMedia(m.url);
    refreshAll(qc);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => images.current?.click()} disabled={!!uploading} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
          <ImagePlus className="h-4 w-4" /> Ajouter des images
        </button>
        <button type="button" onClick={() => videos.current?.click()} disabled={!!uploading} className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2.5 text-sm font-medium disabled:opacity-50">
          <Film className="h-4 w-4" /> Ajouter une vidéo
        </button>
        <input ref={images} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, "image")} />
        <input ref={videos} type="file" accept="video/*" multiple className="hidden" onChange={(e) => upload(e.target.files, "video")} />
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={embed}
            onChange={(e) => setEmbed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmbed())}
            placeholder="Lien YouTube ou Vimeo"
            className="h-10 w-full rounded-full border bg-background pl-9 pr-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button type="button" onClick={addEmbed} className="rounded-full border bg-background px-4 py-2 text-sm font-medium">
          Ajouter le lien
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Images et vidéos jusqu'à 50 Mo par fichier. Pour une vidéo plus lourde, utilisez un lien YouTube ou Vimeo.</p>

      {uploading && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-background p-3 text-sm" role="status">
          <Loader2 className="h-4 w-4 animate-spin" /> {uploading}
        </p>
      )}

      {media.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
          Aucun média. Ajoutez des captures d'écran, des photos ou des vidéos de votre travail.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {media.map((m, i) => (
            <li key={m.id} className="flex flex-col gap-3 rounded-2xl border bg-background p-3 sm:flex-row sm:items-center">
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl sm:w-28">
                <Preview m={m} />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  defaultValue={m.caption}
                  maxLength={200}
                  placeholder="Légende (facultatif)"
                  onBlur={(e) => e.target.value !== m.caption && update(m, { caption: e.target.value })}
                  className="h-9 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-foreground"
                />
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5">{m.kind === "image" ? "Image" : m.kind === "video" ? "Vidéo" : "YouTube / Vimeo"}</span>
                  {m.kind !== "embed" && (
                    <label className="flex items-center gap-1.5">
                      Affichage
                      <select value={m.frame} onChange={(e) => update(m, { frame: e.target.value as Frame })} className="rounded-md border bg-card px-2 py-1 text-xs text-foreground">
                        {FRAMES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-9 w-9 items-center justify-center rounded-full border disabled:opacity-30" aria-label="Monter"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === media.length - 1} className="flex h-9 w-9 items-center justify-center rounded-full border disabled:opacity-30" aria-label="Descendre"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(m)} className="flex h-9 w-9 items-center justify-center rounded-full border text-destructive hover:bg-destructive/10" aria-label="Supprimer le média"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
