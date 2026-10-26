import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import { DEFAULT_PREFERENCES, type Language, type Preferences, type Theme } from "./settings";
import { translate } from "./translate";

type Value = Preferences & {
  resolvedTheme: "light" | "dark";
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
};
const Context = createContext<Value>({
  ...DEFAULT_PREFERENCES,
  resolvedTheme: "light",
  setLanguage: () => {},
  setTheme: () => {},
});
function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage can be disabled. Cookie still supports SSR. */
  }
  document.cookie = `${key}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
export function PreferencesProvider({
  initial = DEFAULT_PREFERENCES,
  children,
}: {
  initial?: Preferences;
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState(initial.language);
  const [theme, setThemeState] = useState(initial.theme);
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    // Cookies make SSR exact; storage is a fallback if cookies are disabled.
    try {
      const savedLanguage = localStorage.getItem("mayd-language");
      const savedTheme = localStorage.getItem("mayd-theme");
      if (
        !document.cookie.includes("mayd-language=") &&
        (savedLanguage === "ar" || savedLanguage === "en" || savedLanguage === "fr")
      )
        setLanguageState(savedLanguage);
      if (
        !document.cookie.includes("mayd-theme=") &&
        (savedTheme === "dark" || savedTheme === "light")
      )
        setThemeState(savedTheme);
    } catch {
      /* In-memory controls remain usable with storage disabled. */
    }
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  useEffect(() => {
    // Resolve the system preference directly here to avoid an initial light pass.
    let effective = theme;
    if (effective === "system") {
      try {
        const saved = localStorage.getItem("mayd-theme");
        if (saved === "light" || saved === "dark") effective = saved;
      } catch {}
    }
    const dark =
      effective === "dark" ||
      (effective === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [theme, systemDark]);
  const value = useMemo<Value>(
    () => ({
      language,
      theme,
      resolvedTheme,
      setLanguage(next) {
        save("mayd-language", next);
        setLanguageState(next);
      },
      setTheme(next) {
        save("mayd-theme", next);
        setThemeState(next);
      },
    }),
    [language, theme, resolvedTheme],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function usePreferences() {
  return useContext(Context);
}
export function useT() {
  const { language } = usePreferences();
  return useMemo(
    () =>
      function t<T>(value: T): T {
        return (typeof value === "string" ? translate(language, value) : value) as T;
      },
    [language],
  );
}
/** Translate strings; leave original React nodes, database fallbacks and brands intact. */
export function Text({ value }: { value: ReactNode }) {
  const t = useT();
  return typeof value === "string" ? t(value) : value;
}
export function Count({
  value,
  kind,
}: {
  value: number;
  kind: "projects" | "results" | "existing" | "concepts";
}) {
  const { language } = usePreferences();
  if (language === "ar")
    return (
      <span>
        {
          {
            projects: "عدد المشاريع المعروضة",
            results: "عدد النتائج",
            existing: "المشاريع الموجودة",
            concepts: "التصورات التجريبية",
          }[kind]
        }
        : <bdi>{value}</bdi>
      </span>
    );
  const label =
    language === "en"
      ? {
          projects: value === 1 ? "project shown" : "projects shown",
          results: value === 1 ? "result" : "results",
          existing: value === 1 ? "existing project" : "existing projects",
          concepts: value === 1 ? "concept" : "concepts",
        }[kind]
      : {
          projects: value > 1 ? "projets affichés" : "projet affiché",
          results: value > 1 ? "résultats" : "résultat",
          existing: value > 1 ? "projets existants" : "projet existant",
          concepts: value > 1 ? "concepts" : "concept",
        }[kind];
  return (
    <span>
      {value} {label}
    </span>
  );
}
export function useFormMessages() {
  const t = useT();
  return {
    onInvalid(event: FormEvent<HTMLFormElement>) {
      const field = event.target as HTMLInputElement;
      field.setCustomValidity("");
      const v = field.validity;
      field.setCustomValidity(
        t(
          v.valueMissing
            ? "Champ obligatoire."
            : v.typeMismatch
              ? "Indiquez un email valide."
              : v.tooShort
                ? "Minimum deux caractères."
                : v.rangeUnderflow
                  ? "Choisissez une date à partir d’aujourd’hui."
                  : "Valeur invalide.",
        ),
      );
    },
    onInput(event: FormEvent<HTMLFormElement>) {
      (event.target as HTMLInputElement).setCustomValidity?.("");
    },
  };
}
