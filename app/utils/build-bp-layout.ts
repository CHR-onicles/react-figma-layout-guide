import type { LayoutDefault } from "packages/react-figma-layout-guide/src/types/layout";
import type { BpState } from "~/types";

export function buildBpLayout(bp: BpState): LayoutDefault {
  if (bp.layout === "grid") return { layout: "grid", size: bp.size };
  if (bp.layout === "columns") {
    return {
      layout: "columns",
      type: bp.colType,
      width: bp.colWidth,
      count: bp.count,
      gutter: bp.gutter,
      margin: `${bp.marginValue}${bp.marginUnit}`,
      offset: bp.offset,
    };
  }
  return {
    layout: "rows",
    type: bp.rowType,
    height: bp.rowHeight,
    count: bp.count,
    gutter: bp.gutter,
    margin: `${bp.marginValue}${bp.marginUnit}`,
    offset: bp.offset,
  };
}
