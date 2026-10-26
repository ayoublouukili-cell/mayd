import { Text } from "@/lib/i18n/Preferences";
import {
  MessageCircle,
  Play,
  Search,
  ThumbsUp,
  Share2,
  Home,
  PlusSquare,
  User,
  Grid3x3,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
/*
 * Illustrative screens shown inside device mockups until real screenshots are
 * uploaded from the dashboard. They show "Votre entreprise" on purpose: they
 * illustrate what a client could get, they are not presented as client work.
 */
const PHOTOS = ["/demo/cafe.jpg", "/demo/beaute.jpg", "/demo/restaurant.jpg", "/demo/boutique.jpg"];
function Photo({ i, pos = "center", className }: { i: number; pos?: string; className?: string }) {
  return (
    <div
      className={cn("bg-beige bg-cover", className)}
      style={{ backgroundImage: `url(${PHOTOS[i % PHOTOS.length]})`, backgroundPosition: pos }}
    />
  );
}
export function MockWebsite({ animated = false }: { animated?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-card text-[1.5cqw] text-foreground">
      <div className={cn("w-full", animated && "animate-screen-scroll")}>
        <div className="flex items-center justify-between border-b px-[5%] py-[2.5%]">
          <span className="font-display text-[1.6em] italic">
            <Text value={"Maison Lumière"} />
          </span>
          <div className="hidden gap-[1.2em] text-muted-foreground sm:flex">
            <span>
              <Text value={"Carte"} />
            </span>
            <span>
              <Text value={"L'atelier"} />
            </span>
            <span>
              <Text value={"Contact"} />
            </span>
          </div>
          <span className="rounded-full bg-primary px-[1em] py-[0.4em] text-primary-foreground">
            <Text value={"Réserver"} />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[4%] px-[5%] py-[6%]">
          <div className="flex flex-col justify-center gap-[0.8em]">
            <span className="eyebrow !text-[0.8em]">
              <Text value={"Café · Pâtisserie"} />
            </span>
            <span className="font-display text-[3.4em] leading-[0.95]">
              <Text value={"Le goût des matins lents."} />
            </span>
            <span className="text-muted-foreground">
              <Text value={"Café de spécialité, pâtisseries maison et ambiance chaleureuse."} />
            </span>
            <span className="mt-[0.5em] w-fit rounded-full bg-clay px-[1.2em] py-[0.5em] text-clay-foreground">
              <Text value={"Voir la carte"} />
            </span>
          </div>
          <Photo i={0} pos="70% 40%" className="aspect-[4/5] rounded-[0.8em]" />
        </div>
        <div className="grid grid-cols-3 gap-[3%] px-[5%] pb-[6%]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-[0.5em]">
              <Photo i={n} pos={`${n * 25}% 50%`} className="aspect-square rounded-[0.6em]" />
              <div className="h-[0.6em] w-3/4 rounded bg-beige" />
              <div className="h-[0.6em] w-1/2 rounded bg-sand" />
            </div>
          ))}
        </div>
        <div className="mx-[5%] mb-[6%] rounded-[0.8em] bg-ink px-[5%] py-[5%] text-paper">
          <span className="font-display text-[2.4em]">
            <Text value={"Passez nous voir."} />
          </span>
          <div className="mt-[0.6em] text-paper/60">
            <Text value={"Du mardi au dimanche"} />
          </div>
        </div>
      </div>
    </div>
  );
}
function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-[8%] pt-[5%] pb-[2%] text-[0.9em] font-semibold",
        dark && "text-paper",
      )}
    >
      <span>
        <Text value={"9:41"} />
      </span>
      <span className="flex gap-[0.3em]">
        <span className="h-[0.7em] w-[1.4em] rounded-sm bg-current opacity-80" />
      </span>
    </div>
  );
}
export function MockInstagram({
  handle = "votre.entreprise",
  name = "Votre entreprise",
}: {
  handle?: string;
  name?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-card text-[3.1cqw] text-foreground">
      <StatusBar />
      <div className="flex items-center justify-between px-[6%] py-[2%] text-[1.2em] font-semibold">
        <span>
          <Text value={handle} />
        </span>
        <span className="tracking-widest">
          <Text value={"···"} />
        </span>
      </div>
      <div className="flex items-center gap-[6%] px-[6%] py-[3%]">
        <div className="rounded-full bg-gradient-to-tr from-clay to-beige p-[2%]">
          <div className="flex aspect-square w-[5.2em] items-center justify-center rounded-full border-2 border-card bg-ink font-display text-[1.6em] italic text-paper">
            <Text value={name.charAt(0)} />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-3 text-center">
          {[
            ["48", "publications"],
            ["Abonnés", ""],
            ["Suivis", ""],
          ].map(([a, b], i) => (
            <div key={i}>
              <div className="text-[1.15em] font-semibold">
                <Text value={i === 0 ? a : "—"} />
              </div>
              <div className="text-[0.85em] text-muted-foreground">
                <Text value={i === 0 ? b : a} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-[0.2em] px-[6%] leading-snug">
        <div className="font-semibold">
          <Text value={name} />
        </div>
        <div className="text-muted-foreground">
          <Text value={"Café · Pâtisserie maison"} />
        </div>
        <div>
          <Text value={"Ouvert du mardi au dimanche ☕"} />
        </div>
        <div className="text-clay">
          <Text value={"votre-site.fr"} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[2%] px-[6%] py-[3%]">
        <span className="rounded-md bg-primary py-[0.6em] text-center font-semibold text-primary-foreground">
          <Text value={"Contacter"} />
        </span>
        <span className="rounded-md bg-sand py-[0.6em] text-center font-semibold">
          <Text value={"Itinéraire"} />
        </span>
      </div>
      <div className="flex gap-[4%] px-[6%] pb-[3%]">
        {["Carte", "Lieu", "Avis", "Infos"].map((h, i) => (
          <div key={h} className="flex flex-col items-center gap-[0.3em]">
            <Photo
              i={i}
              pos={`${20 + i * 20}% 50%`}
              className="aspect-square w-[4.2em] rounded-full ring-1 ring-border ring-offset-2 ring-offset-card"
            />
            <span className="text-[0.8em]">
              <Text value={h} />
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-around border-t py-[2%] text-muted-foreground">
        <Grid3x3 className="h-[1.6em] w-[1.6em] text-foreground" />
        <Play className="h-[1.6em] w-[1.6em]" />
        <Bookmark className="h-[1.6em] w-[1.6em]" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[1px] content-start">
        {Array.from({ length: 12 }).map((_, i) => (
          <Photo
            key={i}
            i={i}
            pos={`${(i * 37) % 100}% ${(i * 53) % 100}%`}
            className="aspect-square"
          />
        ))}
      </div>
      <div className="mt-auto flex justify-around border-t bg-card py-[3%]">
        <Home className="h-[1.6em] w-[1.6em]" />
        <Search className="h-[1.6em] w-[1.6em]" />
        <PlusSquare className="h-[1.6em] w-[1.6em]" />
        <User className="h-[1.6em] w-[1.6em]" />
      </div>
    </div>
  );
}
export function MockFacebook({ name = "Votre entreprise" }: { name?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-sand text-[3.1cqw] text-foreground">
      <div className="bg-card">
        <StatusBar />
        <Photo i={2} pos="50% 30%" className="aspect-[16/9] w-full" />
        <div className="-mt-[9%] px-[6%]">
          <div className="flex aspect-square w-[7em] items-center justify-center rounded-full border-[3px] border-card bg-ink font-display text-[2.2em] italic text-paper">
            <Text value={name.charAt(0)} />
          </div>
        </div>
        <div className="px-[6%] pb-[4%] pt-[2%]">
          <div className="text-[1.6em] font-bold leading-tight">
            <Text value={name} />
          </div>
          <div className="text-muted-foreground">
            <Text value={"Restaurant · Cuisine maison"} />
          </div>
          <div className="mt-[3%] grid grid-cols-2 gap-[3%]">
            <span className="rounded-md bg-primary py-[0.7em] text-center font-semibold text-primary-foreground">
              <Text value={"Réserver"} />
            </span>
            <span className="rounded-md bg-sand py-[0.7em] text-center font-semibold">
              <Text value={"Message"} />
            </span>
          </div>
          <div className="mt-[4%] flex gap-[6%] border-t pt-[3%] font-semibold text-muted-foreground">
            <span className="text-foreground underline decoration-clay decoration-2 underline-offset-4">
              <Text value={"Publications"} />
            </span>
            <span>
              <Text value={"À propos"} />
            </span>
            <span>
              <Text value={"Photos"} />
            </span>
          </div>
        </div>
      </div>
      <div className="mt-[2%] flex-1 bg-card px-[6%] py-[4%]">
        <div className="flex items-center gap-[3%]">
          <div className="aspect-square w-[3em] rounded-full bg-ink" />
          <div>
            <div className="font-semibold">
              <Text value={name} />
            </div>
            <div className="text-[0.85em] text-muted-foreground">
              <Text value={"Menu de la semaine"} />
            </div>
          </div>
        </div>
        <div className="mt-[3%] leading-snug">
          <Text value={"Nouveau menu du midi à découvrir dès lundi. Réservations ouvertes."} />
        </div>
        <Photo i={2} pos="20% 80%" className="mt-[3%] aspect-[4/3] w-full rounded-md" />
        <div className="mt-[3%] flex justify-around border-t pt-[3%] text-muted-foreground">
          <ThumbsUp className="h-[1.5em] w-[1.5em]" />
          <MessageCircle className="h-[1.5em] w-[1.5em]" />
          <Share2 className="h-[1.5em] w-[1.5em]" />
        </div>
      </div>
    </div>
  );
}
export function MockTikTok({ handle = "@votre.entreprise" }: { handle?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink text-[3.1cqw] text-paper">
      <StatusBar dark />
      <div className="flex flex-col items-center gap-[0.4em] px-[6%] py-[3%] text-center">
        <div className="flex aspect-square w-[6em] items-center justify-center rounded-full bg-paper font-display text-[2em] italic text-ink">
          <Text value={"V "} />
        </div>
        <div className="text-[1.2em] font-semibold">
          <Text value={handle} />
        </div>
        <div className="flex gap-[1.5em] text-paper/70">
          <span>
            <b className="text-paper">
              <Text value={"24"} />
            </b>
            <Text value={" vidéos"} />
          </span>
        </div>
        <span className="mt-[0.4em] rounded-md bg-clay px-[2.4em] py-[0.6em] font-semibold text-clay-foreground">
          <Text value={"Suivre"} />
        </span>
        <div className="text-paper/70">
          <Text value={"Nouveautés chaque semaine ✨"} />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[1px] content-start">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative">
            <Photo i={3 - (i % 4)} pos={`${(i * 31) % 100}% 40%`} className="aspect-[3/4]" />
            <span className="absolute bottom-[4%] left-[6%] flex items-center gap-[0.2em] text-[0.85em] font-semibold drop-shadow">
              <Play className="h-[1em] w-[1em] fill-current" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
