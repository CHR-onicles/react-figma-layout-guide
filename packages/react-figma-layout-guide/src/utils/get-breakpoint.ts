import type { Breakpoint } from "../types/layout";

export function getBreakpoint(width: number): Breakpoint {
  if (width == null) throw new Error("width is not defined");
  if (Number.isNaN(width)) throw new Error("width must be a valid number");
  if (width < 1) throw new Error("width must be a positive integer");

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
