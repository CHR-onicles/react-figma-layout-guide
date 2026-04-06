import type {
  Breakpoint,
  ColumnsLayoutType,
  Layout,
  RowsLayoutType,
} from "packages/react-figma-layout-guide/src/types/layout";
import type { MarginUnit } from "~/components/margin-field";

export type BpState = {
  layout: Layout;
  colType: ColumnsLayoutType;
  colWidth: number;
  rowType: RowsLayoutType;
  rowHeight: number;
  size: number;
  count: number;
  gutter: number;
  marginValue: number;
  marginUnit: MarginUnit;
  offsetValue: number;
  offsetUnit: MarginUnit;
};

export type BpRecord = Record<Breakpoint, BpState & { enabled: boolean }>;
