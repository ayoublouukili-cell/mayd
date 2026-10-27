import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  session: vi.fn(),
  otp: vi.fn(),
  rpc: vi.fn(),
}));
vi.mock("@tanstack/react-start", async (original) => ({
  ...(await original<typeof import("@tanstack/react-start")>()),
  useServerFn: () => mocks.confirm,
}));
vi.mock("@/lib/trial-client", () => ({
  getTrialClient: () => ({
    auth: { getSession: mocks.session, signInWithOtp: mocks.otp },
    rpc: mocks.rpc,
  }),
}));
import { TrialOffer } from "./TrialOffer";

describe("Free trial signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, "", "/");
    localStorage.clear();
    mocks.session.mockResolvedValue({ data: { session: null }, error: null });
    mocks.otp.mockResolvedValue({ error: null });
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.confirm.mockResolvedValue({ ok: true });
  });
  afterEach(cleanup);
  function fill() {
    fireEvent.click(screen.getByRole("button", { name: "Profiter de mes 10 jours gratuits" }));
    fireEvent.change(screen.getByLabelText("Nom *"), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "sara@example.com" } });
    fireEvent.change(screen.getByLabelText("Entreprise ou activité *"), {
      target: { value: "Café Sara" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Recevoir mon lien de confirmation" }));
  }
  it("requests a magic link without claiming a lead has already been saved", async () => {
    render(<TrialOffer />);
    fill();
    await screen.findByText("Consultez votre boîte email");
    expect(mocks.otp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sara@example.com",
        options: expect.objectContaining({
          emailRedirectTo: `${window.location.origin}/?trial=confirm`,
        }),
      }),
    );
    expect(mocks.confirm).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Renvoyer le lien/ })).toBeDisabled();
  });
  it("refuses signup if the owner account is not established", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    render(<TrialOffer />);
    fill();
    await screen.findByRole("alert");
    expect(mocks.otp).not.toHaveBeenCalled();
  });
  it.each(["/?trial=confirm", "/#access_token=verified-token&type=magiclink"])(
    "confirms the returned session on the server at %s before showing success",
    async (url) => {
      window.history.replaceState(null, "", url);
      mocks.session.mockResolvedValue({
        data: {
          session: {
            access_token: "verified-token",
            user: {
              email: "sara@example.com",
              user_metadata: {
                trial_request: {
                  name: "Sara",
                  email: "sara@example.com",
                  company: "Café Sara",
                  service: "Création de site web",
                  consent: true,
                },
              },
            },
          },
        },
      });
      render(<TrialOffer />);
      await screen.findByText("Email confirmé, demande reçue !");
      expect(mocks.confirm).toHaveBeenCalledWith({
        data: { accessToken: "verified-token", request: undefined },
      });
      expect(window.location.search).toBe("");
    },
  );
  it("shows expired links as errors without saving a request", async () => {
    window.history.replaceState(null, "", "/#error=access_denied&error_code=otp_expired");
    render(<TrialOffer />);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("expiré"));
    expect(mocks.confirm).not.toHaveBeenCalled();
  });
});
