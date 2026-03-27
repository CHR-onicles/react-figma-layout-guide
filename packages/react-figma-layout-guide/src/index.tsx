import React, { useEffect, useState } from "react";
import type { FlatConfig, LayoutGuideProps } from "./types/layout";
import { resolveConfig } from "./utils/resolve-config";
import "./layout-guide.css";

const isProd = process.env.NODE_ENV === "production";

const DEFAULT_WINDOW_INNERWIDTH = 1024;

export const LayoutGuide = ({ config }: LayoutGuideProps) => {
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
    if (isProd) return;
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const resolved = resolveConfig(config, vw);
      setActiveConfig(resolved);

      if ((resolved.layout ?? "columns") === "grid") {
        const s = resolved.size ?? 25;
        setGridColumns(Math.floor(vw / s));
        setGridRows(Math.floor(vh / s));
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [config]);

  useEffect(() => {
    if (isProd) return;

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
  const width = activeConfig.width ?? 25;
  const height = activeConfig.height ?? 50;
  const gutter = activeConfig.gutter ?? 20;
  const margin = activeConfig.margin ?? 0;
  const offset = activeConfig.offset ?? 0;
  const animate = activeConfig.animate ?? true;
  const delayConstant = animate ? 0.015 : 0;

  if (isProd) return null;
  return (
    <div
      className={`rflg-layout-guide ${displayLayout ? "rflg-display" : ""} rflg-${layout} ${type ? `rflg-${type}` : ""}`}
      aria-hidden
      tabIndex={-1}
      style={
        {
          "--count": count,
          "--bg-color": color,
          "--size": `${size}px`,
          "--width": `${width}px`,
          "--height": `${height}px`,
          "--gutter": `${gutter}px`,
          "--margin": `${margin}px`,
          "--offset": `${offset}px`,
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
          <div className="rflg-inner-column-grid">
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
          <div className="rflg-inner-row-grid">
            {Array.from({ length: gridRows }).map((_, index) => (
              <div
                key={index}
                className="rflg-grid-row"
                style={
                  {
                    "--delay": `${index * 0.015 * 0.5 * (gridColumns > gridRows ? 1 : 0.5)}s`,
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
