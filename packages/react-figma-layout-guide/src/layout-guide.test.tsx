import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { LayoutGuide } from ".";
import { resolveConfig } from "./utils/resolve-config";

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

  it("root element always has the rflg-layout-guide class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-layout-guide");
  });

  it("root element is not shown by default when defaultVisible is omitted", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveClass("rflg-display");
  });
});

describe("default prop fallbacks", () => {
  it("overrides the default layout when provided", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-grid");
    expect(root).not.toHaveClass("rflg-columns");
  });

  it("overrides the default column type when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "center" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-center");
    expect(root).not.toHaveClass("rflg-stretch");
  });

  it("overrides the default row type when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "bottom" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-bottom");
    expect(root).not.toHaveClass("rflg-stretch");
  });

  it("overrides the default column/row count when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 4 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(4);
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
    const { container, rerender } = render(
      <LayoutGuide config={{ layout: "rows", margin: 10 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--margin: 10px");

    rerender(<LayoutGuide config={{ layout: "rows", margin: "20vw" }} />);
    expect(root).toHaveStyle("--margin: 20vw");

    rerender(<LayoutGuide config={{ layout: "rows", margin: "15rem" }} />);
    expect(root).toHaveStyle("--margin: 15rem");
  });

  it("overrides the default column/row offset when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", offset: 100 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveStyle("--offset: 100px");
  });

  it("overrides the default animate value when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 3, animate: false }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelector(".rflg-layout-track")).toHaveStyle(
      "--delay: 0s",
    );
  });
});

describe("css class application", () => {
  it("adds rflg-columns class to root when passed as prop", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-columns");
  });

  it("adds rflg-rows class to root when passed as prop", () => {
    const { container } = render(<LayoutGuide config={{ layout: "rows" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-rows");
  });

  it("adds rflg-stretch class to root when passed as prop", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "stretch" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-stretch");
  });

  it("adds rflg-left class to root when passed as prop with columns layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "left" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-left");
  });

  it("adds rflg-right class to root when passed as prop with columns layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "right" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-right");
  });

  it("adds rflg-top class to root when passed as prop with rows layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "top" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-top");
  });

  it("adds rflg-center class to root when passed as prop with rows layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "center" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-center");
  });

  it("adds rflg-grid class to root when passed as prop", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-grid");
  });

  it("adds rflg-display class to root when defaultVisible is true", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", defaultVisible: true }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-display");
  });
});

describe("children rendered for columns/rows layout", () => {
  it("columns layout renders exactly 'count' .rflg-layout-track divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 10 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(10);
  });

  it("rows layout renders exactly 'count' .rflg-layout-track divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", count: 15 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(15);
  });

  it("count: 0 renders the root with 0 .rflg-layout-track divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 0 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toBeInTheDocument();
    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(0);
  });

  it("columns layout does not render .rflg-inner-column-grid or .rflg-inner-row-grid", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelector(".rflg-inner-row-grid")).toBeNull();
    expect(root?.querySelector(".rflg-inner-column-grid")).toBeNull();
  });

  it("rows layout does not render .rflg-inner-column-grid or .rflg-inner-row-grid", () => {
    const { container } = render(<LayoutGuide config={{ layout: "rows" }} />);
    const root = container.firstElementChild;

    expect(root?.querySelector(".rflg-inner-row-grid")).toBeNull();
    expect(root?.querySelector(".rflg-inner-column-grid")).toBeNull();
  });
});

describe("children rendered for grid layout", () => {
  beforeEach(() => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("grid layout renders .rflg-inner-column-grid and .rflg-inner-row-grid", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root?.querySelector(".rflg-inner-column-grid")).toBeInTheDocument();
    expect(root?.querySelector(".rflg-inner-row-grid")).toBeInTheDocument();
  });

  it("grid layout does not render .rflg-layout-track divs", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(0);
  });

  it("number of .rflg-grid-column divs is the floor of window.innerWidth divided by size prop", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 25 }} />,
    );
    const root = container.firstElementChild;

    const calculatedColumns = Math.floor(window.innerWidth / 25);

    // to wait for the useEffect to run first
    await waitFor(() => {
      const columns = root?.querySelectorAll(".rflg-grid-column");
      expect(columns).toHaveLength(calculatedColumns);
      expect(root).toHaveStyle(`--grid-columns: ${calculatedColumns}`);
    });
  });

  it("number of .rflg-grid-row divs is the floor of window.innerHeight divided by size prop", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 25 }} />,
    );
    const root = container.firstElementChild;

    const calculatedRows = Math.floor(window.innerHeight / 25);

    await waitFor(() => {
      const rows = root?.querySelectorAll(".rflg-grid-row");
      expect(rows).toHaveLength(calculatedRows);
      expect(root).toHaveStyle(`--grid-rows: ${calculatedRows}`);
    });
  });

  it("size prop of 50 and a window of 1000x800 creates 20 columns and 16 rows", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 50 }} />,
    );
    const root = container.firstElementChild;

    const calculatedColumns = Math.floor(window.innerWidth / 50);
    const calculatedRows = Math.floor(window.innerHeight / 50);

    await waitFor(() => {
      const columns = root?.querySelectorAll(".rflg-grid-column");
      const rows = root?.querySelectorAll(".rflg-grid-row");
      expect(columns).toHaveLength(calculatedColumns);
      expect(root).toHaveStyle(`--grid-columns: ${calculatedColumns}`);
      expect(rows).toHaveLength(calculatedRows);
      expect(root).toHaveStyle(`--grid-rows: ${calculatedRows}`);
    });
  });
});

describe("keyboard toggle", () => {
  it("adds .rflg-display class when shift+G is pressed and removes class when it is pressed again", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveClass("rflg-display");

    fireEvent.keyDown(document, { key: "g", shiftKey: true });
    expect(root).toHaveClass("rflg-display");

    fireEvent.keyDown(document, { key: "G", shiftKey: true });
    expect(root).not.toHaveClass("rflg-display");
  });

  it("pressing 'g' without shift does not toggle .rflg-display class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    fireEvent.keyDown(document, { key: "g", shiftKey: false });
    expect(root).not.toHaveClass("rflg-display");
  });

  it("pressing shift+K does not toggle .rflg-display class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    fireEvent.keyDown(document, { shiftKey: true, key: "K" });
    expect(root).not.toHaveClass("rflg-display");
  });
});

describe("media queries", () => {
  const config = {
    mediaQueries: {
      desktop: { layout: "rows" },
      tablet: { layout: "columns" },
      mobile: { layout: "grid" },
    },
  } as const;

  let innerWidthSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    innerWidthSpy = vi.spyOn(window, "innerWidth", "get");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses desktop config when viewport width >= 1024", () => {
    innerWidthSpy.mockReturnValue(1280); // Use this and not mockReturnValueOnce because width might be checked multiple times in a typical render cycle
    const { container } = render(<LayoutGuide config={config} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-rows");
  });

  it("uses tablet config when viewport 768 <= width < 1024", () => {
    innerWidthSpy.mockReturnValue(992);

    const { container } = render(<LayoutGuide config={config} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-columns");
  });

  it("uses mobile config when viewport 768 < width", () => {
    innerWidthSpy.mockReturnValue(320);
    const { container } = render(<LayoutGuide config={config} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-grid");
  });
});

describe("resize event handling", () => {
  vi.mock("./utils/resolve-config", async importOriginal => {
    const module =
      await importOriginal<typeof import("./utils/resolve-config")>();
    return { ...module, resolveConfig: vi.fn(module.resolveConfig) };
  });

  let innerWidthSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.mocked(resolveConfig).mockClear();
    innerWidthSpy = vi.spyOn(window, "innerWidth", "get");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("after mount, resolveConfig is called with config + initial viewport width", () => {
    render(<LayoutGuide config={{ layout: "rows" }} />);

    expect(resolveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ layout: "rows" }),
      1024,
    );
  });

  it("resizing the window triggers a re-call of resolveConfig with the new viewport width", () => {
    innerWidthSpy.mockReturnValue(1280);
    render(<LayoutGuide config={{ layout: "grid" }} />);

    expect(resolveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ layout: "grid" }),
      1280,
    );

    innerWidthSpy.mockReturnValue(375);
    fireEvent(window, new Event("resize"));

    // More accurate to use toHaveBeenLastCalledWith as after mount, there may be two calls to resizeConfig from the initializer + update()
    expect(resolveConfig).toHaveBeenLastCalledWith(
      expect.objectContaining({ layout: "grid" }),
      375,
    );
  });
});

describe("config prop reactivity", () => {
  it("updating config to a different layout causes the rendered layout type to switch", async () => {
    const { container, rerender } = render(
      <LayoutGuide config={{ layout: "rows" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-rows");

    rerender(<LayoutGuide config={{ layout: "columns" }} />);

    await waitFor(() => {
      expect(root).toHaveClass("rflg-columns");
      expect(root).not.toHaveClass("rflg-rows");
    });
  });

  it("after config changes, gridColumns/gridRows are recalculated if new layout is grid", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

    const { container, rerender } = render(
      <LayoutGuide config={{ layout: "columns", count: 3 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("rflg-columns");
    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(3);

    rerender(<LayoutGuide config={{ layout: "grid" }} />);
    expect(root?.querySelectorAll(".rflg-layout-track")).toHaveLength(0);
    const cols = root?.querySelectorAll(".rflg-grid-column");
    const rows = root?.querySelectorAll(".rflg-grid-row");

    expect(cols).toHaveLength(Math.floor(window.innerWidth / 25));
    expect(rows).toHaveLength(Math.floor(window.innerHeight / 25));

    vi.restoreAllMocks();
  });
});
