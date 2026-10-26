import { Moon, Sun, Languages } from "lucide-react";
import { usePreferences, useT } from "@/lib/i18n/Preferences";
import type { Language } from "@/lib/i18n/settings";

export function PreferenceControls({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, resolvedTheme, setTheme } = usePreferences();
  const t = useT();
  return (
    <div className={`preference-controls ${mobile ? "preference-controls-mobile" : ""}`}>
      <label className="language-control">
        <Languages size={16} aria-hidden="true" />
        <span className="sr-only">{t("Langue")}</span>
        <select
          aria-label={t("Langue")}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          dir="ltr"
        >
          <option value="fr" lang="fr">
            Français
          </option>
          <option value="ar" lang="ar">
            العربية
          </option>
          <option value="en" lang="en">
            English
          </option>
        </select>
      </label>
      <button
        type="button"
        className="theme-control"
        aria-label={t(
          resolvedTheme === "dark" ? "Passer au thème clair" : "Passer au thème sombre",
        )}
        title={t(resolvedTheme === "dark" ? "Passer au thème clair" : "Passer au thème sombre")}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? (
          <Sun size={17} aria-hidden="true" />
        ) : (
          <Moon size={17} aria-hidden="true" />
        )}
        <span>{t(resolvedTheme === "dark" ? "Clair" : "Sombre")}</span>
      </button>
    </div>
  );
}
