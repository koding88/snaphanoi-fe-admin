src
├── app
│   ├── (admin)
│   │   ├── admin
│   │   │   ├── page.tsx
│   │   │   ├── roles
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       ├── [id]
│   │   │       │   ├── edit
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── change-password
│   │   │       │   └── page.tsx
│   │   │       ├── create
│   │   │       │   └── page.tsx
│   │   │       ├── me
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (public)
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── register-confirm
│   │   │   └── page.tsx
│   │   └── reset-password
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── admin
│   │   ├── admin-kpi-card.tsx
│   │   ├── admin-module-placeholder.tsx
│   │   ├── admin-page-container.tsx
│   │   ├── admin-section-heading.tsx
│   │   ├── admin-shell-banner.tsx
│   │   ├── admin-shell.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── admin-surface.tsx
│   │   ├── admin-topbar.tsx
│   │   └── dashboard-placeholder.tsx
│   ├── auth
│   │   ├── admin-route-guard.tsx
│   │   ├── auth-bootstrap.tsx
│   │   ├── auth-card.tsx
│   │   ├── auth-feedback.tsx
│   │   ├── auth-field.tsx
│   │   ├── auth-form-shell.tsx
│   │   ├── auth-password-hint.tsx
│   │   ├── auth-shell.tsx
│   │   ├── auth-stage-placeholder.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── login-form.tsx
│   │   ├── public-route-guard.tsx
│   │   ├── register-confirm-form.tsx
│   │   ├── register-form.tsx
│   │   └── reset-password-form.tsx
│   ├── roles
│   │   ├── role-create-page.tsx
│   │   ├── role-detail-card.tsx
│   │   ├── role-detail-page.tsx
│   │   ├── role-edit-page.tsx
│   │   ├── role-form.tsx
│   │   ├── role-system-badge.tsx
│   │   ├── role-users-table.tsx
│   │   ├── roles-list-page.tsx
│   │   └── roles-table.tsx
│   ├── shared
│   │   ├── app-logo.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── foundation-placeholder.tsx
│   │   ├── loading-state.tsx
│   │   ├── page-header.tsx
│   │   └── status-badge.tsx
│   ├── ui
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── users
│       ├── change-password-form.tsx
│       ├── change-password-page.tsx
│       ├── my-profile-page.tsx
│       ├── profile-form.tsx
│       ├── user-create-page.tsx
│       ├── user-detail-card.tsx
│       ├── user-detail-page.tsx
│       ├── user-edit-page.tsx
│       ├── user-form.tsx
│       ├── user-role-badge.tsx
│       ├── user-status-badge.tsx
│       ├── users-list-page.tsx
│       └── users-table.tsx
├── features
│   ├── auth
│   │   ├── api
│   │   │   ├── forgot-password.ts
│   │   │   ├── login.ts
│   │   │   ├── me.ts
│   │   │   ├── refresh.ts
│   │   │   ├── register-confirm.ts
│   │   │   ├── register.ts
│   │   │   └── reset-password.ts
│   │   ├── hooks
│   │   │   └── use-auth-bootstrap.ts
│   │   ├── store
│   │   │   └── auth.store.ts
│   │   ├── types
│   │   │   ├── auth-api.types.ts
│   │   │   └── auth.types.ts
│   │   └── utils
│   │       ├── auth-errors.ts
│   │       ├── auth-storage.ts
│   │       └── password-policy.ts
│   ├── roles
│   │   ├── api
│   │   │   ├── create-role.ts
│   │   │   ├── delete-role.ts
│   │   │   ├── get-role.ts
│   │   │   ├── list-role-users.ts
│   │   │   ├── list-roles.ts
│   │   │   └── update-role.ts
│   │   ├── types
│   │   │   ├── roles-api.types.ts
│   │   │   └── roles.types.ts
│   │   └── utils
│   │       └── roles-errors.ts
│   ├── ui
│   │   └── store
│   │       └── app-shell.store.ts
│   └── users
│       ├── api
│       │   ├── change-my-password.ts
│       │   ├── create-user.ts
│       │   ├── delete-user.ts
│       │   ├── get-user.ts
│       │   ├── list-role-options.ts
│       │   ├── list-users.ts
│       │   ├── restore-user.ts
│       │   ├── update-my-profile.ts
│       │   └── update-user.ts
│       ├── types
│       │   ├── users-api.types.ts
│       │   └── users.types.ts
│       └── utils
│           ├── users-errors.ts
│           └── users-format.ts
├── lib
│   ├── api
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── errors.ts
│   │   └── request.ts
│   ├── constants
│   │   ├── app.ts
│   │   ├── nav.ts
│   │   └── routes.ts
│   ├── env.ts
│   ├── icons
│   │   └── fa.ts
│   └── utils.ts
├── providers
│   ├── app-provider.tsx
│   └── theme-provider.tsx
├── proxy.ts
├── styles
│   ├── motion.css
│   └── theme.css
└── types
    ├── api-response.ts
    ├── common.ts
    └── env.d.ts

51 directories, 134 files