import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminMessagesQuery } from "@/lib/admin-data";
import { whatsappLink } from "@/lib/site";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TRIAL_SERVICE } from "@/lib/trial";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery(adminMessagesQuery);

  async function toggleRead(id: string, is_read: boolean) {
    const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    if (error) {
      toast.error("Modification impossible.");
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    toast.success("Message supprimé");
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }

  const unread = data?.filter((m) => !m.is_read).length ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Messages</h1>
      <p className="mt-2 text-muted-foreground">
        Demandes envoyées depuis le formulaire de contact
        {unread ? ` — ${unread} non lu${unread > 1 ? "s" : ""}` : ""}.
      </p>

      <div className="mt-8 space-y-3">
        {isLoading && [0, 1].map((i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
        {error && <p className="text-destructive">Impossible de charger les messages.</p>}
        {data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-10 text-center text-muted-foreground">
            Aucun message pour le moment.
          </p>
        )}
        {data?.map((m) => {
          const isEmail = /@/.test(m.contact);
          const wa = !isEmail ? whatsappLink(m.contact) : null;
          return (
            <article
              key={m.id}
              className={cn(
                "rounded-3xl border bg-card p-5 md:p-6",
                !m.is_read && "border-clay/40",
              )}
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!m.is_read && (
                      <span className="h-2 w-2 rounded-full bg-clay" aria-label="Non lu" />
                    )}
                    <h2 className="font-medium">{m.name}</h2>
                    {m.service === TRIAL_SERVICE && (
                      <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay">
                        10 jours gratuits · Email confirmé
                      </span>
                    )}
                    {m.company && <span className="text-muted-foreground">· {m.company}</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(m.created_at).toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                    {m.service && ` · ${m.service}`}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toggleRead(m.id, !m.is_read)}
                    className="flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm hover:bg-accent"
                  >
                    {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    {m.is_read ? "Non lu" : "Lu"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-destructive hover:bg-destructive/10"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line">{m.message}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {isEmail ? (
                  <a
                    href={`mailto:${m.contact}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                  >
                    <Mail className="h-4 w-4" /> Répondre à {m.contact}
                  </a>
                ) : (
                  <>
                    <a
                      href={`tel:${m.contact.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                      <Phone className="h-4 w-4" /> Appeler {m.contact}
                    </a>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    )}
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
