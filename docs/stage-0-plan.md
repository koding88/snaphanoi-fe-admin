# Stage 0 Plan

This document consolidates the current frontend planning input from:

- `c/instruction-prompt.md`
- `c/folder-structure.md`
- `c/frontend-facing-backend-brief.md`
- `c/Postman-collection.json`

Assumption for this pass: "Inject info" means turning the provided handoff files into a repo-native Stage 0 planning artifact without starting Stage 1 implementation.

## 1. Short Conclusion

- The frontend should be built as a staged Next.js admin app with two major route groups: public auth flows and protected admin flows.
- Backend scope is clear enough to lock the initial FE route map, auth model, API boundaries, and feature/module structure.
- Stage 1 should focus only on foundation: app shell, theme, API client, env pattern, global providers, and responsive layout primitives.

## 2. Route Map

### Public routes

- `/login`
- `/register`
- `/register-confirm`
- `/forgot-password`
- `/reset-password`

### Protected routes

- `/admin`
- `/admin/users`
- `/admin/users/create`
- `/admin/users/[id]`
- `/admin/users/[id]/edit`
- `/admin/users/me`
- `/admin/users/change-password`
- `/admin/roles`
- `/admin/roles/create`
- `/admin/roles/[id]`
- `/admin/roles/[id]/edit`

### Supporting behavior

- `/` should redirect based on auth state:
  - authenticated -> `/admin`
  - unauthenticated -> `/login`
- Middleware should protect `/admin/*`.
- Public auth pages should redirect authenticated users away from `/login`, `/register`, `/forgot-password`, and `/reset-password` when appropriate.
- `register-confirm` and `reset-password` must remain token-driven public routes.

## 3. Page Map

### Public auth pages

- `login`
  - email/password form
  - success: set session, bootstrap current user, go to `/admin`
  - error: inline/auth toast handling
- `register`
  - name/email/password/countryCode
  - success: confirmation email sent state
- `register-confirm`
  - token input or token-from-query handling
  - success: direct user to `/login`
- `forgot-password`
  - email form
  - success: always generic confirmation state
- `reset-password`
  - token + new password + confirm password
  - success: clear local auth and route to `/login`

### Admin pages

- `admin dashboard`
  - practical placeholder summary
  - health/status cards can be added later if useful
- `users list`
  - filters from backend-supported query params
  - table + pagination + active/deleted awareness
- `user detail`
  - self-or-admin view handling based on route/data
- `create user`
- `edit user`
- `my profile`
- `change my password`
- `roles list`
  - filters from backend-supported query params
- `role detail`
  - include role users section
- `create role`
- `edit role`

## 4. Auth Model for FE

### Session shape

- Access token drives authenticated requests.
- Refresh token flow renews the session.
- `GET /api/v1/auth/me` is the source of truth for current user bootstrap.

### FE auth lifecycle

1. On login success:
   - persist token/session payload
   - fetch or hydrate current user
   - mark auth as authenticated
2. On app bootstrap:
   - if access token exists, attempt `me`
   - if `me` fails with `401`, attempt `refresh`
   - if refresh fails, clear auth state and treat user as logged out
3. On logout or logout-all success:
   - clear auth state regardless of idempotent backend behavior
4. On reset-password success:
   - clear auth state immediately
   - route user to login

### Role and access assumptions

- Admin-only pages require an authenticated user with admin-capable role/permission set.
- `GET /users/:id` is self-or-admin at backend level, but admin UI should still primarily live inside protected admin routes.
- Profile endpoints (`/users/me`, `/users/me/password`) should be reachable from admin shell for authenticated users.

### Non-negotiable UX rules from backend

- Register does not create a usable account immediately.
- Register confirm does not auto-login.
- Forgot password must always show a generic success state.
- Refresh failure means local logout.

## 5. API Integration Model

### Base patterns

- Base URL via env, for example `NEXT_PUBLIC_API_BASE_URL`.
- Central request layer in `src/lib/api`.
- Standard envelope handling:
  - success responses unwrap `data`
  - error responses normalize `error`, `statusCode`, and optional `message`
- Protected requests automatically attach access token.
- Retry logic should be limited to token refresh flow, not blind request retries.

### Endpoint groups

#### Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/register/confirm`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

#### Users

- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `PATCH /api/v1/users/:id/restore`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`

#### Roles

- `GET /api/v1/roles`
- `GET /api/v1/roles/:id`
- `POST /api/v1/roles`
- `PATCH /api/v1/roles/:id`
- `DELETE /api/v1/roles/:id`
- `GET /api/v1/roles/:id/users`

#### Health

- `GET /api/health/live`
- `GET /api/health/ready`

### Query parameter notes from Postman

- Users list:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
  - `roleId`
  - `includeDeleted`
- Roles list:
  - `page`
  - `limit`
  - `keyword`
  - `isSystem`
- Role users list:
  - `status`
  - `page`
  - `limit`

### Error handling notes

- `401` on login means invalid credentials.
- `401` on refresh or me means session is not recoverable unless refresh succeeds.
- Domain errors like `USER_EMAIL_ALREADY_EXISTS` and `REGISTRATION_TOKEN_INVALID` should map to friendly form-level messages.

## 6. State Model

### Global state via Zustand

- `auth.store.ts`
  - tokens/session payload
  - current user
  - auth status: `idle | loading | authenticated | guest`
  - bootstrap flag
- UI-only global state if needed later:
  - sidebar open/collapsed
  - lightweight global preferences

### Keep local state local

- Form input state should remain inside form components or form hooks.
- Table query state can remain page-local unless reused across multiple routes.
- Do not globalize CRUD form drafts.

### Suggested data ownership

- API modules perform requests and normalize payloads.
- Hooks orchestrate loading/error/submission behavior.
- Zustand holds session/auth only, not every fetched dataset.

## 7. Component and Layout Strategy

### App-level structure

- `src/app/(public)` for auth pages
- `src/app/(admin)` for protected shell
- `src/components/shared` for reused primitives
- `src/components/auth`, `src/components/admin`, `src/components/users`, `src/components/roles` for domain UI
- `src/features/*` for feature-scoped API/hooks/types/store/utils

### Layout decisions

- Public layout:
  - premium but restrained auth shell
  - split-panel or editorial visual direction
  - responsive collapse for mobile
- Admin layout:
  - sidebar + topbar shell
  - clear content container
  - mobile drawer behavior

### Design direction

- Premium visual service, photographer-oriented, polished but not flashy.
- Refined spacing, strong image-led or editorial art direction for public auth pages.
- Admin UI should feel practical and sharp, not generic SaaS gray boxes.
- Motion should be subtle and purposeful.

### Reusable shared components expected early

- app logo
- page header
- loading / empty / error states
- form field wrappers
- confirmation dialog
- data table shell

## 8. Env and Config Assumptions

- `.env.example` should document at least:
  - `NEXT_PUBLIC_API_BASE_URL`
- Token storage approach should be decided in Stage 1 and implemented consistently across request layer and auth bootstrap.
- If backend relies on cookies for refresh instead of explicit refresh token body, request client must support credentials mode. This needs confirmation during implementation.

## 9. Practical Implementation Order

### Stage 1

- Initialize Next.js app structure
- Configure Tailwind, shadcn/ui, Zustand, Font Awesome
- Create design tokens, theme CSS, motion baseline
- Add app providers and root layout
- Add API client foundation and env typing
- Add route constants and minimal app shell

### Stage 2

- Build auth pages and forms
- Implement auth store + bootstrap
- Wire login/register/register-confirm/forgot-password/reset-password
- Add middleware and basic route guards

### Stage 3

- Build protected admin shell
- Add sidebar/topbar/navigation
- Add dashboard placeholder and common UX states

### Stage 4

- Users list/detail/create/edit/delete/restore
- My profile and change password

### Stage 5

- Roles list/detail/create/edit/delete
- Role users view

### Stage 6

- Responsive refinement
- Motion polish
- UI consistency pass
- Final UX cleanup

## 10. Risks and Open Assumptions

- Refresh-token transport is not fully explicit in the brief. It may be cookie-based or payload-based.
- Exact auth payload shape from login/refresh/me is not yet documented in the provided summary, so FE types will need confirmation from live API or fuller Postman samples in Stage 2.
- Admin authorization model is described conceptually, but the precise role/permission fields on user objects are not yet specified.
- List response payload shapes for users and roles pagination are not yet summarized here and should be confirmed when implementing Stage 4 and Stage 5.
