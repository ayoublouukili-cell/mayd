import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isStoragePath } from "./site";
import { newId } from "./id";

export const BUCKET = "portfolio";
export const MAX_UPLOAD_MB = 50;

/** Uploads a file to the portfolio bucket and returns its storage path. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(
      `« ${file.name} » dépasse ${MAX_UPLOAD_MB} Mo. Pour une longue vidéo, utilisez plutôt un lien YouTube ou Vimeo.`,
    );
  }
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${newId()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    ...(file.type ? { contentType: file.type } : {}),
    upsert: false,
  });
  if (error) throw new Error(`Échec de l'envoi de « ${file.name} » : ${error.message}`);
  return path;
}

export async function removeMedia(value: string | null | undefined) {
  if (isStoragePath(value)) await supabase.storage.from(BUCKET).remove([value]);
}

/** Resolves a stored media value into a displayable URL for the dashboard. */
export function useMediaUrl(value: string | null | undefined) {
  const q = useQuery({
    queryKey: ["admin", "signed", value],
    enabled: isStoragePath(value),
    staleTime: 50 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(value!, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
  });
  if (!value) return null;
  if (!isStoragePath(value)) return value;
  return q.data ?? null;
}
