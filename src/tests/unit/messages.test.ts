import { describe, it, expect } from "vitest";
import { t } from "@/lib/messages";
import type { MessageMap } from "@/lib/messages";

describe("messages.t()", () => {
  const messages: MessageMap = {
    nav: {
      home: "Home",
      about: "Over ons"
    },
    hero: {
      title: "Welkom"
    },
    flat: "Directe waarde"
  };

  it("resolves a top-level flat key", () => {
    expect(t(messages, "flat")).toBe("Directe waarde");
  });

  it("resolves a nested key with dot notation", () => {
    expect(t(messages, "nav.home")).toBe("Home");
    expect(t(messages, "nav.about")).toBe("Over ons");
    expect(t(messages, "hero.title")).toBe("Welkom");
  });

  it("returns the key when it does not exist", () => {
    expect(t(messages, "nav.contact")).toBe("nav.contact");
    expect(t(messages, "missing")).toBe("missing");
  });

  it("returns the key when an intermediate node is a string", () => {
    expect(t(messages, "flat.sub")).toBe("flat.sub");
  });
});
