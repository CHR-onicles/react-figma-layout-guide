import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/playground.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
