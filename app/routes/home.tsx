import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { LayoutGuide } from "~/components/layout-guide";
import type {
  Breakpoint,
  ColumnsLayoutType,
  Layout,
  LayoutDefault,
  LayoutGuideProps,
  RowsLayoutType,
} from "~/types/layout";

// ── Helpers ───────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Primitive controls ────────────────────────────────────

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: SliderFieldProps) {
  const display = step < 1 ? value.toFixed(2) : String(value);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-gray-300">{label}</label>
        <span className="text-xs font-mono text-gray-500 tabular-nums">
          {display}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full accent-sky-500 cursor-pointer"
      />
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-300 leading-none">
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ${
          checked ? "bg-sky-500" : "bg-gray-700"
        }`}>
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

interface TypeButtonGroupProps<T extends string> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}

function TypeButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: TypeButtonGroupProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
            value === opt
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
      {children}
    </h2>
  );
}

// ── Breakpoint types & constants ──────────────────────────

type BpState = {
  layout: Layout;
  colType: ColumnsLayoutType;
  colWidth: number;
  rowType: RowsLayoutType;
  rowHeight: number;
  size: number;
  count: number;
  gutter: number;
  margin: number;
  offset: number;
};

type BpRecord = Record<Breakpoint, BpState & { enabled: boolean }>;

const DEFAULT_BP: BpState = {
  layout: "columns",
  colType: "stretch",
  colWidth: 80,
  rowType: "stretch",
  rowHeight: 50,
  size: 25,
  count: 12,
  gutter: 20,
  margin: 0,
  offset: 0,
};

const BP_SIZE_HINT: Record<Breakpoint, string> = {
  mobile: "< 768px",
  tablet: "768 – 1023px",
  desktop: "≥ 1024px",
};

const BP_FALLBACKS: Record<Breakpoint, Breakpoint[]> = {
  mobile: [],
  tablet: ["mobile"],
  desktop: ["tablet", "mobile"],
};

function getInheritLabel(bp: Breakpoint, bps: BpRecord): string {
  const first = BP_FALLBACKS[bp].find(f => bps[f].enabled);
  return first ? `Inherits from ${first}` : "Uses component defaults";
}

function buildBpLayout(bp: BpState): LayoutDefault {
  if (bp.layout === "grid") return { layout: "grid", size: bp.size };
  if (bp.layout === "columns") {
    return {
      layout: "columns",
      type: bp.colType,
      width: bp.colWidth,
      count: bp.count,
      gutter: bp.gutter,
      margin: bp.margin,
      offset: bp.offset,
    };
  }
  return {
    layout: "rows",
    type: bp.rowType,
    height: bp.rowHeight,
    count: bp.count,
    gutter: bp.gutter,
    margin: bp.margin,
    offset: bp.offset,
  };
}

// ── LayoutControls ────────────────────────────────────────

interface LayoutControlsProps {
  state: BpState;
  onChange: (updates: Partial<BpState>) => void;
}

function LayoutControls({ state, onChange }: LayoutControlsProps) {
  const {
    layout,
    colType,
    colWidth,
    rowType,
    rowHeight,
    size,
    count,
    gutter,
    margin,
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
              onChange={t => onChange({ colType: t, offset: 0, margin: 0 })}
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
            <SliderField
              label="Margin"
              value={margin}
              min={0}
              max={200}
              onChange={v => onChange({ margin: v })}
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
              onChange={t => onChange({ rowType: t, offset: 0, margin: 0 })}
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
            <SliderField
              label="Margin"
              value={margin}
              min={0}
              max={200}
              onChange={v => onChange({ margin: v })}
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

// ── Route exports ─────────────────────────────────────────

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Figma Layout Guide — Interactive Demo" },
    {
      name: "description",
      content: "Interactive demo for the LayoutGuide component.",
    },
  ];
}

function toggleGuide() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key: "G", shiftKey: true, bubbles: true }),
  );
}

// ── Home ──────────────────────────────────────────────────

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<"simple" | "responsive">("simple");

  // Global appearance — shared by both modes
  const [colorHex, setColorHex] = useState("#ff0000");
  const [opacity, setOpacity] = useState(0.1);
  const [animate, setAnimate] = useState(true);
  const [defaultVisible, setDefaultVisible] = useState(true);

  // Simple mode — single flat config
  const [simple, setSimple] = useState<BpState>(DEFAULT_BP);

  // Responsive mode — per-breakpoint configs
  const [bps, setBps] = useState<BpRecord>({
    mobile: { ...DEFAULT_BP, count: 4, enabled: true },
    tablet: { ...DEFAULT_BP, count: 8, enabled: false },
    desktop: { ...DEFAULT_BP, enabled: true },
  });
  const [activeBp, setActiveBp] = useState<Breakpoint>("desktop");

  const color = hexToRgba(colorHex, opacity);

  const config = useMemo((): LayoutGuideProps["config"] => {
    const base = { color, animate, defaultVisible };
    if (mode === "simple") {
      return {
        ...base,
        ...buildBpLayout(simple),
      } as LayoutGuideProps["config"];
    }
    return {
      ...base,
      mediaQueries: {
        mobile: bps.mobile.enabled ? buildBpLayout(bps.mobile) : undefined,
        tablet: bps.tablet.enabled ? buildBpLayout(bps.tablet) : undefined,
        desktop: bps.desktop.enabled ? buildBpLayout(bps.desktop) : undefined,
      },
    } as LayoutGuideProps["config"];
  }, [mode, color, animate, defaultVisible, simple, bps]);

  function updateSimple(updates: Partial<BpState>) {
    setSimple(prev => ({ ...prev, ...updates }));
  }

  function updateBp(
    bp: Breakpoint,
    updates: Partial<BpState & { enabled: boolean }>,
  ) {
    setBps(prev => ({ ...prev, [bp]: { ...prev[bp], ...updates } }));
  }

  // Effective layout for feature card highlighting
  const activeLayout: Layout | null =
    mode === "simple"
      ? simple.layout
      : bps.desktop.enabled
        ? bps.desktop.layout
        : bps.tablet.enabled
          ? bps.tablet.layout
          : bps.mobile.enabled
            ? bps.mobile.layout
            : null;

  const configuredBpCount = (
    ["mobile", "tablet", "desktop"] as Breakpoint[]
  ).filter(bp => bps[bp].enabled).length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* ─── Main canvas ─────────────────────────────────────── */}
      <main className="min-h-screen">
        {/* Hero */}
        <section className="px-12 pt-16 pb-12 border-b border-gray-100 dark:border-gray-800/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-3">
            Interactive Demo
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            React Figma Layout Guide
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-6">
            A Figma-style grid overlay for React. Open the{" "}
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="underline underline-offset-2 decoration-dotted hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              controls panel
            </button>{" "}
            to configure the overlay in real-time, then press or click{" "}
            <button
              type="button"
              title="Toggle layout guide visibility"
              onClick={toggleGuide}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95 transition-all">
              Shift+G
            </button>{" "}
            to toggle the overlay.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900 text-xs font-medium text-sky-600 dark:text-sky-400">
              <span className="size-1.5 rounded-full bg-sky-500" />
              {mode === "simple"
                ? `Layout: ${simple.layout}`
                : "Responsive mode"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
              {mode === "simple"
                ? simple.layout === "grid"
                  ? `${simple.size}px cells`
                  : simple.layout === "columns"
                    ? `${simple.count} cols · ${simple.colType}`
                    : `${simple.count} rows · ${simple.rowType}`
                : `${configuredBpCount} of 3 breakpoints configured`}
            </span>
          </div>
        </section>

        {/* Feature cards */}
        <section className="px-12 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
            Layout modes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {(
              [
                {
                  title: "Columns",
                  color: "bg-sky-500",
                  ring: "ring-sky-500/20",
                  desc: "Vertical columns with configurable count, gutter, margin and alignment type.",
                  layout: "columns" as Layout,
                },
                {
                  title: "Rows",
                  color: "bg-violet-500",
                  ring: "ring-violet-500/20",
                  desc: "Horizontal rows with height, gutter, and top / center / bottom alignment.",
                  layout: "rows" as Layout,
                },
                {
                  title: "Grid",
                  color: "bg-sky-500",
                  ring: "ring-sky-500/20",
                  desc: "Full-viewport crosshatch grid defined by a single square cell size.",
                  layout: "grid" as Layout,
                },
              ] as const
            ).map(card => {
              const active = activeLayout === card.layout;
              return (
                <div
                  key={card.title}
                  className={`rounded-xl border bg-gray-50 dark:bg-gray-900 p-6 transition-all ${
                    active
                      ? `border-sky-200 dark:border-sky-900 ring-2 ${card.ring}`
                      : "border-gray-100 dark:border-gray-800"
                  }`}>
                  <div
                    className={`size-8 rounded-lg ${card.color} mb-4 ${active ? "opacity-100" : "opacity-40"}`}
                  />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Content skeleton */}
        <section className="px-12 pb-12 grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col gap-3">
            <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-3/5" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-11/12" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
            <div className="mt-2 h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-10/12" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
          </div>
          <div className="col-span-4">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
              <div className="mt-1 h-8 bg-sky-100 dark:bg-sky-950/50 rounded-lg w-full" />
            </div>
          </div>
        </section>

        {/* Tile grid */}
        <section className="px-12 pb-32 grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            />
          ))}
        </section>
      </main>

      {/* ─── Floating controls panel ─────────────────────────── */}
      <div className="fixed top-5 bottom-5 right-5 flex flex-col items-end gap-3 z-1000000000">
        {/* Panel */}
        <div
          className={`w-72 bg-gray-950 border border-gray-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
            panelOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-sky-500 shadow-[0_0_6px_var(--color-sky-500)]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Layout Guide
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Toggle layout guide visibility (Shift+G)"
                onClick={toggleGuide}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-mono hover:bg-gray-700 hover:text-white active:scale-95 transition-all">
                Shift+G
              </button>
              <button
                type="button"
                title="Close panel"
                onClick={() => setPanelOpen(false)}
                className="size-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-800 hover:text-gray-200 transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable controls */}
          <div className="overflow-y-auto max-h-[calc(100svh-8rem)] px-4 py-5 flex flex-col gap-6">
            {/* ── Mode toggle ── */}
            <section className="flex flex-col gap-2.5">
              <SectionHeading>Mode</SectionHeading>
              <div className="grid grid-cols-2 gap-1 p-1 bg-gray-900 rounded-lg">
                {(["simple", "responsive"] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                      mode === m
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
              {mode === "responsive" && (
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Configure a different layout per breakpoint. Disabled
                  breakpoints inherit from the next smaller one.
                </p>
              )}
            </section>

            {/* ── Appearance (global) ── */}
            <section className="flex flex-col gap-3.5">
              <SectionHeading>Appearance</SectionHeading>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">
                      {colorHex}
                    </span>
                    <input
                      type="color"
                      value={colorHex}
                      onChange={e => setColorHex(e.target.value)}
                      className="h-7 w-9 rounded cursor-pointer border border-gray-700 bg-gray-800 p-0.5"
                    />
                  </div>
                </div>
                <SliderField
                  label="Opacity"
                  value={opacity}
                  min={0.01}
                  max={1}
                  step={0.01}
                  unit=""
                  onChange={setOpacity}
                />
              </div>
              <div className="flex flex-col gap-3">
                <ToggleField
                  label="Animate"
                  description="Stagger tracks on appearance"
                  checked={animate}
                  onChange={setAnimate}
                />
                <ToggleField
                  label="Visible by default"
                  description="Show without pressing Shift+G"
                  checked={defaultVisible}
                  onChange={setDefaultVisible}
                />
              </div>
            </section>

            {/* ── Simple mode controls ── */}
            {mode === "simple" && (
              <LayoutControls state={simple} onChange={updateSimple} />
            )}

            {/* ── Responsive mode controls ── */}
            {mode === "responsive" && (
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <SectionHeading>Breakpoints</SectionHeading>
                  {/* Breakpoint tab row */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-gray-900 rounded-lg">
                    {(["mobile", "tablet", "desktop"] as Breakpoint[]).map(
                      bp => (
                        <button
                          key={bp}
                          type="button"
                          onClick={() => setActiveBp(bp)}
                          className={`relative py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                            activeBp === bp
                              ? "bg-sky-600 text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                          }`}>
                          {bp}
                          {/* Enabled indicator dot */}
                          {bps[bp].enabled && (
                            <span
                              className={`absolute top-1 right-1 size-1 rounded-full ${
                                activeBp === bp ? "bg-white/50" : "bg-sky-500"
                              }`}
                            />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                  {/* Size hint */}
                  <p className="text-[11px] text-gray-500 tabular-nums">
                    {BP_SIZE_HINT[activeBp]}
                  </p>
                </div>

                {/* Enable toggle for active breakpoint */}
                <ToggleField
                  label="Configure this breakpoint"
                  description={
                    bps[activeBp].enabled
                      ? "Custom layout active"
                      : getInheritLabel(activeBp, bps)
                  }
                  checked={bps[activeBp].enabled}
                  onChange={v => updateBp(activeBp, { enabled: v })}
                />

                {/* Controls or inherit notice */}
                {bps[activeBp].enabled ? (
                  <LayoutControls
                    state={bps[activeBp]}
                    onChange={updates => updateBp(activeBp, updates)}
                  />
                ) : (
                  <div className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2.5 flex items-start gap-2">
                    <svg
                      className="mt-0.5 shrink-0 text-gray-500"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none">
                      <path
                        d="M6 1v5M6 8.5v1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="6"
                        cy="6"
                        r="5.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {getInheritLabel(activeBp, bps)}. Enable to set a custom
                      layout for this breakpoint.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* ── Live config ── */}
            <section className="flex flex-col gap-2.5">
              <SectionHeading>Config</SectionHeading>
              <pre className="text-[10px] leading-relaxed font-mono text-gray-400 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(config, null, 2)}
              </pre>
            </section>
          </div>
        </div>

        {/* FAB toggle button */}
        <button
          type="button"
          onClick={() => setPanelOpen(prev => !prev)}
          title={panelOpen ? "Close controls" : "Open controls"}
          className={`size-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
            panelOpen
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-sky-600 text-white hover:bg-sky-500 shadow-sky-500/30"
          }`}>
          {panelOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="1"
                y="4"
                width="14"
                height="1.5"
                rx="0.75"
                fill="currentColor"
              />
              <rect
                x="1"
                y="7.25"
                width="14"
                height="1.5"
                rx="0.75"
                fill="currentColor"
              />
              <rect
                x="1"
                y="10.5"
                width="14"
                height="1.5"
                rx="0.75"
                fill="currentColor"
              />
              <circle
                cx="5"
                cy="4.75"
                r="1.75"
                fill="currentColor"
                stroke="#1f2937"
                strokeWidth="1"
              />
              <circle
                cx="10"
                cy="8"
                r="1.75"
                fill="currentColor"
                stroke="#1f2937"
                strokeWidth="1"
              />
              <circle
                cx="6"
                cy="11.25"
                r="1.75"
                fill="currentColor"
                stroke="#1f2937"
                strokeWidth="1"
              />
            </svg>
          )}
        </button>
      </div>

      <LayoutGuide config={config} />
    </div>
  );
}
