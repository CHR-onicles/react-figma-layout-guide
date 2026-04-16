import type { Breakpoint } from "packages/react-figma-layout-guide/src/types/layout";
import { BP_FALLBACKS } from "~/constants";
import type { BpRecord } from "~/types";

export function getInheritLabel(bp: Breakpoint, bps: BpRecord): string {
  const first = BP_FALLBACKS[bp].find(f => bps[f].enabled);
  return first ? `Inherits from ${first}` : "Uses component defaults";
}
