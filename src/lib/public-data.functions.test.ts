import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ response: { data: null as unknown, error: null as unknown } }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const builder = {
      inputValidator: () => builder,
      handler: (handler: unknown) => handler,
    };
    return builder;
  },
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        order: () => query,
        maybeSingle: () => Promise.resolve(mocks.response),
        then: (resolve: (value: typeof mocks.response) => unknown) =>
          Promise.resolve(mocks.response).then(resolve),
      };
      return query;
    },
  }),
}));
import { getSiteSettings, listPublishedProjects } from "./public-data.functions";

describe("Public pages during a database outage", () => {
  beforeEach(() => {
    mocks.response = { data: null, error: null };
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("keeps the page available and distinguishes an outage from an empty portfolio", async () => {
    mocks.response = { data: null, error: { message: "TypeError: fetch failed" } };
    await expect(listPublishedProjects()).resolves.toEqual({ projects: [], available: false });
  });
  it("reports a successful empty portfolio as available", async () => {
    mocks.response = { data: [], error: null };
    await expect(listPublishedProjects()).resolves.toEqual({ projects: [], available: true });
  });
  it("preserves projects when the database is available", async () => {
    const projects = [{ id: "project-1", title: "Published project", cover_url: "/demo/cafe.jpg" }];
    mocks.response = { data: projects, error: null };
    await expect(listPublishedProjects()).resolves.toEqual({ projects, available: true });
  });
  it("keeps basic site settings available during an outage", async () => {
    mocks.response = { data: null, error: { message: "TypeError: fetch failed" } };
    const settings = await getSiteSettings();
    expect(settings.brand_name).toBe("MAYD");
    expect(settings.email).toBeNull();
  });
});
