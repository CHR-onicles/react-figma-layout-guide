import React, { useEffect, useState } from "react";
import classes from "./layout-vanilla.module.css";
import type { LayoutVanillaProps } from "~/types/layout";

export const LayoutVanilla = ({ config }: LayoutVanillaProps) => {
  const option = config.option ?? "columns";
  const type =
    option !== "grid"
      ? "type" in config
        ? config.type
        : "stretch"
      : undefined;
  const size = "size" in config ? config.size : 25;
  const color = config.color ?? "hsl(0, 100%, 100%, 0.5)";
  const count = "count" in config ? config.count : 5;
  const width = "width" in config ? config.width : 25;
  const height = "height" in config ? config.height : 50;
  const gutter = "gutter" in config ? config.gutter : 20;
  const margin = "margin" in config ? config.margin : 0;
  const offset = "offset" in config ? config.offset : 0;
  const animate = "animate" in config ? config.animate : true;
  const defaultVisible = config.defaultVisible ?? false;
  const delayConstant = animate ? 0.015 : 0;

  const [displayLayout, setDisplayLayout] = useState(defaultVisible);
  const [gridColumns, setGridColumns] = useState(0);
  const [gridRows, setGridRows] = useState(0);

  useEffect(() => {
    if (option === "grid") {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setGridColumns(Math.floor(viewportWidth / (size ?? 1)));
      setGridRows(Math.floor(viewportHeight / (size ?? 1)));

      // console.log(viewportWidth, viewportHeight);
    }
  }, [option, size]);

  useEffect(() => {
    // if (import.meta.env.PROD) return; // todo: Uncomment this later

    const toggleLayout = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "G" || e.key === "g")) {
        e.preventDefault();
        console.log("shift + g pressed");
        setDisplayLayout(prev => !prev);
      }
    };

    window.addEventListener("keydown", toggleLayout);

    return () => {
      window.removeEventListener("keydown", toggleLayout);
    };
  }, []);

  // if (import.meta.env.DEV) {
  if (true) {
    // todo: Change this later
    if (option === "grid" && type) {
      console.warn(
        `[React Figma Layout]: "type" is ignored when option is "grid"`,
      );
    }

    if (option === "columns" && ["bottom", "top"].includes(type!)) {
      console.warn(
        `[React Figma Layout]: ${type} is invalid when option is "columns". Use left, right or center.`,
      );
    }

    if (option === "rows" && ["left", "right"].includes(type!)) {
      console.warn(
        `[React Figma Layout]: ${type} is invalid when option is "rows". Use top, bottom or center.`,
      );
    }
  }

  return (
    <div
      className={`${classes["layout-vanilla"]} ${displayLayout ? classes.display : ""} ${classes[option]} ${type ? classes[type] : ""}`}
      aria-hidden
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
      {option === "rows" || option === "columns" ? (
        Array.from({ length: count! }).map((_, index) => (
          <div
            key={index}
            className={classes["layout-track"]}
            style={
              { "--delay": `${index * delayConstant}s` } as React.CSSProperties
            }
          />
        ))
      ) : (
        <>
          <div className={classes["inner-column-grid"]}>
            {Array.from({ length: gridColumns }).map((_, index) => (
              <div
                key={index}
                className={classes["grid-column"]}
                style={
                  {
                    "--delay": `${index * delayConstant * 0.5 * (gridColumns > gridRows ? 0.5 : 1)}s`, // Divide more to happen as quickly as rows for landscape orientation
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className={classes["inner-row-grid"]}>
            {Array.from({ length: gridRows }).map((_, index) => (
              <div
                key={index}
                className={classes["grid-row"]}
                style={
                  {
                    // "--delay": `${index * 0.015 * 0.5}s`,
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
