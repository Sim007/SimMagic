import { describe, it, expect } from "vitest";
import {
  locales,
  defaultLocale,
  isLocale,
  fallbackLocale,
  getOppositeLocale
} from "@/lib/i18n";

describe("i18n", () => {
  describe("locales", () => {
    it("contains nl and en", () => {
      expect(locales).toContain("nl");
      expect(locales).toContain("en");
      expect(locales).toHaveLength(2);
    });
  });

  describe("defaultLocale", () => {
    it("is nl", () => {
      expect(defaultLocale).toBe("nl");
    });
  });

  describe("isLocale", () => {
    it("returns true for valid locales", () => {
      expect(isLocale("nl")).toBe(true);
      expect(isLocale("en")).toBe(true);
    });

    it("returns false for invalid values", () => {
      expect(isLocale("fr")).toBe(false);
      expect(isLocale("")).toBe(false);
      expect(isLocale("NL")).toBe(false);
    });
  });

  describe("fallbackLocale", () => {
    it("returns the locale when valid", () => {
      expect(fallbackLocale("nl")).toBe("nl");
      expect(fallbackLocale("en")).toBe("en");
    });

    it("falls back to defaultLocale for invalid input", () => {
      expect(fallbackLocale("fr")).toBe(defaultLocale);
      expect(fallbackLocale("")).toBe(defaultLocale);
      expect(fallbackLocale(undefined)).toBe(defaultLocale);
    });
  });

  describe("getOppositeLocale", () => {
    it("returns en for nl", () => {
      expect(getOppositeLocale("nl")).toBe("en");
    });

    it("returns nl for en", () => {
      expect(getOppositeLocale("en")).toBe("nl");
    });
  });
});
