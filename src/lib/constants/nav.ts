import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { ROUTES } from "@/lib/constants/routes";
import { faCircleNodes, faFilm, faHouse, faLayerGroup, faPenNib, faRectangleList, faShieldHalved, faUserGroup } from "@/lib/icons/fa";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
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
    href: ROUTES.admin.dashboard,
    label: "Dashboard",
    description: "Control room overview",
    icon: faHouse,
  },
  {
    href: ROUTES.admin.users.root,
    label: "Users",
    description: "People and access",
    icon: faUserGroup,
  },
  {
    href: ROUTES.admin.roles.root,
    label: "Roles",
    description: "Role definitions",
    icon: faShieldHalved,
  },
  {
    href: ROUTES.admin.galleries.root,
    label: "Galleries",
    description: "Portfolio groups",
    icon: faFilm,
  },
  {
    href: ROUTES.admin.projects.root,
    label: "Projects",
    description: "Stories and covers",
    icon: faRectangleList,
  },
  {
    href: ROUTES.admin.blogs.root,
    label: "Blogs",
    description: "Journal and stories",
    icon: faPenNib,
  },
  {
    href: ROUTES.admin.packages.root,
    label: "Packages",
    description: "Session offerings",
    icon: faLayerGroup,
  },
  {
    href: ROUTES.admin.orders.root,
    label: "Orders",
    description: "Requests and fulfillment",
    icon: faCircleNodes,
  },
];
