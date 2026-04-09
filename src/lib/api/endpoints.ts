export const API_ENDPOINTS = {
  auth: {
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
    logoutAll: "/api/v1/auth/logout-all",
    me: "/api/v1/auth/me",
    register: "/api/v1/auth/register",
    registerConfirm: "/api/v1/auth/register/confirm",
    forgotPassword: "/api/v1/auth/forgot-password",
    resetPassword: "/api/v1/auth/reset-password",
  },
  users: {
    list: "/api/v1/users",
    byId: (id: string) => `/api/v1/users/${id}`,
    restore: (id: string) => `/api/v1/users/${id}/restore`,
    me: "/api/v1/users/me",
    changePassword: "/api/v1/users/me/password",
  },
  roles: {
    list: "/api/v1/roles",
    byId: (id: string) => `/api/v1/roles/${id}`,
    users: (id: string) => `/api/v1/roles/${id}/users`,
  },
  galleries: {
    list: "/api/v1/galleries",
    byId: (id: string) => `/api/v1/galleries/${id}`,
    restore: (id: string) => `/api/v1/galleries/${id}/restore`,
  },
  projects: {
    list: "/api/v1/projects",
    byId: (id: string) => `/api/v1/projects/${id}`,
    restore: (id: string) => `/api/v1/projects/${id}/restore`,
  },
  files: {
    requestUpload: "/api/v1/files/request-upload",
  },
  health: {
    live: "/api/health/live",
    ready: "/api/health/ready",
  },
} as const;
