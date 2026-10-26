import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const adminProjectsQuery = queryOptions({
  queryKey: ["admin", "projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const adminProjectQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin", "project", id],
    queryFn: async () => {
      const [{ data: project, error }, { data: media, error: mErr }] = await Promise.all([
        supabase.from("projects").select("*").eq("id", id).maybeSingle(),
        supabase.from("project_media").select("*").eq("project_id", id).order("sort_order").order("created_at"),
      ]);
      if (error) throw error;
      if (mErr) throw mErr;
      return { project, media: media ?? [] };
    },
  });

export const adminMessagesQuery = queryOptions({
  queryKey: ["admin", "messages"],
  queryFn: async () => {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const adminSettingsQuery = queryOptions({
  queryKey: ["admin", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*").single();
    if (error) throw error;
    return data;
  },
});

/** Refreshes dashboard data and the public pages after a change. */
export function refreshAll(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ["admin"] });
  qc.invalidateQueries({ queryKey: ["public"] });
}
