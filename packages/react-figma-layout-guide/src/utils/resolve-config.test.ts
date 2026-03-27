import { describe, expect, it } from "vitest";
import { resolveConfig } from "./resolve-config";
import type { LayoutGuideProps } from "../types/layout";

describe("resolveConfig without mediaQueries", () => {
  const config = {
    animate: false,
    color: "#0000fa34",
    defaultVisible: false,
    layout: "grid",
    size: 20,
  } as LayoutGuideProps["config"];
  it("returns the config as-is", () => {
    expect(resolveConfig(config, 1000)).toBe(config);
  });
});

describe("resolveConfig with mediaQueries", () => {
  it("returns desktop config when desktop width is defined merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        desktop: { layout: "columns", type: "stretch", color: "#00ff0011" },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 1440)).toEqual({
      animate: false,
      color: "#00ff0011",
      defaultVisible: false,
      layout: "columns",
      type: "stretch",
    });
  });

  it("returns tablet config when desktop width is defined with no desktop config merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        tablet: { layout: "rows" },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 1440)).toEqual({
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      layout: "rows",
    });
  });

  it("returns tablet config when tablet width is defined merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        desktop: { layout: "columns" },
        tablet: { layout: "rows" },
        mobile: { layout: "grid" },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 1023)).toEqual({
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      layout: "rows",
    });
  });

  it("returns mobile config when tablet width is defined with no tablet config merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        desktop: { layout: "columns" },
        mobile: { layout: "grid", size: 10 },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 1023)).toEqual({
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      layout: "grid",
      size: 10,
    });
  });

  it("returns mobile config when mobile width is defined merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        tablet: { layout: "columns" },
        mobile: { layout: "grid" },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 375)).toEqual({
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      layout: "grid",
    });
  });

  it("returns mobile config when desktop and tablet configs are not defined merged with top-level props", () => {
    const config = {
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      mediaQueries: {
        mobile: { layout: "grid" },
      },
    } as LayoutGuideProps["config"];

    expect(resolveConfig(config, 1440)).toEqual({
      animate: false,
      color: "#0000fa34",
      defaultVisible: false,
      layout: "grid",
    });
  });
});
