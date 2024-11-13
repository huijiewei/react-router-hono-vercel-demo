import type { RouteConfigEntry } from "@react-router/dev/routes";

export type RouteManifestEntry = {
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  id: string;
  parentId?: string;
  file: string;
};

export type RouteManifest = {
  [routeId: string]: RouteManifestEntry;
};

export const routeManifestToRouteConfig = (routeManifest: RouteManifest, rootId = "root"): RouteConfigEntry[] => {
  const routeConfigById: {
    [id: string]: Omit<RouteConfigEntry, "id"> & Required<Pick<RouteConfigEntry, "id">>;
  } = {};

  for (const id in routeManifest) {
    const route = routeManifest[id];
    routeConfigById[id] = {
      id: route.id,
      file: route.file,
      path: route.path,
      index: route.index,
      caseSensitive: route.caseSensitive,
    };
  }

  const routeConfig: RouteConfigEntry[] = [];

  for (const id in routeConfigById) {
    const route = routeConfigById[id];
    const parentId = routeManifest[route.id].parentId;
    if (parentId === rootId) {
      routeConfig.push(route);
    } else {
      const parentRoute = parentId && routeConfigById[parentId];
      if (parentRoute) {
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push(route);
      }
    }
  }

  return routeConfig;
};
