import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Text, useT } from "@/lib/i18n/Preferences";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");
    setError("");
    if (username !== "maynd" || !password) {
      setError("Identifiant ou mot de passe incorrect.");
      return;
    }
    setBusy(true);
    try {
      // The username maps to the existing owner account; Supabase still enforces auth and RLS.
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "maynd@contact.com",
        password,
      });
      if (error || !data.user) {
        setError(
          error?.code === "email_not_confirmed"
            ? "Le compte administrateur doit être activé dans Supabase."
            : "Identifiant ou mot de passe incorrect.",
        );
        return;
      }
      const role = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (role.error || role.data !== true) {
        await supabase.auth.signOut();
        setError("Ce compte ne dispose pas des droits administrateur.");
        return;
      }
      onSuccess();
    } catch {
      setError("Connexion impossible. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="mt-8 space-y-5" aria-label={t("Connexion admin")}>
      <div className="space-y-2">
        <Label htmlFor="username">
          <Text value="Identifiant" />
        </Label>
        <Input
          id="username"
          name="username"
          defaultValue="maynd"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className="h-12 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          <Text value="Mot de passe" />
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-12 rounded-xl pe-12"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted-foreground"
            aria-label={t(visible ? "Masquer le mot de passe" : "Afficher le mot de passe")}
            aria-pressed={visible}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          <Text value={error} />
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        <Text value={busy ? "Connexion en cours…" : "Se connecter"} />
      </button>
    </form>
  );
}
