import { describe, expect, it } from "vitest";
import { getBreakpoint } from "./get-breakpoint";

describe("getBreakpoint", () => {
  it("returns mobile if 0 < width < 768", () => {
    expect(getBreakpoint(1)).toBe("mobile");
    expect(getBreakpoint(375)).toBe("mobile");
    expect(getBreakpoint(767)).toBe("mobile");
  });
  it("returns tablet if 768 <= width < 1024", () => {
    expect(getBreakpoint(768)).toBe("tablet");
    expect(getBreakpoint(992)).toBe("tablet");
    expect(getBreakpoint(1023)).toBe("tablet");
  });
  it("returns desktop if width >= 1024", () => {
    expect(getBreakpoint(1024)).toBe("desktop");
    expect(getBreakpoint(1440)).toBe("desktop");
  });
  it("throws if width is not defined", () => {
    expect(() => getBreakpoint(null as any)).toThrowError(
      "width is not defined",
    );
    expect(() => getBreakpoint(undefined as any)).toThrowError(
      "width is not defined",
    );
  });
  it("throws if width is NaN", () => {
    expect(() => getBreakpoint(NaN as any)).toThrowError(
      "width must be a valid number",
    );
  });
  it("throws if width is < 1", () => {
    expect(() => getBreakpoint(0)).toThrowError(
      "width must be a positive integer",
    );
    expect(() => getBreakpoint(-2)).toThrowError(
      "width must be a positive integer",
    );
  });
});
