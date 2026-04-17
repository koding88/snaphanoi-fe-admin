export type AuthStatus = "idle" | "loading" | "authenticated" | "guest";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  countryCode: string | null;
  roleId: string | null;
  roleName: string | null;
  roleKey: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
