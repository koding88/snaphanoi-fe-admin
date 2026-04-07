import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { ROUTES } from "@/lib/constants/routes";
import { faHouse, faShieldHalved, faUserGroup } from "@/lib/icons/fa";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconDefinition;
};

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
    description: "Permissions model",
    icon: faShieldHalved,
  },
];
