import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminProjectQuery, refreshAll } from "@/lib/admin-data";
import { PROJECT_CATEGORIES, slugify } from "@/lib/site";
import { ImageField } from "@/components/admin/ImageField";
import { MediaManager } from "@/components/admin/MediaManager";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/projets/$id")({
  component: ProjectEditor,
});

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-5 md:p-7">
      <h2 className="text-lg font-medium">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ProjectEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(adminProjectQuery(id));
  const [form, setForm] = useState<Project | null>(null);
  const [servicesText, setServicesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data?.project && !dirty) {
      setForm(data.project);
      setServicesText(data.project.services.join(", "));
    }
  }, [data?.project, dirty]);

  if (isLoading || (!form && data?.project)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }
  if (!data?.project || !form) {
    return (
      <div className="rounded-3xl border bg-card p-10 text-center">
        <p>Ce projet n'existe pas ou a été supprimé.</p>
        <Link to="/admin" className="mt-4 inline-block underline">Retour aux réalisations</Link>
      </div>
    );
  }

  const set = <K extends keyof Project>(k: K, v: Project[K]) => {
    setDirty(true);
    setForm((f) => (f ? { ...f, [k]: v } : f));
  };

  async function patchField(values: Partial<Project>) {
    const { error } = await supabase.from("projects").update(values).eq("id", id);
    if (error) throw new Error("Image non enregistrée.");
    setForm((f) => (f ? { ...f, ...values } : f));
    refreshAll(qc);
  }

  async function save() {
    if (!form) return;
    const title = form.title.trim();
    const slug = slugify(form.slug || title);
    if (!title) { toast.error("Le titre est obligatoire."); return; }
    if (!slug) { toast.error("L'adresse du projet est invalide."); return; }
    if (form.external_url && !/^https?:\/\//.test(form.external_url.trim())) {
      { toast.error("Le lien externe doit commencer par http:// ou https://"); return; }
    }
    setSaving(true);
    const services = servicesText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12);
    const { error } = await supabase
      .from("projects")
      .update({
        title,
        slug,
        client_category: form.client_category.trim(),
        categories: form.categories,
        services,
        short_description: form.short_description.trim(),
        business_description: form.business_description.trim(),
        client_needs: form.client_needs.trim(),
        work_done: form.work_done.trim(),
        external_url: form.external_url?.trim() || null,
        external_label: form.external_label?.trim() || null,
        is_demo: form.is_demo,
        is_featured: form.is_featured,
        is_published: form.is_published,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      if (error.code === "23505") { toast.error("Cette adresse de projet est déjà utilisée. Choisissez-en une autre."); return; }
      { toast.error("Enregistrement impossible. Vérifiez les champs."); return; }
    }
    setDirty(false);
    setForm({ ...form, title, slug, services });
    toast.success(form.is_published ? "Projet enregistré et publié" : "Brouillon enregistré");
    refreshAll(qc);
  }

  const toggleCategory = (slug: string) =>
    set("categories", form.categories.includes(slug) ? form.categories.filter((c) => c !== slug) : [...form.categories, slug]);

  return (
    <div className="pb-28">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Réalisations
      </Link>
      <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">{form.title || "Sans titre"}</h1>
        {data.project.is_published && (
          <a href={`/realisations/${data.project.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            Voir sur le site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Informations">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Nom du projet *</Label>
                <Input id="title" value={form.title} maxLength={160} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Adresse de la page</Label>
                <div className="flex items-center rounded-md border bg-background pl-3 text-sm text-muted-foreground">
                  /realisations/
                  <input id="slug" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className="h-9 flex-1 bg-transparent pr-3 text-foreground outline-none" />
                </div>
                <button type="button" onClick={() => set("slug", slugify(form.title))} className="text-xs text-muted-foreground underline">
                  Générer depuis le nom
                </button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat">Secteur du client</Label>
                <Input id="cat" value={form.client_category} maxLength={80} placeholder="Ex. Restaurant, Salon de coiffure…" onChange={(e) => set("client_category", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Catégories (filtres du portfolio)</Label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => toggleCategory(c.slug)}
                      aria-pressed={form.categories.includes(c.slug)}
                      className={cn("rounded-full border px-4 py-2 text-sm transition-colors", form.categories.includes(c.slug) ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-foreground/40")}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="services">Services réalisés</Label>
                <Input id="services" value={servicesText} placeholder="Site web vitrine, Profil Instagram" onChange={(e) => { setDirty(true); setServicesText(e.target.value); }} />
                <p className="text-xs text-muted-foreground">Séparez les services par des virgules.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="short">Description courte (carte du portfolio)</Label>
                <Textarea id="short" rows={2} maxLength={280} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="Étude de cas" hint="Ces textes s'affichent sur la page détaillée du projet. Laissez vide pour masquer une partie.">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="biz">L'entreprise</Label>
                <Textarea id="biz" rows={3} maxLength={2000} value={form.business_description} onChange={(e) => set("business_description", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="needs">Le besoin du client</Label>
                <Textarea id="needs" rows={3} maxLength={2000} value={form.client_needs} onChange={(e) => set("client_needs", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work">Ce que j'ai réalisé</Label>
                <Textarea id="work" rows={3} maxLength={2000} value={form.work_done} onChange={(e) => set("work_done", e.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="Galerie : images et vidéos" hint="Enregistrées automatiquement. Choisissez « Smartphone » ou « Ordinateur » pour afficher une capture dans un cadre d'appareil.">
            <MediaManager projectId={id} media={data.media} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publication">
            <div className="space-y-5">
              <ToggleRow label="Publié sur le site" hint="Visible par tous les visiteurs." checked={form.is_published} onChange={(v) => set("is_published", v)} />
              <ToggleRow label="Projet vedette" hint="Mis en avant sur la page d'accueil." checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
              <ToggleRow label="Projet de démonstration" hint="Affiche le badge « Projet de démonstration »." checked={form.is_demo} onChange={(v) => set("is_demo", v)} />
            </div>
          </Card>

          <Card title="Image de couverture" hint="Enregistrée automatiquement.">
            <ImageField label="Couverture" value={form.cover_url} folder={`projects/${id}`} onChange={(v) => patchField({ cover_url: v })} />
          </Card>

          <Card title="Avant / après" hint="Facultatif. Les deux images sont nécessaires pour afficher le comparatif.">
            <div className="grid grid-cols-2 gap-4">
              <ImageField label="Avant" value={form.before_image_url} folder={`projects/${id}`} onChange={(v) => patchField({ before_image_url: v })} />
              <ImageField label="Après" value={form.after_image_url} folder={`projects/${id}`} onChange={(v) => patchField({ after_image_url: v })} />
            </div>
          </Card>

          <Card title="Lien externe" hint="Facultatif : site publié, page Instagram, Facebook…">
            <div className="space-y-3">
              <Input value={form.external_url ?? ""} placeholder="https://…" onChange={(e) => set("external_url", e.target.value)} />
              <Input value={form.external_label ?? ""} maxLength={60} placeholder="Texte du bouton (ex. Voir le site)" onChange={(e) => set("external_label", e.target.value)} />
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <p className="text-sm text-muted-foreground">{dirty ? "Modifications non enregistrées" : "Tout est enregistré"}</p>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {form.is_published ? "Enregistrer et publier" : "Enregistrer le brouillon"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
