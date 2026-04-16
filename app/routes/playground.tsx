import { useMemo, useState } from "react";
import type { Route } from "./+types/playground";
import { LayoutGuide } from "packages/react-figma-layout-guide/src";
import type {
  Breakpoint,
  Layout,
  LayoutGuideProps,
  PositionType,
} from "packages/react-figma-layout-guide/src/types/layout";
import { SliderField } from "~/components/slider-field";
import { ToggleField } from "~/components/toggle-field";
import { CloseIcon, DemoIcon, GhIcon, InfoIcon } from "~/components/icons";
import type { BpRecord, BpState } from "~/types";
import { SectionHeading } from "~/components/section-heading";
import { LayoutControls } from "~/components/layout-controls";
import { BP_SIZE_HINT, DEFAULT_BP } from "~/constants";
import { buildBpLayout } from "~/utils/build-bp-layout";
import { hexToRgba } from "~/utils/hex-to-rgba";
import { getInheritLabel } from "~/utils/get-inherit-label";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Figma Layout Guide — Playground" },
    {
      name: "description",
      content: "Playground for the LayoutGuide component.",
    },
  ];
}

// Helper function
function toggleGuide() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key: "G", shiftKey: true, bubbles: true }),
  );
}

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<"simple" | "responsive">("simple");

  // Global appearance — shared by both modes
  const [colorHex, setColorHex] = useState("#ff0000");
  const [opacity, setOpacity] = useState(0.1);
  const [animate, setAnimate] = useState(true);
  const [defaultVisible, setDefaultVisible] = useState(true);
  const [position, setPosition] = useState<PositionType>("fixed");

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
    const base = { color, animate, defaultVisible, position };
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
  }, [mode, color, animate, defaultVisible, position, simple, bps]);

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
      <main className="min-h-screen relative mx-12">
        {/* Hero */}
        <section className="relative pt-16 pb-12 border-b border-gray-100 dark:border-gray-800/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-3">
            Playground
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
          <LayoutGuide
            // config={{ mediaQueries: { mobile: { layout: "columns", type: "stretch" } } }}
            config={config}
          />
        </section>

        {/* Feature cards */}
        <section className="py-12">
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
        <section className="pb-12 grid grid-cols-12 gap-6">
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
        <section className=" grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            />
          ))}
        </section>
        <footer className="py-4 mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Built at odd hours in{" "}
            <span title="Ghana">
              <GhIcon />
            </span>{" "}
            by{" "}
            <a
              href="https://www.divineanum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:underline underline-offset-2">
              Divine Anum
            </a>
          </p>
        </footer>
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
                <CloseIcon />
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
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-gray-300">Position</p>
                <div className="grid grid-cols-2 gap-1 p-1 bg-gray-900 rounded-lg">
                  {(["fixed", "absolute"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPosition(p)}
                      className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                        position === p
                          ? "bg-sky-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Fixed covers the viewport; absolute is confined to the hero
                  section (requires a relative parent).
                </p>
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
                    <InfoIcon />
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
          {panelOpen ? <CloseIcon /> : <DemoIcon />}
        </button>
      </div>
    </div>
  );
}
