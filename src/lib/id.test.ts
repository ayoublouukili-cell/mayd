import { afterEach, expect, it, vi } from "vitest";
import { newId } from "./id";
afterEach(() => vi.unstubAllGlobals());
it("generates UUIDs on HTTP LAN addresses without crypto.randomUUID", () => {
  vi.stubGlobal("crypto", { getRandomValues: (bytes: Uint8Array) => bytes.fill(7) });
  expect(newId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
