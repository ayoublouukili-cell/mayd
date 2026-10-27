import { describe, expect, it, vi, afterEach } from "vitest";
import { isTrialCallback, trialReturnUrl } from "./trial-callback";

afterEach(() => vi.unstubAllEnvs());
describe("Trial email returns", () => {
  it("recognizes expired and valid links even without a trial query", () => {
    expect(isTrialCallback("", "#error=access_denied&error_code=otp_expired")).toBe(true);
    expect(isTrialCallback("", "#access_token=token&type=magiclink")).toBe(true);
    expect(isTrialCallback("?trial=confirm", "")).toBe(true);
    expect(isTrialCallback("", "#contact")).toBe(false);
  });
  it("uses the allowed production address from temporary deployments", () => {
    vi.stubEnv("DEV", false);
    expect(trialReturnUrl("https://mayd-example.vercel.app")).toBe(
      "https://mayd-jade.vercel.app/?trial=confirm",
    );
  });
});
