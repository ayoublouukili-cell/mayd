import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("@tanstack/react-start", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-start")>()),
  useServerFn: () => mocks.send,
}));
import { ContactForm } from "./ContactSection";

describe("WhatsApp contact requests", () => {
  beforeEach(() => {
    mocks.send.mockReset().mockResolvedValue({ ok: true });
    vi.spyOn(window, "open").mockReturnValue(null);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  function fillAndSubmit() {
    fireEvent.change(screen.getByLabelText("Nom *"), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText("Nom de l'entreprise"), {
      target: { value: "Café & Co" },
    });
    fireEvent.change(screen.getByLabelText("Téléphone ou email *"), {
      target: { value: "sara@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Service souhaité"), {
      target: { value: "Création de site web" },
    });
    fireEvent.change(screen.getByLabelText("Description du projet *"), {
      target: { value: "Je souhaite un site pour mon café." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuer sur WhatsApp" }));
  }
  it("opens the configured recipient with the full request and keeps a fallback link", async () => {
    render(<ContactForm whatsapp="0688769667" />);
    fillAndSubmit();
    expect(window.open).toHaveBeenCalledOnce();
    const url = new URL(vi.mocked(window.open).mock.calls[0]?.[0] as string);
    expect(url.pathname).toBe("/212688769667");
    const text = url.searchParams.get("text")!;
    for (const value of [
      "Sara",
      "Café & Co",
      "sara@example.com",
      "Création de site web",
      "Je souhaite un site pour mon café.",
    ])
      expect(text).toContain(value);
    const fallback = screen.getByRole("link", { name: "Ouvrir WhatsApp" });
    expect(new URL(fallback.getAttribute("href")!).href).toBe(url.href);
    expect(screen.getByRole("status")).toHaveTextContent("Appuyez sur Envoyer dans WhatsApp");
    expect(screen.queryByText("Merci, message bien reçu.")).not.toBeInTheDocument();
    await waitFor(() => expect(mocks.send).toHaveBeenCalledOnce());
  });
  it("validates the form before opening WhatsApp", () => {
    render(<ContactForm whatsapp="0688769667" />);
    fireEvent.click(screen.getByRole("button", { name: "Continuer sur WhatsApp" }));
    expect(window.open).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
    expect(screen.getByText("Indiquez votre nom")).toBeInTheDocument();
  });
  it("keeps the WhatsApp handoff usable if saving the inbox copy fails", async () => {
    mocks.send.mockRejectedValue(new Error("Storage unavailable"));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<ContactForm whatsapp="0688769667" />);
    fillAndSubmit();
    expect(screen.getByRole("link", { name: "Ouvrir WhatsApp" })).toBeInTheDocument();
    await waitFor(() => expect(console.warn).toHaveBeenCalledOnce());
    expect(window.open).toHaveBeenCalledOnce();
  });
});
