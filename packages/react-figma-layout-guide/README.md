# react-figma-layout-guide

[![npm](https://img.shields.io/npm/v/react-figma-layout-guide)](https://www.npmjs.com/package/react-figma-layout-guide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![ci](https://img.shields.io/github/actions/workflow/status/CHR-onicles/react-figma-layout-guide/test.yml?branch=main&label=tests)](https://github.com/CHR-onicles/react-figma-layout-guide/actions/workflows/test.yml)

Overlay a **Figma-style layout guide** in React with columns, rows, or a square grid, with optional responsive settings per breakpoint.

## Features

- 📐 **Layouts**: `columns`, `rows`, or `grid` with alignment options for columns and rows
- 📱 **Responsive config** via `mediaQueries` (mobile / tablet / desktop)
- ⌨️ **Toggle visibility** with **Shift+G**
- ✨ **Animations** for guide lines (configurable)
- 📦 **Lightweight** — 5 kB gzipped with **zero** dependencies

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
  process.env.DEV && <LayoutGuide config={{ layout: "grid", size: 25 }} />;
}
```

The layout guide is absolutely positioned and intended to sit above your UI with a large z-index while you align layouts; use `defaultVisible` or **Shift+G** to show or hide it.

## Usage

Pass all options through the **`config`** prop. Types are inferred on the component. You get distinct shapes for `grid` vs `columns` vs `rows` exactly as Figma does.

### Columns

```tsx
<LayoutGuide
  config={{
    layout: "columns",
    type: "center", // stretch | left | right | center
    count: 5,
    width: 25,
    gutter: 20,
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
    height: 50,
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
    size: 25, // cell size in px; columns/rows derived from viewport
  }}
/>
```

### Responsive `mediaQueries`

When you use `mediaQueries`, put **only** shared options at the top level (`color`, `animate`, `defaultVisible`). Put `layout` and layout-specific fields inside each breakpoint.

Breakpoints (viewport width):

| Key       | Range          |
| --------- | -------------- |
| `mobile`  | &lt; 768px     |
| `tablet`  | 768px – 1023px |
| `desktop` | ≥ 1024px       |

```tsx
<LayoutGuide
  config={{
    color: "hsl(200 80% 50% / 0.15)",
    defaultVisible: false,
    mediaQueries: {
      mobile: { layout: "columns", type: "stretch", count: 4, width: 20 },
      tablet: { layout: "columns", type: "center", count: 8, width: 24 },
      desktop: { layout: "grid", size: 32 },
    },
  }}
/>
```

## Keyboard and visibility

- **Shift+G** toggles the guide on and off.
- Set **`defaultVisible: true`** in `config` if it should start visible.

## API summary

| Option           | Applies to        | Default                  | Notes                                      |
| ---------------- | ----------------- | ------------------------ | ------------------------------------------ |
| `layout`         | all               | `"columns"`              | `"grid"` \| `"columns"` \| `"rows"`        |
| `color`          | all               | `hsl(0, 100%, 50%, 0.1)` | Any CSS color                              |
| `animate`        | all               | `true`                   | Staggered line animation                   |
| `defaultVisible` | all               | `false`                  | Without Shift+G                            |
| `size`           | `grid`            | `25`                     | Cell size (px)                             |
| `type`           | `columns`         | `"stretch"`              | `stretch` \| `left` \| `right` \| `center` |
| `type`           | `rows`            | `"stretch"`              | `stretch` \| `top` \| `center` \| `bottom` |
| `width`          | `columns`         | `25`                     | Column width (px)                          |
| `height`         | `rows`            | `50`                     | Row height (px)                            |
| `count`          | `columns`, `rows` | `5`                      | Number of tracks                           |
| `gutter`         | `columns`, `rows` | `20`                     | Gap between tracks (px)                    |
| `margin`         | `columns`, `rows` | `0`                      | Outer margin (px)                          |
| `offset`         | `columns`, `rows` | `0`                      | For `left`/`right` or `top`/`bottom` types |

## License

[MIT](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
