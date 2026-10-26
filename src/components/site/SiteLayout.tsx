import { Text } from "@/lib/i18n/Preferences";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnalyticsTracker } from "./AnalyticsTracker";
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsTracker />
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        <Text value={"Aller au contenu "} />
      </a>
      <Header />
      <main id="contenu" className="flex-1 animate-in fade-in duration-700">
        <Text value={children} />
      </main>
      <Footer />
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className ?? ""}`}
    >
      {eyebrow && (
        <p
          className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="h-px w-8 bg-clay" />
          <Text value={eyebrow} />
        </p>
      )}
      <h2 className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
        <Text value={title} />
      </h2>
      {subtitle && (
        <p
          className={`mt-6 max-w-2xl text-pretty text-lg text-muted-foreground ${align === "center" ? "mx-auto" : ""}`}
        >
          <Text value={subtitle} />
        </p>
      )}
    </div>
  );
}
