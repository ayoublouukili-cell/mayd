import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Check, Gift, Loader2, Mail } from "lucide-react";
import { Text, useT } from "@/lib/i18n/Preferences";
import { confirmTrialRequest } from "@/lib/public-data.functions";
import { getTrialClient } from "@/lib/trial-client";
import { trialSchema, type TrialInput } from "@/lib/trial";
import { SERVICE_OPTIONS } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DRAFT = "mayd-trial-request";
const CONDITIONS =
  "J'accepte d'être contacté pour organiser mon essai gratuit de 10 jours, dont le début et le périmètre seront convenus ensemble, sans paiement automatique.";
const field =
  "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-clay";

export function TrialOffer() {
  const t = useT();
  const confirm = useServerFn(confirmTrialRequest);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "sending" | "email" | "confirming" | "done">("form");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState<TrialInput>();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("trial") !== "confirm") return;
    setOpen(true);
    setStep("confirming");
    void (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        if (hash.has("error"))
          throw new Error("Ce lien est expiré ou invalide. Demandez un nouveau lien.");
        const { data, error: authError } = await getTrialClient().auth.getSession();
        if (authError || !data.session)
          throw new Error("Ce lien est expiré ou invalide. Demandez un nouveau lien.");
        let draft: TrialInput | undefined;
        try {
          const parsed = trialSchema.safeParse(JSON.parse(localStorage.getItem(DRAFT) ?? "null"));
          if (parsed.success && parsed.data.email === data.session.user.email?.toLowerCase())
            draft = parsed.data;
        } catch {
          /* Metadata also lets a new customer confirm on another device. */
        }
        const metadata = trialSchema.safeParse(data.session.user.user_metadata?.["trial_request"]);
        if (!draft && !metadata.success) {
          setEmail(data.session.user.email ?? "");
          throw new Error("Email confirmé. Complétez votre demande ci-dessous pour l'enregistrer.");
        }
        await confirm({ data: { accessToken: data.session.access_token, request: draft } });
        try {
          localStorage.removeItem(DRAFT);
        } catch {
          /* Optional draft cache. */
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("trial");
        url.hash = "";
        window.history.replaceState(null, "", url.pathname + url.search);
        setStep("done");
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Votre demande n'a pas pu être enregistrée. Réessayez.",
        );
        setStep("form");
      }
    })();
  }, [confirm]);

  async function sendLink(input: TrialInput) {
    setStep("sending");
    setError("");
    try {
      const client = getTrialClient();
      const { data: session } = await client.auth.getSession();
      if (
        session.session?.user.email_confirmed_at &&
        session.session.user.email?.toLowerCase() === input.email
      ) {
        await confirm({ data: { accessToken: session.session.access_token, request: input } });
        setStep("done");
        return;
      }
      // Preserve the existing single-owner setup before enabling customer signups.
      const { data: hasAdmin, error: adminError } = await client.rpc("admin_exists");
      if (adminError || !hasAdmin)
        throw new Error("L'offre sera disponible prochainement. Contactez-nous pour votre essai.");
      const { error: sendError } = await client.auth.signInWithOtp({
        email: input.email,
        options: {
          emailRedirectTo: `${window.location.origin}/?trial=confirm`,
          data: { trial_request: input },
        },
      });
      if (sendError) throw new Error("Impossible d'envoyer le lien. Réessayez dans une minute.");
      try {
        localStorage.setItem(DRAFT, JSON.stringify(input));
      } catch {
        /* New-account metadata is the fallback. */
      }
      setRequest(input);
      setEmail(input.email);
      setCooldown(60);
      setStep("email");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible d'envoyer le lien. Réessayez dans une minute.",
      );
      setStep(request ? "email" : "form");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const parsed = trialSchema.safeParse({
      name: values.get("name"),
      email: values.get("email"),
      company: values.get("company"),
      service: values.get("service"),
      consent: values.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Indiquez un email valide");
      return;
    }
    void sendLink(parsed.data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-7 rounded-2xl border border-clay/30 bg-clay/10 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-clay-foreground">
            <Gift className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay">
              <Text value="Offre découverte" />
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight">
              <Text value="10 jours pour découvrir nos services. Gratuitement." />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <Text value="Votre projet mérite un premier pas. Confirmez votre email, puis préparons votre essai ensemble." />
            </p>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Text value="Profiter de mes 10 jours gratuits" />
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogTitle className="pe-6 text-2xl">
          <Text value="Votre essai gratuit de 10 jours" />
        </DialogTitle>
        <DialogDescription>
          <Text value="Confirmez votre email pour envoyer votre demande. Notre équipe vous contactera pour définir la prestation et la date de début." />
        </DialogDescription>
        {error && (
          <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {t(error)}
          </p>
        )}
        {step === "done" ? (
          <div role="status" className="py-5">
            <Check className="mb-4 h-10 w-10 text-clay" aria-hidden="true" />
            <h3 className="text-xl font-semibold">
              <Text value="Email confirmé, demande reçue !" />
            </h3>
            <p className="mt-3 text-muted-foreground">
              <Text value="Nous vous contacterons par email pour organiser vos 10 jours gratuits. L'essai commencera à la date convenue ensemble." />
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground"
            >
              <Text value="Fermer" />
            </button>
          </div>
        ) : step === "confirming" ? (
          <p role="status" className="flex items-center gap-3 py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <Text value="Vérification de votre email…" />
          </p>
        ) : step === "email" ? (
          <div role="status" className="py-4">
            <Mail className="mb-4 h-10 w-10 text-clay" aria-hidden="true" />
            <h3 className="text-xl font-semibold">
              <Text value="Consultez votre boîte email" />
            </h3>
            <p className="mt-3 break-words text-muted-foreground">
              <Text value="Un lien de confirmation a été demandé pour :" /> <strong>{email}</strong>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <Text value="Cliquez sur le lien reçu pour valider votre demande. Pensez à vérifier les spams. Votre demande ne sera enregistrée qu'après confirmation." />
            </p>
            <button
              disabled={cooldown > 0}
              onClick={() => request && void sendLink(request)}
              className="mt-6 rounded-full border px-5 py-3 text-sm disabled:opacity-50"
            >
              <Text value="Renvoyer le lien" />
              {cooldown > 0 && ` (${cooldown}s)`}
            </button>
            <button
              onClick={() => {
                setStep("form");
                setError("");
              }}
              className="mt-4 block text-sm underline"
            >
              <Text value="Modifier mon email" />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium">
              <Text value="Nom *" />
              <input
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                className={field}
                defaultValue={request?.name}
              />
            </label>
            <label className="block text-sm font-medium">
              <Text value="Email *" />
              <input
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                maxLength={160}
                required
                className={field}
                defaultValue={email}
              />
            </label>
            <label className="block text-sm font-medium">
              <Text value="Entreprise ou activité *" />
              <input
                name="company"
                autoComplete="organization"
                maxLength={120}
                required
                className={field}
                defaultValue={request?.company}
              />
            </label>
            <label className="block text-sm font-medium">
              <Text value="Service souhaité" />
              <select
                name="service"
                className={field}
                defaultValue={request?.service ?? SERVICE_OPTIONS[0]}
              >
                {SERVICE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {t(value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <input
                name="consent"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-clay"
              />
              <Text value={CONDITIONS} />
            </label>
            <button
              type="submit"
              disabled={step === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {step === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              <Text
                value={step === "sending" ? "Envoi en cours…" : "Recevoir mon lien de confirmation"}
              />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              <Text value="Aucune carte bancaire. Aucun paiement automatique." />
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
