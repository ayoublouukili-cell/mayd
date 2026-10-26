import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DARK_LOGO_SRC, OfficialLogo, OFFICIAL_LOGO_SRC } from "./OfficialLogo";

afterEach(cleanup);
describe("Logo partagé", () => {
  it("rend le vrai logo dès le HTML initial, avant le chargement de React", () => {
    const html = renderToString(<OfficialLogo name="MAYD DIGITAL" />);
    expect(html).toContain(`src="${OFFICIAL_LOGO_SRC}"`);
    expect(html).not.toContain("display:none");
    expect(html).toContain("object-contain");
  });
  it("fournit une variante adaptée au thème sans fond décoratif", () => {
    const html = renderToString(<OfficialLogo name="MAYD DIGITAL" themeAware />);
    expect(html).toContain(`src="${OFFICIAL_LOGO_SRC}"`);
    expect(html).toContain(`src="${DARK_LOGO_SRC}"`);
    expect(html).toContain("logo-light");
    expect(html).toContain("logo-dark");
    expect(html).not.toContain("official-logo-bare");
  });
  it("garde un texte accessible seulement si le fichier image échoue", () => {
    render(<OfficialLogo name="MAYD DIGITAL" />);
    fireEvent.error(screen.getByAltText("MAYD DIGITAL"));
    expect(screen.getByText("MAYD DIGITAL")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
