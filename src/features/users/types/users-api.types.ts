import type { UserRecord } from "@/features/users/types/users.types";

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  countryCode: string;
  roleId: string;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  countryCode: string;
  roleId: string;
  isActive: boolean;
};

export type UpdateMyProfilePayload = {
  name: string;
  phoneNumber?: string;
  countryCode: string;
};

export type RequestMyEmailChangeOtpPayload = {
  email: string;
};

export type RequestMyEmailChangeOtpResult = {
  requested: true;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
};

export type VerifyMyEmailChangeOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyMyEmailChangeOtpResult = UserRecord;

export type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type DeleteUserResult = {
  message: string;
};

export type ChangeMyPasswordResult = {
  changed: true;
};

export type UserMutationResult = UserRecord;
