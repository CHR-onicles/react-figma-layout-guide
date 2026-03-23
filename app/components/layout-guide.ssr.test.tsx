/** @vitest-environment node */

import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LayoutGuide } from "./layout-guide";
import { resolveConfig } from "~/utils/resolve-config";

vi.mock("~/utils/resolve-config", async importOriginal => {
  const module =
    await importOriginal<typeof import("~/utils/resolve-config")>();
  return { ...module, resolveConfig: vi.fn(module.resolveConfig) };
});

describe("LayoutGuide SSR/no window", () => {
  it("does not throw when rendered without a browser environment", () => {
    expect(() =>
      renderToString(<LayoutGuide config={{ layout: "columns" }} />),
    ).not.toThrow();
  });

  it("uses 1024 as the viewport width instead of window.innerWidth when window is undefined (in ssr)", () => {
    renderToString(<LayoutGuide config={{ layout: "columns" }} />);

    expect(resolveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ layout: "columns" }),
      1024,
    );
  });
});
