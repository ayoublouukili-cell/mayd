import { Text, useT, usePreferences } from "@/lib/i18n/Preferences";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Instagram, Facebook, Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Demo } from "@/lib/demonstrations";
import { SocialExperience } from "./SocialExperience";
import { DemoWebsite, DemoCta } from "./DemoWebsite";
import { BrandExperience } from "./BrandExperience";
import type { DemoPlatform } from "@/lib/showroom-catalog";
export function DemoExperience({
  demo,
  platform,
  onPlatformChange,
}: {
  demo: Demo;
  platform: DemoPlatform;
  onPlatformChange: (value: string) => void;
}) {
  const t = useT();
  const { language } = usePreferences();
  return (
    <div className="demo-experience">
      <header className="container-x pb-10 pt-28 md:pt-36">
        <Link
          to="/demonstrations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft size={16} />
          <Text value={"Toutes les démonstrations "} />
        </Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="concept-badge !border-foreground/20 !bg-beige !text-foreground">
              <Text value={"Concept de démonstration "} />
            </span>
            <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
              <Text value={demo.name} />
            </h1>
            <p className="mt-3 text-muted-foreground">
              <Text value={demo.sector} />
              <Text value={"· Entreprise fictive imaginée par MAYD DIGITAL "} />
            </p>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            <Text
              value={"Une même entreprise, cinq façons de donner vie à sa présence digitale."}
            />
          </p>
        </div>
      </header>
      <Tabs
        dir={language === "ar" ? "rtl" : "ltr"}
        value={platform}
        onValueChange={onPlatformChange}
        className="pb-0"
      >
        <div className="container-x">
          <TabsList aria-label={t(`Plateformes de ${demo.name}`)} className="demo-tabs">
            <TabsTrigger value="instagram">
              <Instagram size={16} />
              <Text value={"Instagram "} />
            </TabsTrigger>
            <TabsTrigger value="facebook">
              <Facebook size={16} />
              <Text value={"Facebook "} />
            </TabsTrigger>
            <TabsTrigger value="tiktok">
              <span>
                <Text value={"♪"} />
              </span>
              <Text value={"TikTok "} />
            </TabsTrigger>
            <TabsTrigger value="site" data-platform="site">
              <Globe size={16} />
              <Text value={"Site web "} />
            </TabsTrigger>
            <TabsTrigger value="identite">
              <Text value="Identité visuelle" />
            </TabsTrigger>
          </TabsList>
        </div>
        {(["instagram", "facebook", "tiktok"] as const).map((platform) => (
          <TabsContent key={platform} value={platform} className="container-x !mt-0 py-12">
            <SocialExperience demo={demo} platform={platform} />
          </TabsContent>
        ))}
        <TabsContent value="site" className="container-x !mt-0 py-10">
          <div className="demo-website-preview-heading">
            <div>
              <h2 className="text-xl font-medium">
                <Text value={"Un site à explorer, pas une simple image."} />
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                <Text
                  value={
                    "Catalogue, galerie et formulaire simulé : essayez les interactions ci-dessous. "
                  }
                />
              </p>
            </div>
            <Link
              to="/demonstrations/$sector/site"
              params={{ sector: demo.slug }}
              className="demo-primary"
            >
              <Text value={"Explorer en page complète "} />
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="demo-browser">
            <div className="demo-browser-bar">
              <span>
                <Text value={"● ● ●"} />
              </span>
              <span>
                <Text value={demo.name} />
                <Text value={"· Site de démonstration"} />
              </span>
              <span>
                <Text value={"↗"} />
              </span>
            </div>
            <DemoWebsite demo={demo} />
          </div>
        </TabsContent>
        <TabsContent value="identite" className="container-x !mt-0 py-10">
          <BrandExperience demo={demo} />
        </TabsContent>
      </Tabs>
      <DemoCta />
    </div>
  );
}
