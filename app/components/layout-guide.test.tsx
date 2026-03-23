import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { LayoutGuide } from "./layout-guide";
import classes from "./layout-guide/layout-guide.module.css";
import { resolveConfig } from "~/utils/resolve-config";

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

  it("overrides the default animate value when provided", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 3, animate: false }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelector(`.${classes["layout-track"]}`)).toHaveStyle(
      "--delay: 0s",
    );
  });
});

describe("css class application", () => {
  it("adds columns class to root when passed as prop", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["columns"]);
  });

  it("adds rows class to root when passed as prop", () => {
    const { container } = render(<LayoutGuide config={{ layout: "rows" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["rows"]);
  });

  it("adds stretch class to root when passed as prop", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "stretch" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(`${classes["stretch"]}`);
  });

  it("adds left class to root when passed as prop with columns layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "left" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["left"]);
  });

  it("adds right class to root when passed as prop with columns layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", type: "right" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["right"]);
  });

  it("adds top class to root when passed as prop with rows layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "top" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["top"]);
  });

  it("adds center class to root when passed as prop with rows layout", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", type: "center" }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["center"]);
  });

  it("adds grid class to root when passed as prop", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["grid"]);
  });

  it("adds display class to root when defaultVisible is true", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", defaultVisible: true }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes["display"]);
  });
});

describe("children rendered for columns/rows layout", () => {
  it("columns layout renders exactly 'count' .layout-track divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 10 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      10,
    );
  });

  it("rows layout renders exactly 'count' .layout-track divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "rows", count: 15 }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      15,
    );
  });

  it("count: 0 renders the root with 0 .layout-tracks divs", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns", count: 0 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toBeInTheDocument();
    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      0,
    );
  });

  it("columns layout does not render .inner-column-grid or .inner-row-grid", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root?.querySelector(`.${classes["inner-row-grid"]}`)).toBeNull();
    expect(root?.querySelector(`.${classes["inner-column-grid"]}`)).toBeNull();
  });

  it("rows layout does not render .inner-column-grid or .inner-row-grid", () => {
    const { container } = render(<LayoutGuide config={{ layout: "rows" }} />);
    const root = container.firstElementChild;

    expect(root?.querySelector(`.${classes["inner-row-grid"]}`)).toBeNull();
    expect(root?.querySelector(`.${classes["inner-column-grid"]}`)).toBeNull();
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

  it("grid layout renders .inner-column-grid and .inner-row-grid", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(
      root?.querySelector(`.${classes["inner-column-grid"]}`),
    ).toBeInTheDocument();
    expect(
      root?.querySelector(`.${classes["inner-row-grid"]}`),
    ).toBeInTheDocument();
  });

  it("grid layout does not render .layout-track divs", () => {
    const { container } = render(<LayoutGuide config={{ layout: "grid" }} />);
    const root = container.firstElementChild;

    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      0,
    );
  });

  it("number of .grid-column divs is the floor of window.innerWidth divided by size prop", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 25 }} />,
    );
    const root = container.firstElementChild;

    // to wait for the useEffect to run first
    await waitFor(() => {
      const columns = root?.querySelectorAll(`.${classes["grid-column"]}`);
      expect(columns).toHaveLength(Math.floor(window.innerWidth / 25));
    });
  });

  it("number of .grid-row divs is the floor of window.innerHeight divided by size prop", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 25 }} />,
    );
    const root = container.firstElementChild;

    await waitFor(() => {
      const rows = root?.querySelectorAll(`.${classes["grid-row"]}`);
      expect(rows).toHaveLength(Math.floor(window.innerHeight / 25));
    });
  });

  it("size prop of 50 and a window of 1000x800 creates 20 columns and 16 rows", async () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "grid", size: 50 }} />,
    );
    const root = container.firstElementChild;

    await waitFor(() => {
      const columns = root?.querySelectorAll(`.${classes["grid-column"]}`);
      const rows = root?.querySelectorAll(`.${classes["grid-row"]}`);
      expect(columns).toHaveLength(Math.floor(window.innerWidth / 50));
      expect(rows).toHaveLength(Math.floor(window.innerHeight / 50));
    });
  });
});

describe("keyboard toggle", () => {
  it("adds .display class when shift+G is pressed and removes class when it is pressed again", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveClass(`.${classes["display"]}`);

    fireEvent.keyDown(document, { key: "g", shiftKey: true });
    expect(root).toHaveClass(classes["display"]);

    fireEvent.keyDown(document, { key: "G", shiftKey: true });
    expect(root).not.toHaveClass(classes["display"]);
  });

  it("pressing 'g' without shift does not toggle .display class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    fireEvent.keyDown(document, { key: "g", shiftKey: false });
    expect(root).not.toHaveClass(classes["display"]);
  });

  it("pressing shift+K does not toggle .display class", () => {
    const { container } = render(
      <LayoutGuide config={{ layout: "columns" }} />,
    );
    const root = container.firstElementChild;

    fireEvent.keyDown(document, { shiftKey: true, key: "K" });
    expect(root).not.toHaveClass(classes["display"]);
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

    expect(root).toHaveClass(classes.rows);
  });

  it("uses tablet config when viewport 768 <= width < 1024", () => {
    innerWidthSpy.mockReturnValue(992);

    const { container } = render(<LayoutGuide config={config} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes.columns);
  });

  it("uses mobile config when viewport 768 < width", () => {
    innerWidthSpy.mockReturnValue(320);
    const { container } = render(<LayoutGuide config={config} />);
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes.grid);
  });
});

describe("resize event handling", () => {
  vi.mock("~/utils/resolve-config", async importOriginal => {
    const module =
      await importOriginal<typeof import("~/utils/resolve-config")>();
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

    expect(root).toHaveClass(classes.rows);

    rerender(<LayoutGuide config={{ layout: "columns" }} />);

    await waitFor(() => {
      expect(root).toHaveClass(classes.columns);
      expect(root).not.toHaveClass(classes.rows);
    });
  });

  it("after config changes, gridColumns/gridRows are recalculated if new layout is grid", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

    const { container, rerender } = render(
      <LayoutGuide config={{ layout: "columns", count: 3 }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass(classes.columns);
    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      3,
    );

    rerender(<LayoutGuide config={{ layout: "grid" }} />);
    expect(root?.querySelectorAll(`.${classes["layout-track"]}`)).toHaveLength(
      0,
    );
    const cols = root?.querySelectorAll(`.${classes["grid-column"]}`);
    const rows = root?.querySelectorAll(`.${classes["grid-row"]}`);

    expect(cols).toHaveLength(Math.floor(window.innerWidth / 25));
    expect(rows).toHaveLength(Math.floor(window.innerHeight / 25));

    vi.restoreAllMocks();
  });
});
