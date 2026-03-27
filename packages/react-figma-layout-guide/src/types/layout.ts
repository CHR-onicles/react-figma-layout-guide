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
  width?: number;
  height?: number;
  margin?: number;
  gutter?: number;
  offset?: number;
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
  | (LayoutBase & {
      layout: "columns";

      /**
       * For layout: columns
       *
       * Default: stretch
       */
      type?: ColumnsLayoutType;

      /**
       * For option: columns
       *
       * Default: 25px
       */
      width?: number;

      /**
       * Space outside the `rows` and `columns`, using logical properties.
       *
       * Default: 0
       */
      margin?: number;

      /**
       * Space in between rows and columns.
       *
       * Default: 20px
       */
      gutter?: number;

      /**
       * For `type` left, right. Replaces margin in these scenarios.
       *
       * Default: 0
       */
      offset?: number;

      /**
       * Number of columns or rows
       *
       * Default: 5
       */
      count?: number;
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
       * For layout: rows
       *
       * Default: 50px
       */
      height?: number;

      /**
       * Space outside the `rows` and `columns`, using logical properties.
       *
       * Default: 0
       */
      margin?: number;

      /**
       * Space in between rows and columns.
       *
       * Default: 20px
       */
      gutter?: number;

      /**
       * For `type` top, bottom. Replaces margin in these scenarios.
       *
       * Default: 0
       */
      offset?: number;

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

export type LayoutGuideProps = {
  config: LayoutWithMediaQueries | LayoutWithoutMediaQueries;
};

/**
 * Props for LayoutGuide component.
 * Pass layout configuration via the `config` prop.
 *
 * @example
 * // Grid layout - only size and base options (no type, width, height)
 * <LayoutGuide config={{ layout: "grid", size: 20 }} />
 *
 * @example
 * // Columns layout - type (stretch|left|right|center), width, gutter, margin, offset
 * <LayoutGuide config={{ layout: "columns", type: "center", width: 100 }} />
 *
 * @example
 * // Rows layout - type (stretch|top|center|bottom), height, gutter, margin, offset
 * <LayoutGuide config={{ layout: "rows", type: "stretch", gutter: 20, margin: 50 }} />
 */
