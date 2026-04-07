export type RoleRecord = {
  id: string;
  key: string;
  name: string;
  isSystem: boolean;
  activeUsersCount: number;
  deletedUsersCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RolesListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RolesListResult = {
  items: RoleRecord[];
  meta: RolesListMeta;
};

export type RoleListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isSystem?: boolean | "all";
};

export type RoleUsersStatus = "all" | "active" | "inactive" | "deleted";

export type RoleUsersQuery = {
  status: RoleUsersStatus;
  page: number;
  limit: number;
};

export type RoleUserRecord = {
  id: string;
  name: string;
  email: string;
  countryCode: string | null;
  roleId: string;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoleUsersResult = {
  items: RoleUserRecord[];
  meta: RolesListMeta;
};
