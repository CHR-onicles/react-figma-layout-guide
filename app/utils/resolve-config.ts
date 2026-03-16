import type {
  FlatConfig,
  LayoutMediaQueries,
  LayoutVanillaProps,
} from "~/types/layout";
import { getBreakpoint } from "./get-breakpoint";

export function resolveConfig(
  config: LayoutVanillaProps["config"],
  width: number,
): FlatConfig {
  const mq = (config as { mediaQueries?: LayoutMediaQueries }).mediaQueries;

  if (!mq) return config as FlatConfig;

  const { color, animate, defaultVisible } = config;
  const bp = getBreakpoint(width);

  const breakpointConfig =
    bp === "desktop"
      ? (mq.desktop ?? mq.tablet ?? mq.mobile)
      : bp === "tablet"
        ? (mq.tablet ?? mq.mobile)
        : mq.mobile;

  return { color, animate, defaultVisible, ...breakpointConfig };
}
