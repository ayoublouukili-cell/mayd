import { describe, expect, it } from "vitest";
import { phoneShowcaseFrame } from "./phone-showcase";

describe("Scroll-driven phone projects", () => {
  it("shows a new project at every full revolution", () => {
    for (let i = 0; i < 4; i++) {
      expect(phoneShowcaseFrame(i / 3, 4)).toEqual({ rotation: i * 360, index: i });
    }
  });
  it("switches projects while the rear face hides the screen", () => {
    expect(phoneShowcaseFrame(179 / 1080, 4).index).toBe(0);
    expect(phoneShowcaseFrame(180 / 1080, 4).index).toBe(1);
    expect(phoneShowcaseFrame(539 / 1080, 4).index).toBe(1);
    expect(phoneShowcaseFrame(540 / 1080, 4).index).toBe(2);
  });
  it("clamps overscroll and handles a single project", () => {
    expect(phoneShowcaseFrame(-1, 4)).toEqual({ rotation: 0, index: 0 });
    expect(phoneShowcaseFrame(2, 4)).toEqual({ rotation: 1080, index: 3 });
    expect(phoneShowcaseFrame(0.8, 1)).toEqual({ rotation: 0, index: 0 });
  });
});
