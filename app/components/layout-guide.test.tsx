import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LayoutGuide } from "./layout-guide";
import classes from "./layout-guide/layout-guide.module.css";

describe("initial render", () => {
  it("renders without crashing with a minimal config", () => {
    render(<LayoutGuide config={{ layout: "columns" }} />);
  });

  it("root element has aria-hidden attribute and tab index of -1", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveAttribute("tabindex", "-1");
  });

  it("root element always has the layout-guide class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["layout-guide"]);
  });

  it("root element is not shown by default when defaultVisible is omitted", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveClass(classes["display"]);
  });
});

describe("default prop fallbacks", () => {
  it("overrides the default layout when provided", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["grid"]);
    expect(root).not.toHaveClass(classes["columns"]);
  });

  it("overrides the default column type when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "center" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["center"]);
    expect(root).not.toHaveClass(classes["stretch"]);
  });

  it("overrides the default row type when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "bottom" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["bottom"]);
    expect(root).not.toHaveClass(classes["stretch"]);
  });

  it("overrides the default column/row count when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 4 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      4,
    );
  });

  it("overrides the default background color when provided", () => {
    const { container } = render(
      <LayoutGuide
        config={{ layout: "rows", type: "bottom", color: "#123456" }}
      />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--bg-color: #123456");
  });

  it("overrides the default grid size when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 100 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--size: 100px");
  });

  it("overrides the default column width when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", width: 100 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--width: 100px");
  });

  it("overrides the default row height when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", height: 500 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--height: 500px");
  });

  it("overrides the default column/row gutter when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", gutter: 50 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--gutter: 50px");
  });

  it("overrides the default column/row margin when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", margin: 10 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--margin: 10px");
  });

  it("overrides the default column/row offset when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", offset: 100 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--offset: 100px");
  });
});
