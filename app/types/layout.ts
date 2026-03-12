type LayoutOption = "grid" | "columns" | "rows";

// Alignment types scoped to each layout option
type ColumnsOptionType = "stretch" | "left" | "right" | "center";
type RowsOptionType = "stretch" | "top" | "center" | "bottom";

type LayoutMediaQueries = {
  /**
   * Screen sizes <= 767px
   */
  mobile?: Omit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes between 768px and 1023px
   */
  tablet?: Omit<LayoutDefault, "mediaQueries">;

  /**
   * Screen sizes >= 1024px
   */
  desktop?: Omit<LayoutDefault, "mediaQueries">;
};

export type LayoutBase = {
  /**
   * "grid" | "columns" | "rows"
   *
   * Default: "columns"
   */
  option?: LayoutOption;

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
   * Config to setup layout for each media query: mobile, tablet and desktop using mobile-first.
   */
  mediaQueries?: LayoutMediaQueries;
};

// Type is scoped to option
export type LayoutDefault =
  | (LayoutBase & {
      option: "grid";
      type?: never;

      /**
       * For option: grid
       *
       * Default: 10px
       */
      size?: number;
    })
  | (LayoutBase & {
      option: "columns";
      type?: ColumnsOptionType;

      /**
       * For option: columns
       *
       * Default: 10px
       */
      width?: number | "auto";

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
      option: "rows";
      type?: RowsOptionType;

      /**
       * For option: rows
       *
       * Default: 10px
       */
      height?: number | "auto";

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
 * Props for LayoutVanilla component.
 * Pass layout configuration via the `config` prop.
 *
 * @example
 * // Grid layout - only size and base options (no type, width, height)
 * <LayoutVanilla config={{ option: "grid", size: 20 }} />
 *
 * @example
 * // Columns layout - type (stretch|left|right|center), width, gutter, margin, offset
 * <LayoutVanilla config={{ option: "columns", type: "center", width: 100 }} />
 *
 * @example
 * // Rows layout - type (stretch|top|center|bottom), height, gutter, margin, offset
 * <LayoutVanilla config={{ option: "rows", type: "stretch", gutter: 20, margin: 50 }} />
 */
export type LayoutVanillaProps = {
  config: LayoutDefault;
};
