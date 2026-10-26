import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn(), rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { signInWithPassword: mocks.signIn, signOut: mocks.signOut },
    rpc: mocks.rpc,
  },
}));
import { AdminLoginForm } from "./AdminLoginForm";

describe("Admin username login", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.signIn.mockResolvedValue({ data: { user: { id: "owner-id" } }, error: null });
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.signOut.mockResolvedValue({ error: null });
  });
  afterEach(cleanup);
  function submit() {
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "test-password" } });
    fireEvent.submit(screen.getByRole("form"));
  }
  it("uses the owner account and only opens the dashboard after verifying the admin role", async () => {
    const success = vi.fn();
    render(<AdminLoginForm onSuccess={success} />);
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    submit();
    await waitFor(() => expect(success).toHaveBeenCalledOnce());
    expect(mocks.signIn).toHaveBeenCalledWith({
      email: "maynd@contact.com",
      password: "test-password",
    });
    expect(mocks.rpc).toHaveBeenCalledWith("has_role", { _user_id: "owner-id", _role: "admin" });
  });
  it("signs out accounts without the admin role", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    const success = vi.fn();
    render(<AdminLoginForm onSuccess={success} />);
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("droits administrateur");
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(success).not.toHaveBeenCalled();
  });
  it("does not send confirmation emails when the account needs activation", async () => {
    mocks.signIn.mockResolvedValue({
      data: { user: null },
      error: { code: "email_not_confirmed" },
    });
    const success = vi.fn();
    render(<AdminLoginForm onSuccess={success} />);
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("activé dans Supabase");
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
  });
  it("rejects a different username", async () => {
    render(<AdminLoginForm onSuccess={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Identifiant"), { target: { value: "other-user" } });
    submit();
    expect(screen.getByRole("alert")).toHaveTextContent("incorrect");
    expect(mocks.signIn).not.toHaveBeenCalled();
  });
});
