import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { parsePreferences } from "./settings";

// Read-only preferences. No session or production database changes.
export const getVisitorPreferences = createServerFn({ method: "GET" }).handler(() =>
  parsePreferences(getCookie("mayd-language"), getCookie("mayd-theme")),
);
