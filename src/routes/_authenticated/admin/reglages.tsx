import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminSettingsQuery, refreshAll } from "@/lib/admin-data";
import { ImageField } from "@/components/admin/ImageField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/reglages")({
  component: SettingsAdmin,
});

const URL_FIELDS = ["instagram_url", "facebook_url", "tiktok_url"] as const;

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(adminSettingsQuery);
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) return <Skeleton className="h-[600px] w-full rounded-3xl" />;

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function patchImage(values: Partial<Settings>) {
    const { error } = await supabase.from("site_settings").update(values).eq("id", true);
    if (error) throw new Error("Image non enregistrée.");
    setForm((f) => (f ? { ...f, ...values } : f));
    refreshAll(qc);
  }

  async function save() {
    if (!form) return;
    if (!form.brand_name.trim()) { toast.error("Le nom de marque est obligatoire."); return; }
    for (const k of URL_FIELDS) {
      const v = form[k]?.trim();
      if (v && !/^https?:\/\//.test(v)) { toast.error("Les liens des réseaux doivent commencer par https://"); return; }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { toast.error("Adresse email invalide."); return; }
    setSaving(true);
    const clean = (v: string | null) => (v && v.trim() ? v.trim() : null);
    const { error } = await supabase
      .from("site_settings")
      .update({
        brand_name: form.brand_name.trim(),
        brand_suffix: form.brand_suffix.trim(),
        brand_description: form.brand_description.trim(),
        owner_name: form.owner_name.trim() || "Mehdi",
        email: clean(form.email),
        phone: clean(form.phone),
        whatsapp: clean(form.whatsapp),
        instagram_url: clean(form.instagram_url),
        facebook_url: clean(form.facebook_url),
        tiktok_url: clean(form.tiktok_url),
      })
      .eq("id", true);
    setSaving(false);
    if (error) { toast.error("Enregistrement impossible."); return; }
    toast.success("Réglages enregistrés");
    refreshAll(qc);
  }

  return (
    <div className="pb-28">
      <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Réglages du site</h1>
      <p className="mt-2 text-muted-foreground">Marque, coordonnées, portrait et captures affichées dans l'en-tête du site.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border bg-card p-5 md:p-7">
          <h2 className="text-lg font-medium">Marque</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Nom de marque" value={form.brand_name} onChange={(v) => set("brand_name", v)} max={40} />
            <Field label="Complément" value={form.brand_suffix} onChange={(v) => set("brand_suffix", v)} max={40} />
            <Field label="Votre prénom (section À propos)" value={form.owner_name} onChange={(v) => set("owner_name", v)} max={60} />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Description courte (pied de page)</Label>
              <Textarea id="desc" rows={3} maxLength={300} value={form.brand_description} onChange={(e) => set("brand_description", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-5 md:p-7">
          <h2 className="text-lg font-medium">Coordonnées</h2>
          <p className="mt-1 text-sm text-muted-foreground">Les champs vides ne sont pas affichés sur le site.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Email professionnel" value={form.email ?? ""} onChange={(v) => set("email", v)} placeholder="contact@…" type="email" />
            <Field label="Téléphone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="06 …" />
            <Field label="Numéro WhatsApp (avec indicatif)" value={form.whatsapp ?? ""} onChange={(v) => set("whatsapp", v)} placeholder="+33 6 …" />
            <Field label="Instagram" value={form.instagram_url ?? ""} onChange={(v) => set("instagram_url", v)} placeholder="https://instagram.com/…" />
            <Field label="Facebook" value={form.facebook_url ?? ""} onChange={(v) => set("facebook_url", v)} placeholder="https://facebook.com/…" />
            <Field label="TikTok" value={form.tiktok_url ?? ""} onChange={(v) => set("tiktok_url", v)} placeholder="https://tiktok.com/@…" />
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-5 md:p-7 lg:col-span-2">
          <h2 className="text-lg font-medium">Images du site</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enregistrées automatiquement. Sans capture, l'en-tête affiche une illustration « Votre entreprise ».
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ImageField label="Portrait" hint="Section À propos" aspect="aspect-[4/5]" value={form.portrait_url} folder="site" onChange={(v) => patchImage({ portrait_url: v })} />
            <ImageField label="Écran ordinateur" hint="Capture d'un site (16:10)" aspect="aspect-[16/10]" value={form.hero_laptop_url} folder="site" onChange={(v) => patchImage({ hero_laptop_url: v })} />
            <ImageField label="Smartphone 1" hint="Capture Instagram" aspect="aspect-[9/19.5]" value={form.hero_phone_1_url} folder="site" onChange={(v) => patchImage({ hero_phone_1_url: v })} />
            <ImageField label="Smartphone 2" hint="Capture Facebook ou autre" aspect="aspect-[9/19.5]" value={form.hero_phone_2_url} folder="site" onChange={(v) => patchImage({ hero_phone_2_url: v })} />
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl justify-end px-4 py-3 md:px-8">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer les réglages
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, max = 200, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number; type?: string }) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
