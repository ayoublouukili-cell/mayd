import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminProjectsQuery, refreshAll } from "@/lib/admin-data";
import { removeMedia, useMediaUrl } from "@/lib/admin-storage";
import { categoryLabel } from "@/lib/site";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { newId } from "@/lib/id";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/")({
  component: ProjectsAdmin,
});

function Thumb({ value }: { value: string | null }) {
  const url = useMediaUrl(value);
  return (
    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-beige">
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="h-4 w-4" /></div>}
    </div>
  );
}

function ProjectsAdmin() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useQuery(adminProjectsQuery);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function create() {
    setCreating(true);
    const minOrder = Math.min(0, ...(projects ?? []).map((p) => p.sort_order));
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: "Nouveau projet", slug: `projet-${newId().slice(0, 8)}`, sort_order: minOrder - 1 })
      .select("id")
      .single();
    setCreating(false);
    if (error) { toast.error("Impossible de créer le projet."); return; }
    refreshAll(qc);
    navigate({ to: "/admin/projets/$id", params: { id: data.id } });
  }

  async function patch(p: Project, values: Partial<Project>, msg: string) {
    setBusyId(p.id);
    const { error } = await supabase.from("projects").update(values).eq("id", p.id);
    setBusyId(null);
    if (error) { toast.error("La modification n'a pas été enregistrée."); return; }
    toast.success(msg);
    refreshAll(qc);
  }

  async function move(index: number, dir: -1 | 1) {
    if (!projects) return;
    const j = index + dir;
    if (j < 0 || j >= projects.length) return;
    // Renumber the whole list so ordering stays stable even with equal values.
    const list = [...projects];
    const a = list[index]!;
    list[index] = list[j]!;
    list[j] = a;
    setBusyId(a.id);
    const results = await Promise.all(
      list.map((p, i) => (p.sort_order === i + 1 ? null : supabase.from("projects").update({ sort_order: i + 1 }).eq("id", p.id))),
    );
    setBusyId(null);
    if (results.some((r) => r && r.error)) toast.error("Le nouvel ordre n'a pas pu être enregistré.");
    refreshAll(qc);
  }

  async function confirmDelete() {
    const p = toDelete;
    if (!p) return;
    setToDelete(null);
    setBusyId(p.id);
    const { data: media } = await supabase.from("project_media").select("url,kind").eq("project_id", p.id);
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    setBusyId(null);
    if (error) { toast.error("Suppression impossible."); return; }
    await Promise.all([
      removeMedia(p.cover_url),
      removeMedia(p.before_image_url),
      removeMedia(p.after_image_url),
      ...(media ?? []).filter((m) => m.kind !== "embed").map((m) => removeMedia(m.url)),
    ]);
    toast.success("Projet supprimé");
    refreshAll(qc);
  }

  return (
    <div>
      <AnalyticsDashboard />
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Réalisations</h1>
          <p className="mt-2 text-muted-foreground">
            Les projets publiés apparaissent automatiquement sur le site. Les projets « vedette » sont mis en avant sur l'accueil.
          </p>
        </div>
        <button onClick={create} disabled={creating} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Nouveau projet
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-card">
        {isLoading && (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        )}
        {error && <p className="p-6 text-destructive">Impossible de charger les projets.</p>}
        {projects && projects.length === 0 && (
          <p className="p-10 text-center text-muted-foreground">Aucun projet pour l'instant. Créez votre première réalisation.</p>
        )}
        <ul className="divide-y">
          {projects?.map((p, i) => (
            <li key={p.id} className={cn("flex flex-col gap-4 p-4 transition-opacity md:flex-row md:items-center md:p-5", busyId === p.id && "opacity-50")}>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Thumb value={p.cover_url} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to="/admin/projets/$id" params={{ id: p.id }} className="truncate font-medium hover:underline">{p.title}</Link>
                    {p.is_demo && <span className="rounded-full bg-beige px-2 py-0.5 text-[11px]">Démonstration</span>}
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px]", p.is_published ? "bg-clay/15 text-clay" : "bg-muted text-muted-foreground")}>
                      {p.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {[p.client_category, ...p.categories.map(categoryLabel)].filter(Boolean).join(" · ") || "Aucune catégorie"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <IconBtn label="Monter" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></IconBtn>
                <IconBtn label="Descendre" onClick={() => move(i, 1)} disabled={i === projects.length - 1}><ArrowDown className="h-4 w-4" /></IconBtn>
                <IconBtn
                  label={p.is_featured ? "Retirer des vedettes" : "Mettre en vedette"}
                  active={p.is_featured}
                  onClick={() => patch(p, { is_featured: !p.is_featured }, p.is_featured ? "Retiré des vedettes" : "Mis en vedette")}
                >
                  <Star className={cn("h-4 w-4", p.is_featured && "fill-current")} />
                </IconBtn>
                <IconBtn
                  label={p.is_published ? "Dépublier" : "Publier"}
                  active={p.is_published}
                  onClick={() => patch(p, { is_published: !p.is_published }, p.is_published ? "Projet masqué du site" : "Projet publié")}
                >
                  {p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </IconBtn>
                <Link to="/admin/projets/$id" params={{ id: p.id }} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm hover:bg-accent">
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </Link>
                <IconBtn label="Supprimer" danger onClick={() => setToDelete(p)}><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {toDelete?.title} » ?</AlertDialogTitle>
            <AlertDialogDescription>Le projet, ses images et ses vidéos seront définitivement supprimés.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  active,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-accent disabled:opacity-30",
        active && "border-clay/40 bg-clay/10 text-clay",
        danger && "text-destructive hover:bg-destructive/10",
      )}
    >
      {children}
    </button>
  );
}
