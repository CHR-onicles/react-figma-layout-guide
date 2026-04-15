# react-figma-layout-guide

[![npm](https://img.shields.io/npm/v/react-figma-layout-guide)](https://www.npmjs.com/package/react-figma-layout-guide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![ci](https://img.shields.io/github/actions/workflow/status/CHR-onicles/react-figma-layout-guide/test.yml?branch=main&label=tests)](https://github.com/CHR-onicles/react-figma-layout-guide/actions/workflows/test.yml)

Overlay a **Figma-style layout guide** in React with columns, rows, or a square grid, with optional responsive settings per breakpoint.

## Features

- 📐 **Layouts**: `columns`, `rows`, or `grid` with alignment options for columns and rows
- 🎯 **Position**: Overlay can be anchored to the viewport or a specific container
- 📱 **Responsive config** via `mediaQueries` (mobile / tablet / desktop)
- ⌨️ **Toggle visibility** with **Shift+G**
- ✨ **Animations** for guide lines (configurable)
- 📦 **Lightweight**: 7kB gzipped with **zero** dependencies

## [Playground](https://react-figma-layout-guide.vercel.app/)

![Playground screenshot](https://raw.githubusercontent.com/CHR-onicles/react-figma-layout-guide/main/assets/playground.png)

## Installation

```bash
npm install -D react-figma-layout-guide
```

**Peer dependency:** `react` >= 18.

## Quick start

Import the component and the stylesheet once (for example in your app root) and use it **only** in development. It is **not** intended for production:

```tsx
import { LayoutGuide } from "react-figma-layout-guide";
import "react-figma-layout-guide/style.css";

export function App() {
  return (
    <>
      {
        // For Vite setups:
        import.meta.env.DEV && (
          <LayoutGuide config={{ layout: "columns", count: 12 }} />
        )
      }
      {/* your app */}
    </>
  );
}
```

```tsx
// Or for Node-based setups:
{
  process.env.NODE_ENV === "development" && (
    <LayoutGuide config={{ layout: "grid", size: 25 }} />
  );
}
```

The layout guide uses **`position: "fixed"`** by default so it covers the entire viewport, with a large z-index above your UI; use `defaultVisible` or **Shift+G** to show or hide it. Set **`position: "absolute"`** if you want it scoped to a parent container (see [Position](#position)).

## Usage

Pass all options through the **`config`** prop. Types are inferred on the component. You get distinct shapes for `grid` vs `columns` vs `rows` exactly as Figma does, and some extra options for practicality in web development.

### Columns

```tsx
<LayoutGuide
  config={{
    layout: "columns",
    type: "center", // stretch | left | right | center
    count: 5,
    columnWidth: 25,
    gutter: "2rem",
    margin: 0,
    offset: 0, // used with type left | right
  }}
/>
```

### Rows

```tsx
<LayoutGuide
  config={{
    layout: "rows",
    type: "stretch", // stretch | top | center | bottom
    count: 5,
    rowHeight: 50,
    gutter: 20,
    margin: 0,
    offset: 0, // used with type top | bottom
  }}
/>
```

### Grid

```tsx
<LayoutGuide
  config={{
    layout: "grid",
    size: 25, // cell size in px; columns/rows derived from viewport for position: "fixed" or parent container for position: "absolute"
  }}
/>
```

### Position

`position` controls how the overlay is anchored:

| Value                 | Behavior                        |
| --------------------- | ------------------------------- |
| `"fixed"` _(default)_ | Covers the entire **viewport**. |
| `"absolute"`          | Covers the parent container.    |

If you use **`"absolute"`**, the parent element **must** establish a containing block—typically `position: relative` (or `absolute` / `fixed` / `sticky`). Render `<LayoutGuide />` **inside** that element.

With **`mediaQueries`**, set `position` at the **top level** next to `color`, `animate`, and `defaultVisible` (it applies to all breakpoints).

```tsx
<LayoutGuide
  config={{
    position: "absolute",
    layout: "columns",
    count: 12,
  }}
/>
```

### Overlay width

**`overlayWidth`** is only valid when `type` is `"stretch"` (or omitted, since `type` defaults to `"stretch"`) for `columns` layout. It sets the width of the overlay for fluid layouts (number for px, or a string such as `%`, `rem`, `min(90%, 1200px)`). Omit it to use the default full viewport/parent behavior. Combine with `margin: "auto"` to center the overlay.

```tsx
<LayoutGuide
  config={{
    layout: "columns",
    type: "stretch",
    margin: "auto", // To center the overlay
    overlayWidth: "min(90%, var(--breakpoint-xl))", // To cap the width at var(--breakpoint-xl), or whichever value you use in your project
  }}
/>
```

### Margin and offset

- **`margin`** applies when `type` is `stretch` (outer space around the tracks: horizontal for columns, vertical for rows).
- **`offset`** applies when `type` is `left` / `right` (columns) or `top` / `bottom` (rows) instead of margin in those layouts.

Pass a **number** for pixel values or a **string** to use relative units or other CSS lengths to mimic your project, for example:

```tsx
margin: "5vw";
// or
offset: "10%";
// or
margin: "clamp(1rem, 4vw, 3rem)";
```

### Responsive `mediaQueries`

When you use `mediaQueries`, put **only** shared options at the top level (ie: `color`, `animate`, `defaultVisible`, `position`). Put `layout` and layout-specific fields inside each breakpoint.

Each breakpoint is configured in isolation: values do **not** cascade from `mobile` → `tablet` → `desktop`. If a breakpoint needs a given option (for example `layout`, `count`, or `gutter`), declare it there explicitly. Smarter merging or inheritance across breakpoints is not available yet but may arrive in a future version.

Breakpoints (viewport width):

| Key       | Range          |
| --------- | -------------- |
| `mobile`  | &lt; 768px     |
| `tablet`  | 768px – 1023px |
| `desktop` | ≥ 1024px       |

```tsx
<LayoutGuide
  config={{
    color: "hsl(200, 80%, 50%, 0.15)",
    defaultVisible: true,
    mediaQueries: {
      mobile: { layout: "columns", type: "stretch", count: 4, columnWidth: 20 },
      tablet: { layout: "columns", type: "center", count: 12, columnWidth: 40 },
      desktop: { layout: "grid", size: 32 },
    },
  }}
/>
```

## Keyboard and visibility

- **Shift+G** toggles the guide on and off.
- Set **`defaultVisible: true`** in `config` if it should start visible.

## API summary

| Option           | Applies to                       | Default                  | Notes                                                                                                                                                                |
| ---------------- | -------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`         | all                              | `"columns"`              | `"grid"` \| `"columns"` \| `"rows"`                                                                                                                                  |
| `color`          | all                              | `hsl(0, 100%, 50%, 0.1)` | Any CSS color                                                                                                                                                        |
| `animate`        | all                              | `true`                   | Staggered line animation                                                                                                                                             |
| `defaultVisible` | all                              | `false`                  | Without Shift+G                                                                                                                                                      |
| `position`       | all                              | `"fixed"`                | `"fixed"` (viewport) \| `"absolute"` (parent-scoped; parent must be positioned). See [Position](#position).                                                          |
| `size`           | `grid`                           | `25`                     | Cell size (px)                                                                                                                                                       |
| `type`           | `columns`                        | `"stretch"`              | `stretch` \| `left` \| `right` \| `center`                                                                                                                           |
| `type`           | `rows`                           | `"stretch"`              | `stretch` \| `top` \| `center` \| `bottom`                                                                                                                           |
| `columnWidth`    | `columns`                        | `25`                     | Column width (px)                                                                                                                                                    |
| `overlayWidth`   | `columns` (type: `stretch` only) | undefined                | Overlay width: **number** (px) or **string** (any CSS length or variable). Invalid when `type` is `left`, `right`, or `center`. See [Overlay width](#overlay-width). |
| `rowHeight`      | `rows`                           | `50`                     | Row height (px)                                                                                                                                                      |
| `count`          | `columns`, `rows`                | `5`                      | Number of tracks                                                                                                                                                     |
| `gutter`         | `columns`, `rows`                | `20`                     | Gap between tracks: **number** → `px`, or **string** (any CSS length: `rem`, `%`, `clamp()`, …)                                                                      |
| `margin`         | `columns`, `rows`                | `0`                      | Space outside rows/columns for type `stretch`: **number** → `px`, or **string** (any CSS length: `%`, `vw`, `vh`, `rem`, `clamp()`, …)                               |
| `offset`         | `columns`, `rows`                | `0`                      | Space outside rows/columns for `left`/`right` or `top`/`bottom` types; same **number** \| **string** rules as `margin`                                               |

## License

[MIT](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
