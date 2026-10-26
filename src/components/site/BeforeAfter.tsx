import { Text, useT } from "@/lib/i18n/Preferences";
import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const t = useT();
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl bg-beige touch-none"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img
        src={after}
        alt={t("Après")}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={t("Avant")}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-paper">
        <Text value={"Avant"} />
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink">
        <Text value={"Après"} />
      </span>
      <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-lift">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t("Comparer avant et après")}
        className="sr-only"
      />
    </div>
  );
}
