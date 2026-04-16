import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { ROUTES } from "@/lib/constants/routes";
import { faClockRotateLeft, faFilm, faHouse, faLayerGroup, faPenNib, faRectangleList, faShieldHalved, faUserGroup } from "@/lib/icons/fa";

export type AdminNavItem = {
  key: "dashboard" | "users" | "roles" | "galleries" | "projects" | "blogs" | "packages" | "orders";
  href: string;
  icon: IconDefinition;
};

export function isAdminNavItemActive(href: string, pathname: string) {
  if (href === ROUTES.admin.dashboard) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: "dashboard",
    href: ROUTES.admin.dashboard,
    icon: faHouse,
  },
  {
    key: "users",
    href: ROUTES.admin.users.root,
    icon: faUserGroup,
  },
  {
    key: "roles",
    href: ROUTES.admin.roles.root,
    icon: faShieldHalved,
  },
  {
    key: "galleries",
    href: ROUTES.admin.galleries.root,
    icon: faFilm,
  },
  {
    key: "projects",
    href: ROUTES.admin.projects.root,
    icon: faRectangleList,
  },
  {
    key: "blogs",
    href: ROUTES.admin.blogs.root,
    icon: faPenNib,
  },
  {
    key: "packages",
    href: ROUTES.admin.packages.root,
    icon: faLayerGroup,
  },
  {
    key: "orders",
    href: ROUTES.admin.orders.root,
    icon: faClockRotateLeft,
  },
];
