// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";
import { createLocalBackend } from "./local/backend.mjs";

const localAdmin: Plugin = {
  name: "mayd-local-admin",
  apply: "serve",
  async configureServer(server) {
    if (loadEnv(server.config.mode, process.cwd(), "")["VITE_LOCAL_ADMIN"] !== "true") return;
    server.middlewares.use(await createLocalBackend());
  },
};

export default defineConfig({
  plugins: [localAdmin],
  vite: {
    server: { fs: { deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/.mayd-local/**"] } },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
