import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trialSchema, TRIAL_SERVICE } from "./trial";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), insert: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const builder = { inputValidator: () => builder, handler: (handler: unknown) => handler };
    return builder;
  },
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: { getUser: mocks.getUser },
    from: () => ({ insert: mocks.insert }),
  }),
}));
import { confirmTrialRequest } from "./public-data.functions";

const request = {
  name: "Sara",
  email: "sara@example.com",
  company: "Café Sara",
  service: "Création de site web" as const,
  consent: true as const,
};
const user = {
  id: "11111111-1111-4111-8111-111111111111",
  email: request.email,
  email_confirmed_at: "2026-10-26",
  user_metadata: { trial_request: request },
};
// Server-function builder is replaced by its handler for these integration-boundary tests.
const confirm = confirmTrialRequest as unknown as (input: {
  data: { accessToken: string; request?: typeof request };
}) => Promise<unknown>;
describe("Verified promotional requests", () => {
  beforeEach(() => {
    mocks.getUser.mockReset().mockResolvedValue({ data: { user }, error: null });
    mocks.insert.mockReset().mockResolvedValue({ error: null });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());
  it("requires consent and a real email address", () => {
    expect(trialSchema.safeParse({ ...request, consent: false }).success).toBe(false);
    expect(trialSchema.safeParse({ ...request, email: "0612345678" }).success).toBe(false);
    expect(trialSchema.parse({ ...request, email: " SARA@EXAMPLE.COM " }).email).toBe(
      request.email,
    );
  });
  it("rejects an invalid token before writing a lead", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: { message: "Invalid JWT" } });
    await expect(confirm({ data: { accessToken: "forged", request } })).rejects.toThrow(
      "Confirmez votre email",
    );
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("rejects an unconfirmed email and a different verified address", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { ...user, email_confirmed_at: null } },
      error: null,
    });
    await expect(confirm({ data: { accessToken: "token", request } })).rejects.toThrow(
      "Confirmez votre email",
    );
    mocks.getUser.mockResolvedValue({
      data: { user: { ...user, email: "other@example.com" } },
      error: null,
    });
    await expect(confirm({ data: { accessToken: "token", request } })).rejects.toThrow(
      "Utilisez le lien",
    );
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("saves a verified request from metadata, using the verified email and a stable id", async () => {
    await expect(confirm({ data: { accessToken: "token" } })).resolves.toEqual({ ok: true });
    expect(mocks.getUser).toHaveBeenCalledWith("token");
    expect(mocks.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        contact: request.email,
        service: TRIAL_SERVICE,
        is_read: false,
      }),
    );
    expect(mocks.insert.mock.calls[0]?.[0].message).toContain(request.service);
  });
  it("accepts retries without duplicating a request, but surfaces storage failures", async () => {
    mocks.insert.mockResolvedValue({ error: { code: "23505" } });
    await expect(confirm({ data: { accessToken: "token", request } })).resolves.toEqual({
      ok: true,
    });
    mocks.insert.mockResolvedValue({ error: { code: "42501" } });
    await expect(confirm({ data: { accessToken: "token", request } })).rejects.toThrow(
      "enregistrée",
    );
  });
});
