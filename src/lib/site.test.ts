import { describe, expect, it } from "vitest";
import { contactSchema, isStoragePath, slugify, toEmbedUrl, whatsappLink } from "./site";

describe("toEmbedUrl", () => {
  it("converts YouTube watch, short and youtu.be links", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123",
    );
    expect(toEmbedUrl("https://youtu.be/xyz789")).toBe(
      "https://www.youtube-nocookie.com/embed/xyz789",
    );
    expect(toEmbedUrl("https://youtube.com/shorts/s1s2")).toBe(
      "https://www.youtube-nocookie.com/embed/s1s2",
    );
  });

  it("converts Vimeo links", () => {
    expect(toEmbedUrl("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456");
  });

  it("refuses other websites", () => {
    expect(toEmbedUrl("https://example.com/video")).toBeNull();
    expect(toEmbedUrl("pas une url")).toBeNull();
  });
});

describe("slugify", () => {
  it("removes accents and spaces", () => {
    expect(slugify("Café de l'Été — Paris")).toBe("cafe-de-l-ete-paris");
  });
});

describe("whatsappLink", () => {
  it("converts Moroccan mobile numbers to the international destination", () => {
    expect(whatsappLink("0688769667")).toBe("https://wa.me/212688769667");
    expect(whatsappLink("+212 688 76 96 67")).toBe("https://wa.me/212688769667");
    expect(whatsappLink("00212 688 76 96 67")).toBe("https://wa.me/212688769667");
  });
  it("preserves accents and message punctuation through URL encoding", () => {
    const message = "Bonjour & merci !\nمشروع café ?";
    expect(new URL(whatsappLink("0688769667", message)!).searchParams.get("text")).toBe(message);
  });
  it("keeps only digits", () => {
    expect(whatsappLink("+33 6 12 34 56 78")).toBe("https://wa.me/33612345678");
  });
  it("returns null when no number is configured", () => {
    expect(whatsappLink("")).toBeNull();
    expect(whatsappLink(null)).toBeNull();
  });
});

describe("isStoragePath", () => {
  it("distinguishes uploaded files from site images and links", () => {
    expect(isStoragePath("projects/a/b.jpg")).toBe(true);
    expect(isStoragePath("/demo/cafe.jpg")).toBe(false);
    expect(isStoragePath("https://x.com/a.jpg")).toBe(false);
  });
});

describe("contact form", () => {
  const valid = {
    name: "Sara",
    company: "",
    contact: "sara@example.com",
    service: "",
    message: "Je voudrais un site pour mon café.",
  };

  it("accepts an email or a phone number", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, contact: "06 12 34 56 78" }).success).toBe(true);
  });

  it("requires a name, a reachable contact and a description", () => {
    expect(contactSchema.safeParse({ ...valid, name: " " }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, contact: "abc" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "court" }).success).toBe(false);
  });
});
