import { act, fireEvent, render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ path: "/", rpc: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ useLocation: () => mocks.path }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc: mocks.rpc } }));
import { AnalyticsTracker } from "./AnalyticsTracker";

describe("Public analytics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.path = "/";
    mocks.rpc.mockReset().mockResolvedValue({ error: null });
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("records a page view and reuses the browser visitor id", () => {
    const first = render(<AnalyticsTracker />);
    act(() => vi.runAllTimers());
    const visitor = mocks.rpc.mock.calls[0]?.[1].p_visitor;
    expect(visitor).toBeTruthy();
    first.unmount();
    mocks.path = "/services";
    render(<AnalyticsTracker />);
    act(() => vi.runAllTimers());
    expect(mocks.rpc).toHaveBeenLastCalledWith(
      "track_site_event",
      expect.objectContaining({ p_visitor: visitor, p_kind: "pageview", p_path: "/services" }),
    );
  });

  it("excludes admin and authentication paths", () => {
    mocks.path = "/admin/projets/123";
    const view = render(<AnalyticsTracker />);
    act(() => vi.runAllTimers());
    view.unmount();
    mocks.path = "/auth";
    render(<AnalyticsTracker />);
    act(() => vi.runAllTimers());
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("tracks nested link clicks without collecting URL queries or fragments", () => {
    const view = render(
      <>
        <AnalyticsTracker />
        <a href="https://example.com/work?token=private#secret">
          <span>Voir</span>
        </a>
      </>,
    );
    fireEvent.click(view.getByText("Voir"));
    expect(mocks.rpc).toHaveBeenCalledWith(
      "track_site_event",
      expect.objectContaining({ p_kind: "click", p_target: "example.com/work" }),
    );
  });
});
