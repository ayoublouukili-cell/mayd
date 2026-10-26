import { Text, useT } from "@/lib/i18n/Preferences";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Instagram, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/queries";
import { submitContactMessage } from "@/lib/public-data.functions";
import { SERVICE_OPTIONS, contactSchema, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
type Errors = Partial<Record<"name" | "company" | "contact" | "service" | "message", string>>;
const fieldClass =
  "w-full rounded-2xl border bg-background px-5 py-4 text-base outline-none transition-all placeholder:text-muted-foreground/70 focus:border-foreground focus:ring-4 focus:ring-ring/15 aria-[invalid=true]:border-destructive";
export function ContactForm({ whatsapp = null }: { whatsapp?: string | null }) {
  const t = useT();
  const send = useServerFn(submitContactMessage);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "whatsapp">("idle");
  const [whatsappDraft, setWhatsappDraft] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(
      ["name", "company", "contact", "service", "message"].map((k) => [k, String(fd.get(k) ?? "")]),
    );
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    const input = parsed.data;
    const draft = whatsappLink(
      whatsapp,
      [
        t("Bonjour, je souhaite discuter de mon projet digital."),
        "",
        `${t("Nom")} : ${input.name}`,
        input.company ? `${t("Nom de l'entreprise")} : ${input.company}` : "",
        `${t("Contact")} : ${input.contact}`,
        input.service ? `${t("Service souhaité")} : ${t(input.service)}` : "",
        "",
        `${t("Description du projet")} :`,
        input.message,
      ].join("\n"),
    );
    if (draft) {
      setWhatsappDraft(draft);
      setStatus("whatsapp");
      // Open during the user gesture; keep a visible link if popups are blocked.
      window.open(draft, "_blank", "noopener,noreferrer");
      // Keep an inbox copy independently of the WhatsApp handoff.
      void send({ data: input }).catch(() => {
        console.warn("[contact] La copie du formulaire n'a pas pu être enregistrée.");
      });
      return;
    }
    setStatus("sending");
    try {
      await send({ data: parsed.data });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("idle");
      toast.error(t(err instanceof Error ? err.message : "Votre message n'a pas pu être envoyé."));
    }
  }
  if (status === "whatsapp") {
    return (
      <div
        className="flex h-full flex-col items-start justify-center rounded-3xl border bg-card p-8 md:p-10"
        role="status"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay text-clay-foreground">
          <MessageCircle className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-4xl">
          <Text value="Votre message est prêt sur WhatsApp." />
        </h3>
        <p className="mt-3 text-muted-foreground">
          <Text value="Appuyez sur Envoyer dans WhatsApp pour nous transmettre votre demande." />
        </p>
        <a
          href={whatsappDraft}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <Text value="Ouvrir WhatsApp" />
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium underline underline-offset-4"
        >
          <Text value="Envoyer un autre message" />
        </button>
      </div>
    );
  }
  if (status === "sent") {
    return (
      <div
        className="flex h-full flex-col items-start justify-center rounded-3xl border bg-card p-10"
        role="status"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay text-clay-foreground">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-4xl">
          <Text value={"Merci, message bien reçu."} />
        </h3>
        <p className="mt-3 text-muted-foreground">
          <Text value={"Nous revenons vers vous très vite pour parler de votre projet."} />
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-medium underline underline-offset-4"
        >
          <Text value={"Envoyer un autre message "} />
        </button>
      </div>
    );
  }
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`cf-${k}-error`} className="mt-2 text-sm text-destructive">
        <Text value={errors[k]} />
      </p>
    ) : null;
  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border bg-card p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-sm font-medium">
            <Text value={"Nom *"} />
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            className={fieldClass}
            placeholder={t("Votre nom")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
          />
          <Text value={err("name")} />
        </div>
        <div>
          <label htmlFor="cf-company" className="mb-2 block text-sm font-medium">
            <Text value={"Nom de l'entreprise"} />
          </label>
          <input
            id="cf-company"
            name="company"
            autoComplete="organization"
            maxLength={120}
            className={fieldClass}
            placeholder={t("Votre entreprise")}
            aria-invalid={!!errors.company}
          />
          <Text value={err("company")} />
        </div>
        <div>
          <label htmlFor="cf-contact" className="mb-2 block text-sm font-medium">
            <Text value={"Téléphone ou email *"} />
          </label>
          <input
            id="cf-contact"
            name="contact"
            maxLength={160}
            className={fieldClass}
            placeholder={t("Pour vous recontacter")}
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "cf-contact-error" : undefined}
          />
          <Text value={err("contact")} />
        </div>
        <div>
          <label htmlFor="cf-service" className="mb-2 block text-sm font-medium">
            <Text value={"Service souhaité"} />
          </label>
          <select
            id="cf-service"
            name="service"
            defaultValue=""
            className={cn(fieldClass, "appearance-none")}
          >
            <option value="">
              <Text value={"Choisir un service"} />
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                <Text value={s} />
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cf-message" className="mb-2 block text-sm font-medium">
            <Text value={"Description du projet *"} />
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            maxLength={2000}
            className={cn(fieldClass, "resize-y")}
            placeholder={t("Parlez-nous de votre activité et de ce que vous souhaitez…")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "cf-message-error" : undefined}
          />
          <Text value={err("message")} />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">
          <Text
            value={"* Champs obligatoires. Vos informations servent uniquement à vous recontacter."}
          />
          {whatsappLink(whatsapp) && (
            <span className="mt-2 block">
              <Text value="Votre demande s'ouvre dans WhatsApp. Vous confirmez l'envoi." />
            </span>
          )}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-primary py-3.5 ps-7 pe-3.5 font-medium text-primary-foreground transition-all hover:gap-4 disabled:opacity-60"
        >
          <Text
            value={
              status === "sending"
                ? "Envoi en cours…"
                : whatsappLink(whatsapp)
                  ? "Continuer sur WhatsApp"
                  : "Envoyer ma demande"
            }
          />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-clay-foreground">
            {status === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : whatsappLink(whatsapp) ? (
              <MessageCircle className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
export function ContactSection() {
  const t = useT();
  const { data: s } = useSuspenseQuery(settingsQuery);
  const wa = whatsappLink(s.whatsapp, t("Bonjour, je souhaite discuter de mon projet digital."));
  const channels = [
    wa && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Écrire sur WhatsApp",
      href: wa,
      external: true,
    },
    s.email && {
      icon: Mail,
      label: "Email",
      value: s.email,
      href: `mailto:${s.email}`,
      external: false,
    },
    s.phone && {
      icon: Phone,
      label: "Téléphone",
      value: s.phone,
      href: `tel:${s.phone.replace(/\s/g, "")}`,
      external: false,
    },
    s.instagram_url && {
      icon: Instagram,
      label: "Instagram",
      value: "Voir notre Instagram",
      href: s.instagram_url,
      external: true,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href: string;
    external: boolean;
  }[];
  return (
    <section id="contact" className="scroll-mt-24 bg-beige/60 py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-clay" />
            <Text value={"Contact "} />
          </p>
          <h2 className="mt-5 text-balance text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            <Text value={"Et si votre projet était "} />
            <span className="font-display italic text-clay">
              <Text value={"le prochain ?"} />
            </span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            <Text
              value={"Parlons de votre activité et construisons ensemble votre présence digitale. "}
            />
          </p>

          {channels.length > 0 && (
            <ul className="mt-10 space-y-3">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        c.label === "WhatsApp" ? "bg-primary text-primary-foreground" : "bg-sand",
                      )}
                    >
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        <Text value={c.label} />
                      </span>
                      <span className="block font-medium">
                        <Text value={c.value} />
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-clay" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        <Reveal className="lg:col-span-7" delay={120}>
          <ContactForm whatsapp={s.whatsapp} />
        </Reveal>
      </div>
    </section>
  );
}
