import { Text } from "@/lib/i18n/Preferences";
import { cn } from "@/lib/utils";
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-clay" />
      <Text value={"Projet de démonstration "} />
    </span>
  );
}
