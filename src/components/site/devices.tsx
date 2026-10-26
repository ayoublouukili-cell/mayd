import { Text, useT } from "@/lib/i18n/Preferences";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
/** Realistic laptop frame. Children render inside the 16:10 screen. */
export function LaptopFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("device-surface relative w-full", className)}>
      <div className="relative rounded-[14px] bg-ink p-[2.2%] pb-[3%] shadow-device ring-1 ring-ink/10">
        <div className="absolute left-1/2 top-[1%] h-[0.6%] w-[0.6%] min-h-1 min-w-1 -translate-x-1/2 rounded-full bg-ink-soft" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-card [container-type:inline-size]">
          <Text value={children} />
        </div>
      </div>
      <div className="relative mx-auto h-[10px] w-[112%] -translate-x-[5.4%] rounded-b-[14px] bg-gradient-to-b from-beige to-sand shadow-soft ring-1 ring-ink/5 sm:h-[14px]">
        <div className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-md bg-ink/10" />
      </div>
    </div>
  );
}
/** Modern smartphone frame. Children render inside the 9:19.5 screen. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "device-surface relative rounded-[2.2rem] bg-ink p-[5%] shadow-device ring-1 ring-ink/20",
        className,
      )}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.7rem] bg-card [container-type:inline-size]">
        <div className="absolute left-1/2 top-[1.6%] z-20 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-ink" />
        <Text value={children} />
      </div>
    </div>
  );
}
/** Displays an uploaded screenshot filling a device screen, top-aligned. */
export function ScreenImage({ src, alt }: { src: string; alt: string }) {
  const t = useT();
  return (
    <img
      src={src}
      alt={t(alt)}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}
