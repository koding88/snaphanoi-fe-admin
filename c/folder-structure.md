frontend-admin/
├── public/
│   ├── images/
│   │   ├── auth/
│   │   ├── brand/
│   │   └── placeholders/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── register-confirm/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── edit/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── me/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── change-password/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── roles/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn generated components
│   │   ├── shared/
│   │   │   ├── app-logo.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading-state.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── data-table/
│   │   │   └── form/
│   │   ├── auth/
│   │   │   ├── auth-shell.tsx
│   │   │   ├── auth-card.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── register-confirm-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   └── reset-password-form.tsx
│   │   ├── admin/
│   │   │   ├── admin-shell.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── admin-topbar.tsx
│   │   │   ├── admin-page-container.tsx
│   │   │   └── dashboard-placeholder.tsx
│   │   ├── users/
│   │   │   ├── users-table.tsx
│   │   │   ├── user-form.tsx
│   │   │   ├── user-detail-card.tsx
│   │   │   ├── user-status-badge.tsx
│   │   │   └── restore-user-dialog.tsx
│   │   └── roles/
│   │       ├── roles-table.tsx
│   │       ├── role-form.tsx
│   │       ├── role-detail-card.tsx
│   │       └── role-users-table.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── login.ts
│   │   │   │   ├── logout.ts
│   │   │   │   ├── logout-all.ts
│   │   │   │   ├── me.ts
│   │   │   │   ├── refresh.ts
│   │   │   │   ├── register.ts
│   │   │   │   ├── register-confirm.ts
│   │   │   │   ├── forgot-password.ts
│   │   │   │   └── reset-password.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth-bootstrap.ts
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-logout.ts
│   │   │   │   ├── use-register.ts
│   │   │   │   ├── use-register-confirm.ts
│   │   │   │   ├── use-forgot-password.ts
│   │   │   │   └── use-reset-password.ts
│   │   │   ├── store/
│   │   │   │   └── auth.store.ts
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   └── auth-api.types.ts
│   │   │   └── utils/
│   │   │       ├── auth-guards.ts
│   │   │       └── auth-mappers.ts
│   │   │
│   │   ├── users/
│   │   │   ├── api/
│   │   │   │   ├── list-users.ts
│   │   │   │   ├── get-user.ts
│   │   │   │   ├── create-user.ts
│   │   │   │   ├── update-user.ts
│   │   │   │   ├── delete-user.ts
│   │   │   │   ├── restore-user.ts
│   │   │   │   ├── update-my-profile.ts
│   │   │   │   └── change-my-password.ts
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   └── roles/
│   │       ├── api/
│   │       │   ├── list-roles.ts
│   │       │   ├── get-role.ts
│   │       │   ├── create-role.ts
│   │       │   ├── update-role.ts
│   │       │   ├── delete-role.ts
│   │       │   └── list-role-users.ts
│   │       ├── hooks/
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── request.ts
│   │   │   ├── endpoints.ts
│   │   │   └── errors.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   ├── query.ts
│   │   │   └── validation.ts
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── nav.ts
│   │   │   └── app.ts
│   │   └── icons/
│   │       └── fa.ts
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-mounted.ts
│   │   └── use-page-title.ts
│   │
│   ├── providers/
│   │   ├── app-provider.tsx
│   │   ├── query-provider.tsx          # nếu sau này dùng TanStack Query
│   │   ├── theme-provider.tsx
│   │   └── toast-provider.tsx
│   │
│   ├── styles/
│   │   ├── theme.css
│   │   └── motion.css
│   │
│   ├── types/
│   │   ├── api-response.ts
│   │   ├── common.ts
│   │   └── env.d.ts
│   │
│   └── middleware.ts
│
├── components.json                      # shadcn config
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
└── README.md