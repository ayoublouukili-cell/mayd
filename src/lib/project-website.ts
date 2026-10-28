import { findDemo } from "./demonstrations";
import type { PublicProject } from "./public-data.functions";

export function projectWebsite(project: Pick<PublicProject, "slug" | "is_demo" | "external_url">) {
  if (project.external_url) return project.external_url;
  if (project.is_demo && findDemo(project.slug)) return `/demonstrations/${project.slug}/site`;
  return null;
}
