import type { Breakpoint } from "packages/react-figma-layout-guide/src/types/layout";
import type { BpState } from "~/types";

export const DEFAULT_BP: BpState = {
  layout: "columns",
  colType: "stretch",
  colWidth: 80,
  rowType: "stretch",
  rowHeight: 50,
  size: 25,
  count: 12,
  gutter: 20,
  marginValue: 0,
  marginUnit: "%",
  offsetValue: 0,
  offsetUnit: "%",
};

export const BP_SIZE_HINT: Record<Breakpoint, string> = {
  mobile: "< 768px",
  tablet: "768 – 1023px",
  desktop: "≥ 1024px",
};

export const BP_FALLBACKS: Record<Breakpoint, Breakpoint[]> = {
  mobile: [],
  tablet: ["mobile"],
  desktop: ["tablet", "mobile"],
};
