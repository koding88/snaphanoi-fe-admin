export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  countryCode: string | null;
  roleId: string | null;
  roleName: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UsersListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UsersListResult = {
  items: UserRecord[];
  meta: UsersListMeta;
};

export type UserListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isActive?: boolean | "all";
  roleId?: string;
  includeDeleted?: boolean;
};

export type RoleOption = {
  id: string;
  key: string;
  name: string;
  isSystem: boolean;
  activeUsersCount: number;
  deletedUsersCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RolesListResult = {
  items: RoleOption[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
