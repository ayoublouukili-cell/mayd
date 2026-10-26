import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DemoForm } from "./DemoForm";
import { DEMOS, DEMO_NOTICE } from "@/lib/demonstrations";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Formulaires du showroom", () => {
  it.each(DEMOS)("valide une simulation pour $name sans requête réseau", (demo) => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { container } = render(<DemoForm demo={demo} prefix="test" />);
    const form = container.querySelector("form")!;
    expect(form.checkValidity()).toBe(false);
    fireEvent.change(screen.getByLabelText("Nom fictif"), { target: { value: "Camille Démo" } });
    fireEvent.change(screen.getByLabelText("Email fictif"), {
      target: { value: "camille@example.com" },
    });
    const select = container.querySelector<HTMLSelectElement>('select[name="choice"]')!;
    fireEvent.change(select, { target: { value: select.options[1]!.value } });
    fireEvent.change(container.querySelector('[name="date"]')!, {
      target: { value: "2030-12-20" },
    });
    const end = container.querySelector('[name="end"]');
    if (end) fireEvent.change(end, { target: { value: "2030-12-22" } });
    else {
      const time = container.querySelector<HTMLSelectElement>('[name="time"]')!;
      fireEvent.change(time, { target: { value: time.options[1]!.value } });
    }
    expect(form.checkValidity()).toBe(true);
    fireEvent.submit(form);
    expect(screen.getByRole("status")).toHaveTextContent(DEMO_NOTICE);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("refuse une date de retour antérieure au départ", () => {
    const { container } = render(<DemoForm demo={DEMOS[3]!} prefix="test" />);
    fireEvent.change(screen.getByLabelText("Nom fictif"), { target: { value: "Camille Démo" } });
    fireEvent.change(container.querySelector('[name="date"]')!, {
      target: { value: "2030-12-20" },
    });
    fireEvent.change(container.querySelector('[name="end"]')!, { target: { value: "2030-12-19" } });
    fireEvent.submit(container.querySelector("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent("après la date de départ");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
