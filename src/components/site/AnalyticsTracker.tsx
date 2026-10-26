import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { newId } from "@/lib/id";

function visitorId() {
  try {
    const stored = localStorage.getItem("mayd-visitor");
    if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stored))
      return stored;
    const id = newId();
    localStorage.setItem("mayd-visitor", id);
    return id;
  } catch {
    return null;
  }
}

export function AnalyticsTracker() {
  const path = useLocation({ select: (location) => location.pathname });
  useEffect(() => {
    if (/^\/(admin|auth)(\/|$)/.test(path)) return;
    const id = visitorId();
    if (!id) return;
    const record = (kind: "pageview" | "click", target = "") => {
      void supabase
        .rpc("track_site_event", {
          p_visitor: id,
          p_kind: kind,
          p_path: path.slice(0, 300),
          p_target: target.slice(0, 300),
        })
        .then(
          () => {},
          () => {},
        );
    };
    // Delay prevents the duplicate mount in React development mode from recording twice.
    const timer = window.setTimeout(() => record("pageview"), 0);
    const click = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!element) return;
      const href = element.getAttribute("href");
      let target =
        element.getAttribute("data-analytics") ||
        element.getAttribute("aria-label") ||
        element.textContent?.trim() ||
        "Bouton";
      if (href) {
        try {
          const url = new URL(href, window.location.origin);
          target =
            url.protocol === "http:" || url.protocol === "https:"
              ? `${url.host}${url.pathname}`
              : url.protocol;
        } catch {
          /* use the button label */
        }
      }
      record("click", target);
    };
    document.addEventListener("click", click, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", click, true);
    };
  }, [path]);
  return null;
}
