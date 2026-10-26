<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Public pages read data through server functions in `src/lib/public-data.functions.ts` (publishable key, RLS) and `src/lib/queries.ts`; the dashboard under `src/routes/_authenticated/admin` uses the browser client directly. Why: SSR pages get data without a session, admin writes are guarded by RLS + `has_role`.
- Media lives in the private `portfolio` storage bucket (public buckets are blocked on this workspace). DB columns store either a storage path, a site path (`/demo/...`) or an absolute URL; `isStoragePath` decides, and server functions sign paths before returning them. Why: keeps one value format for uploads, demo images and external links.
- The first account ever created becomes the only admin (`assign_first_admin` trigger); every other account has no rights. Why: single-owner portfolio without a manual role step.
- Editable business content (brand name, contact details, portrait, hero screenshots) comes from the single-row `site_settings` table, never hardcoded. Why: the owner edits it from the dashboard.
- Device mockup screens size text with container query units (`cqw`) so they scale with the frame.
