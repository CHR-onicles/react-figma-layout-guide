import React, { useEffect, useRef, useState } from "react";
import type { FlatConfig, LayoutGuideProps } from "./types/layout";
import { resolveConfig } from "./utils/resolve-config";
import "./layout-guide.css";

const DEFAULT_WINDOW_INNERWIDTH = 1024;

export const LayoutGuide = ({ config }: LayoutGuideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentResizeObserverRef = useRef<ResizeObserver | null>(null);

  const [activeConfig, setActiveConfig] = useState<FlatConfig>(() =>
    resolveConfig(
      config,
      typeof window !== "undefined"
        ? window.innerWidth
        : DEFAULT_WINDOW_INNERWIDTH,
    ),
  );
  const [displayLayout, setDisplayLayout] = useState(
    activeConfig.defaultVisible ?? false,
  );
  const [gridColumns, setGridColumns] = useState(0);
  const [gridRows, setGridRows] = useState(0);

  useEffect(() => {
    const syncParentResizeObserver = (resolved: FlatConfig) => {
      parentResizeObserverRef.current?.disconnect();
      parentResizeObserverRef.current = null;

      const needsParentObserver =
        (resolved.layout ?? "columns") === "grid" &&
        (resolved.position ?? "fixed") === "absolute" &&
        typeof ResizeObserver !== "undefined";

      if (!needsParentObserver) return;

      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const ro = new ResizeObserver(() => {
        const r = resolveConfig(config, window.innerWidth);
        if ((r.layout ?? "columns") !== "grid") return;
        if ((r.position ?? "fixed") !== "absolute") return;
        const s = r.size ?? 25;
        const p = containerRef.current?.parentElement;
        if (p) {
          setGridColumns(Math.floor(p.clientWidth / s));
          setGridRows(Math.floor(p.clientHeight / s));
        }
      });
      ro.observe(parent);
      parentResizeObserverRef.current = ro;
    };

    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const resolved = resolveConfig(config, vw);
      setActiveConfig(resolved);

      if ((resolved.layout ?? "columns") === "grid") {
        const s = resolved.size ?? 25;
        if ((resolved.position ?? "fixed") === "absolute") {
          const parent = containerRef.current?.parentElement;
          if (parent) {
            setGridColumns(Math.floor(parent.clientWidth / s));
            setGridRows(Math.floor(parent.clientHeight / s));
          } else {
            setGridColumns(Math.floor(vw / s));
            setGridRows(Math.floor(vh / s));
          }
        } else {
          setGridColumns(Math.floor(vw / s));
          setGridRows(Math.floor(vh / s));
        }
      }

      syncParentResizeObserver(resolved);
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      parentResizeObserverRef.current?.disconnect();
      parentResizeObserverRef.current = null;
    };
  }, [config]);

  useEffect(() => {
    const toggleLayout = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "G" || e.key === "g")) {
        e.preventDefault(); // To guard against browser shortcuts although shift+G is not a common shortcut
        // console.log("shift + g pressed");
        setDisplayLayout(prev => !prev);
      }
    };

    window.addEventListener("keydown", toggleLayout);
    return () => window.removeEventListener("keydown", toggleLayout);
  }, []);

  const layout = activeConfig.layout ?? "columns";
  const type = layout !== "grid" ? (activeConfig.type ?? "stretch") : undefined;

  const size = activeConfig.size ?? 25;
  const color = activeConfig.color ?? "hsl(0, 100%, 50%, 0.1)";
  const count = activeConfig.count ?? 5;
  const columnWidth = activeConfig.columnWidth ?? 25;
  const rowHeight = activeConfig.rowHeight ?? 50;
  const gutter = activeConfig.gutter ?? 20;
  const margin = activeConfig.margin ?? 0;
  const offset = activeConfig.offset ?? 0;
  const animate = activeConfig.animate ?? true;
  const delayConstant = animate ? 0.015 : 0;
  const canUseOverlayWidth =
    layout === "columns" && (activeConfig.type ?? "stretch") === "stretch";

  const overlayWidth = canUseOverlayWidth
    ? (activeConfig.overlayWidth ?? undefined)
    : undefined;
  const position = activeConfig.position ?? "fixed";

  return (
    <div
      ref={containerRef}
      className={`rflg-layout-guide ${displayLayout ? "rflg-display" : ""} rflg-${layout} ${type ? `rflg-${type}` : ""} ${overlayWidth != null ? "rflg-overlay-width" : ""} ${position === "absolute" ? `rflg-absolute` : ""}`}
      aria-hidden
      tabIndex={-1}
      style={
        {
          "--count": count,
          "--bg-color": color,
          "--size": `${size}px`,
          "--column-width": `${columnWidth}px`,
          "--row-height": `${rowHeight}px`,
          "--gutter": `${gutter}px`,
          "--margin": typeof margin === "number" ? `${margin}px` : `${margin}`,
          "--offset": typeof offset === "number" ? `${offset}px` : `${offset}`,
          "--grid-columns": gridColumns,
          "--grid-rows": gridRows,
          "--overlay-width":
            overlayWidth == null
              ? undefined
              : typeof overlayWidth === "number"
                ? `${overlayWidth}px`
                : `${overlayWidth}`,
        } as React.CSSProperties
      }>
      {layout === "rows" || layout === "columns" ? (
        Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="rflg-layout-track"
            style={
              { "--delay": `${index * delayConstant}s` } as React.CSSProperties
            }
          />
        ))
      ) : (
        <>
          <div
            className={`rflg-inner-column-grid ${position === "absolute" ? `rflg-absolute` : ""}`}>
            {Array.from({ length: gridColumns }).map((_, index) => (
              <div
                key={index}
                className="rflg-grid-column"
                style={
                  {
                    "--delay": `${index * delayConstant * 0.5 * (gridColumns > gridRows ? 0.5 : 1)}s`, // Divide more to happen as quickly as rows for landscape orientation
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div
            className={`rflg-inner-row-grid ${position === "absolute" ? `rflg-absolute` : ""}`}>
            {Array.from({ length: gridRows }).map((_, index) => (
              <div
                key={index}
                className="rflg-grid-row"
                style={
                  {
                    "--delay": `${index * delayConstant * 0.5 * (gridColumns > gridRows ? 1 : 0.5)}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
