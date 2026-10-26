import { queryOptions } from "@tanstack/react-query";
import { getProjectBySlug, getSiteSettings, listPublishedProjects } from "./public-data.functions";

export const settingsQuery = queryOptions({
  queryKey: ["public", "settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 5 * 60 * 1000,
});

export const projectsQuery = queryOptions({
  queryKey: ["public", "projects"],
  queryFn: () => listPublishedProjects(),
  staleTime: 60 * 1000,
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
    staleTime: 60 * 1000,
  });
