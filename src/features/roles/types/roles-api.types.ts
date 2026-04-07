import type { RoleRecord } from "@/features/roles/types/roles.types";

export type RolePayload = {
  name: string;
};

export type DeleteRoleResult = {
  message: string;
};

export type RoleMutationResult = RoleRecord;
