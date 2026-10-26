import { Text, useT } from "@/lib/i18n/Preferences";
import { useEffect, useRef, useState } from "react";
// A versioned single path also invalidates the formerly cached empty file.
export const OFFICIAL_LOGO_SRC = "/mayd-logo.png?v=81bd1168";
export const DARK_LOGO_SRC = "/mayd-logo-dark.png?v=522bf1fd3e39ce4d";
/** Render the real image in SSR too; text is only a fallback for a failed file. */
export function OfficialLogo({
  name,
  className = "",
  lightSupport = false,
  themeAware = false,
}: {
  name: string;
  className?: string;
  lightSupport?: boolean;
  themeAware?: boolean;
}) {
  const t = useT();
  const [failed, setFailed] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <span
      className={`official-logo inline-flex shrink-0 items-center ${lightSupport ? "rounded-xl bg-paper px-3 py-1 text-ink" : ""}`}
    >
      {failed ? (
        <span className={`font-semibold tracking-[0.13em] ${className}`}>
          <Text value={name} />
        </span>
      ) : (
        <>
          <img
            ref={image}
            src={OFFICIAL_LOGO_SRC}
            alt={t(name)}
            onError={() => setFailed(true)}
            width={2172}
            height={724}
            className={`${themeAware ? "logo-light" : ""} h-auto w-[150px] object-contain md:w-[180px] ${className}`}
          />
          {themeAware && (
            <img
              src={DARK_LOGO_SRC}
              alt={t(name)}
              onError={() => setFailed(true)}
              width={2172}
              height={724}
              className={`logo-dark h-auto w-[150px] object-contain md:w-[180px] ${className}`}
            />
          )}
        </>
      )}
    </span>
  );
}
