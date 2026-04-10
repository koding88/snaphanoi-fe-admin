export const ROUTES = {
  root: "/",
  login: "/login",
  register: "/register",
  registerConfirm: "/register-confirm",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  admin: {
    dashboard: "/admin",
    users: {
      root: "/admin/users",
      create: "/admin/users/create",
      detail: (id: string) => `/admin/users/${id}`,
      edit: (id: string) => `/admin/users/${id}/edit`,
      me: "/admin/users/me",
      changePassword: "/admin/users/change-password",
    },
    roles: {
      root: "/admin/roles",
      create: "/admin/roles/create",
      detail: (id: string) => `/admin/roles/${id}`,
      edit: (id: string) => `/admin/roles/${id}/edit`,
    },
    galleries: {
      root: "/admin/galleries",
      create: "/admin/galleries/create",
      detail: (id: string) => `/admin/galleries/${id}`,
      edit: (id: string) => `/admin/galleries/${id}/edit`,
    },
    projects: {
      root: "/admin/projects",
      create: "/admin/projects/create",
      detail: (id: string) => `/admin/projects/${id}`,
      edit: (id: string) => `/admin/projects/${id}/edit`,
    },
    blogs: {
      root: "/admin/blogs",
      create: "/admin/blogs/create",
      detail: (id: string) => `/admin/blogs/${id}`,
      edit: (id: string) => `/admin/blogs/${id}/edit`,
    },
  },
} as const;
