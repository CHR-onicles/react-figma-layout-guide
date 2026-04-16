# react-figma-layout-guide playground

[![npm](https://img.shields.io/npm/v/react-figma-layout-guide)](https://www.npmjs.com/package/react-figma-layout-guide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tests](https://img.shields.io/github/actions/workflow/status/CHR-onicles/react-figma-layout-guide/test.yml?branch=main&label=tests)](https://github.com/CHR-onicles/react-figma-layout-guide/actions/workflows/test.yml)

Monorepo for:

- **react-figma-layout-guide** package: a React overlay for Figma-style column, row, and grid layout guides.
- A React Router app playground to test the component interactively.

## [Playground](https://react-figma-layout-guide.vercel.app/)

![Playground screenshot](./assets/playground.png)

## Using the package

If you are installing the package in your own app, see this documentation:

**[packages/react-figma-layout-guide/README.md](packages/react-figma-layout-guide/README.md)** — install, imports, config, API, and keyboard shortcuts.

## Requirements

- [Node.js](https://nodejs.org/) **20** or newer.

## Getting started (development)

From the repository root:

```bash
npm install
npm run dev
```

## Working on the package

Build the package (from repo root, npm workspaces):

```bash
npm run build --workspace=react-figma-layout-guide
```

Or from the package folder:

```bash
cd packages/react-figma-layout-guide
npm run build
```

## Contributing

Issues and pull requests are welcome.

### License

[MIT](https://github.com/CHR-onicles/react-figma-layout-guide/blob/main/LICENSE)
