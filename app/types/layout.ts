type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never; // To preserve discrimination in union

export type Breakpoint = "mobile" | "tablet" | "desktop";

export type LayoutOption = "grid" | "columns" | "rows";

// Alignment types scoped to each layout option
export type ColumnsOptionType = "stretch" | "left" | "right" | "center";
export type RowsOptionType = "stretch" | "top" | "center" | "bottom";

export type LayoutMediaQueries = {
  /**
   * Screen sizes <= 767px
   */
  mobile?: DistributiveOmit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes between 768px and 1023px
   */
  tablet?: DistributiveOmit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes >= 1024px
   */
  desktop?: DistributiveOmit<LayoutDefault, "mediaQueries">;
};

export type FlatConfig = {
  layout?: LayoutOption;
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
  layout?: LayoutOption;

  /**
   * Hex, rgb, hsl, or any other type of colors
   *
   * Default: hsl(0, 100%, 50%, 0.1) - Red
   */
  color?: string;

  /**
   * Whether or not to animate the appearance of the layout guide
   */
  animate?: boolean;

  /**
   * Whether the layout guide is visible by default (without pressing Shift+G).
   *
   * Default: false
   */
  defaultVisible?: boolean;

  /**
   * Config to setup layout for each media query: mobile, tablet and desktop using mobile-first.
   */
  mediaQueries?: LayoutMediaQueries;
};

// Type is scoped to option
export type LayoutDefault =
  | (LayoutBase & {
      layout: "grid";
      type?: never;

      /**
       * For option: grid
       *
       * Default: 10px
       */
      size?: number;
    })
  | (LayoutBase & {
      layout: "columns";
      type?: ColumnsOptionType;

      /**
       * For option: columns
       *
       * Default: 10px
       */
      width?: number;

      /**
       * Space outside the `rows` and `columns`, using logical properties.
       *
       * Default: 0
       */
      margin?: number;

      /**
       *  Space in between rows and columns.
       *
       * Default: 20px
       */
      gutter?: number;

      /**
       * For option type: left, right. Replaces margin in these scenarios.
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
      type?: RowsOptionType;

      /**
       * For option: rows
       *
       * Default: 10px
       */
      height?: number;

      /**
       * Space outside the `rows` and `columns`, using logical properties.
       *
       * Default: 0
       */
      margin?: number;

      /**
       *  Space in between rows and columns.
       *
       * Default: 20px
       */
      gutter?: number;

      /**
       * For option type: left, right, center. Replaces margin in these scenarios.
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

// Can be used always at the top level
export type LayoutGlobalProps = {
  color?: string;
  animate?: boolean;
  defaultVisible?: boolean;
};

// Branch 1: no mediaQueries → full layout config (current behavior)
type LayoutWithoutMediaQueries = LayoutDefault & { mediaQueries?: never };
// Branch 2: with mediaQueries → only global props at top level
type LayoutWithMediaQueries = LayoutGlobalProps & {
  mediaQueries: LayoutMediaQueries;
  // layout-specific props are forbidden at top level
  layout?: never;
};

export type LayoutGuideProps = {
  config: LayoutWithMediaQueries | LayoutWithoutMediaQueries;
};
