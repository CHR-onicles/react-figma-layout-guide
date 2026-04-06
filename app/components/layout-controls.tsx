import type { BpState } from "~/types";
import { SectionHeading } from "./section-heading";
import type {
  ColumnsLayoutType,
  Layout,
  RowsLayoutType,
} from "packages/react-figma-layout-guide/src/types/layout";
import { SliderField } from "./slider-field";
import { TypeButtonGroup } from "./type-button-group";
import { MarginField } from "./margin-field";

interface LayoutControlsProps {
  state: BpState;
  onChange: (updates: Partial<BpState>) => void;
}

export function LayoutControls({ state, onChange }: LayoutControlsProps) {
  const {
    layout,
    colType,
    colWidth,
    rowType,
    rowHeight,
    size,
    count,
    gutter,
    marginValue,
    marginUnit,
    offset,
  } = state;

  const showColWidth = colType !== "stretch";
  const showColMargin = colType === "stretch";
  const showColOffset = colType === "left" || colType === "right";
  const showRowMargin = rowType === "stretch";
  const showRowOffset = rowType === "top" || rowType === "bottom";

  return (
    <>
      <section className="flex flex-col gap-2.5">
        <SectionHeading>Layout</SectionHeading>
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-900 rounded-lg">
          {(["columns", "rows", "grid"] as Layout[]).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => onChange({ layout: l })}
              className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                layout === l
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </section>

      {layout === "grid" && (
        <section className="flex flex-col gap-3.5">
          <SectionHeading>Grid</SectionHeading>
          <SliderField
            label="Cell size"
            value={size}
            min={8}
            max={100}
            onChange={v => onChange({ size: v })}
          />
        </section>
      )}

      {layout === "columns" && (
        <section className="flex flex-col gap-3.5">
          <SectionHeading>Columns</SectionHeading>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-300">Type</p>
            <TypeButtonGroup<ColumnsLayoutType>
              options={["stretch", "left", "right", "center"]}
              value={colType}
              onChange={t =>
                onChange({ colType: t, offset: 0, marginValue: 0 })
              }
            />
          </div>
          <SliderField
            label="Count"
            value={count}
            min={1}
            max={24}
            unit=""
            onChange={v => onChange({ count: v })}
          />
          <SliderField
            label="Gutter"
            value={gutter}
            min={0}
            max={80}
            onChange={v => onChange({ gutter: v })}
          />
          {showColWidth && (
            <SliderField
              label="Column width"
              value={colWidth}
              min={10}
              max={300}
              onChange={v => onChange({ colWidth: v })}
            />
          )}
          {showColMargin && (
            <MarginField
              label="Margin"
              value={marginValue}
              unit={marginUnit}
              onValueChange={v => onChange({ marginValue: v })}
              onUnitChange={u => onChange({ marginUnit: u })}
            />
          )}
          {showColOffset && (
            <SliderField
              label="Offset"
              value={offset}
              min={0}
              max={200}
              onChange={v => onChange({ offset: v })}
            />
          )}
        </section>
      )}

      {layout === "rows" && (
        <section className="flex flex-col gap-3.5">
          <SectionHeading>Rows</SectionHeading>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-300">Type</p>
            <TypeButtonGroup<RowsLayoutType>
              options={["stretch", "top", "center", "bottom"]}
              value={rowType}
              onChange={t =>
                onChange({ rowType: t, offset: 0, marginValue: 0 })
              }
            />
          </div>
          <SliderField
            label="Count"
            value={count}
            min={1}
            max={24}
            unit=""
            onChange={v => onChange({ count: v })}
          />
          <SliderField
            label="Gutter"
            value={gutter}
            min={0}
            max={80}
            onChange={v => onChange({ gutter: v })}
          />
          <SliderField
            label="Row height"
            value={rowHeight}
            min={10}
            max={200}
            onChange={v => onChange({ rowHeight: v })}
          />
          {showRowMargin && (
            <MarginField
              label="Margin"
              value={marginValue}
              unit={marginUnit}
              onValueChange={v => onChange({ marginValue: v })}
              onUnitChange={u => onChange({ marginUnit: u })}
            />
          )}
          {showRowOffset && (
            <SliderField
              label="Offset"
              value={offset}
              min={0}
              max={200}
              onChange={v => onChange({ offset: v })}
            />
          )}
        </section>
      )}
    </>
  );
}
