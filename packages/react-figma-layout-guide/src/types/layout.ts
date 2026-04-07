type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never; // To preserve discrimination in union

export type Breakpoint = "mobile" | "tablet" | "desktop";

export type Layout = "grid" | "columns" | "rows";

export type ColumnsLayoutType = "stretch" | "left" | "right" | "center";
export type RowsLayoutType = "stretch" | "top" | "center" | "bottom";

export type LayoutMediaQueries = {
  /**
   * Screen sizes < 768px
   */
  mobile?: DistributiveOmit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes between 768px and 1023px inclusive
   */
  tablet?: DistributiveOmit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes >= 1024px
   */
  desktop?: DistributiveOmit<LayoutDefault, "mediaQueries">;
};

/**
 * Single-viewport layout settings returned by {@link resolveConfig} (either the
 * top-level `config` or `color` / `animate` / `defaultVisible` merged with the
 * active `mediaQueries` branch).
 */
export type FlatConfig = {
  layout?: Layout;
  color?: string;
  animate?: boolean;
  defaultVisible?: boolean;
  type?: string;
  size?: number;
  columnWidth?: number;
  rowHeight?: number;
  /** Only applies when `layout` is `"columns"` and `type` is `"stretch"` (or omitted). */
  contentWidth?: number | string;
  margin?: number | string;
  gutter?: number;
  offset?: number | string;
  count?: number;
};

export type LayoutBase = {
  /**
   * "grid" | "columns" | "rows"
   *
   * Default: "columns"
   */
  layout?: Layout;

  /**
   * Hex, rgb, hsl, or any other valid CSS color value.
   *
   * Default: hsl(0, 100%, 50%, 0.1) - Red
   */
  color?: string;

  /**
   * Whether or not to animate the appearance of the layout guide.
   *
   * Default: true
   */
  animate?: boolean;

  /**
   * Whether the layout guide is visible by default (without pressing Shift+G).
   *
   * Default: false
   */
  defaultVisible?: boolean;

  /**
   * Per-breakpoint layout (mobile, tablet, desktop); mobile-first fallbacks.
   */
  mediaQueries?: LayoutMediaQueries;
};

type ColumnsCommon = LayoutBase & {
  layout: "columns";

  /**
   * Width of columns
   *
   * Default: 25px
   */
  columnWidth?: number;

  /**
   * Horizontal space outside the columns. Could be a fixed number or relative units like: %, vw, vh, rem, em or even clamp().
   *
   * Default: 0
   */
  margin?: number | string;

  /**
   * Space in between columns.
   *
   * Default: 20px
   */
  gutter?: number;

  /**
   * For `type` left, right. Replaces margin in these scenarios. Fixed px or relative units.
   *
   * Default: 0
   */
  offset?: number | string;

  /**
   * Number of columns or rows
   *
   * Default: 5
   */
  count?: number;
};

// Type is scoped to layout
export type LayoutDefault =
  | (LayoutBase & {
      layout: "grid";
      type?: never;

      /**
       * For layout: grid
       *
       * Default: 25px
       */
      size?: number;
    })
  | (ColumnsCommon & {
      /**
       * For `layout`: "columns" when the guide spans the full width (`stretch`), or is omitted (defaults to stretch).
       */
      type?: "stretch";

      /**
       * Width of the overlay. Could be px, %, rem, vw, etc or even an expression like min(90%, 1440px) combined with `margin`: "auto" to center the overlay. Only for `layout`: "columns" with `type`: "stretch" (including when `type` is omitted).
       *
       * Default: undefined
       */
      contentWidth?: number | string;
    })
  | (ColumnsCommon & {
      /**
       * For `layout`: "columns" — left, right, or centered column tracks.
       */
      type: "left" | "right" | "center";
      contentWidth?: never;
    })
  | (LayoutBase & {
      layout: "rows";

      /**
       * For layout: rows
       *
       * Default: stretch
       */
      type?: RowsLayoutType;

      /**
       * Height of rows
       *
       * Default: 50px
       */
      rowHeight?: number;

      /**
       * Vertical space outside the rows. Could be a fixed number or relative units like: %, vw, vh, rem, em or even clamp().
       *
       * Default: 0
       */
      margin?: number | string;

      /**
       * Space in between rows.
       *
       * Default: 20px
       */
      gutter?: number;

      /**
       * For `type` top, bottom. Replaces margin in these scenarios. Fixed px or relative units.
       *
       * Default: 0
       */
      offset?: number | string;

      /**
       * Number of columns or rows
       *
       * Default: 5
       */
      count?: number;
    });

/**
 * Allowed top-level props when `config` includes `mediaQueries` (no `layout` here).
 * In `resolveConfig` they are applied first, then the active breakpoint branch is
 * spread on top—per-breakpoint keys override these when both are set.
 */
export type LayoutGlobalProps = {
  /**
   * Hex, rgb, hsl, or any other valid CSS color value.
   *
   * Default: hsl(0, 100%, 50%, 0.1) - Red
   */
  color?: string;

  /**
   * Whether or not to animate the appearance of the layout guide.
   *
   * Default: true
   */
  animate?: boolean;

  /**
   * Whether the layout guide is visible by default (without pressing Shift+G).
   *
   * Default: false
   */
  defaultVisible?: boolean;
};

// Branch 1: no mediaQueries → full layout config (current behavior)
type LayoutWithoutMediaQueries = LayoutDefault & {
  mediaQueries?: never;
};
// Branch 2: with mediaQueries → only global props at top level
type LayoutWithMediaQueries = LayoutGlobalProps & {
  mediaQueries: LayoutMediaQueries;
  // layout-specific props are forbidden at top level
  layout?: never;
};

/**
 * Props for LayoutGuide component.
 * Pass layout configuration via the `config` prop.
 *
 * @example
 * // Grid layout - only size and base options (no type, columnWidth, rowHeight)
 * <LayoutGuide config={{ layout: "grid", size: 20 }} />
 *
 * @example
 * // Columns layout - type (stretch|left|right|center), columnWidth, gutter, margin, offset
 * <LayoutGuide config={{ layout: "columns", type: "center", columnWidth: 100 }} />
 *
 * @example
 * // Rows layout - type (stretch|top|center|bottom), rowHeight, gutter, margin, offset
 * <LayoutGuide config={{ layout: "rows", type: "stretch", gutter: 20, margin: 50 }} />
 */
export type LayoutGuideProps = {
  config: LayoutWithMediaQueries | LayoutWithoutMediaQueries;
};
