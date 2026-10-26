export type Language = "fr" | "ar" | "en";
export type Theme = "system" | "light" | "dark";
export type Preferences = { language: Language; theme: Theme };
export const DEFAULT_PREFERENCES: Preferences = { language: "fr", theme: "system" };
export function parsePreferences(language?: string | null, theme?: string | null): Preferences {
  return {
    language: language === "en" || language === "ar" ? language : "fr",
    theme: theme === "dark" || theme === "light" ? theme : "system",
  };
}
// Runs in <head> before styles are displayed. Never evaluated by the SSR renderer.
export const THEME_BOOTSTRAP = `(function(){var t='system';try{var m=document.cookie.match(/(?:^|; )mayd-theme=(dark|light)/);if(m)t=m[1];else{var s=localStorage.getItem('mayd-theme');if(s==='dark'||s==='light')t=s}}catch(e){}var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'})();`;
