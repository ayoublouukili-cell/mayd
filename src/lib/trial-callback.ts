// Supabase may fall back to Site URL and omit the requested query string.
export function isTrialCallback(search: string, hash: string) {
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  return (
    new URLSearchParams(search).get("trial") === "confirm" ||
    fragment.has("error") ||
    fragment.has("access_token")
  );
}

export function trialReturnUrl(origin: string) {
  return new URL("/?trial=confirm", import.meta.env.DEV ? origin : "https://mayd-jade.vercel.app")
    .href;
}
