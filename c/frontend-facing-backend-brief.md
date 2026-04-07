1. **Kết luận ngắn**
- Backend hiện có 4 nhóm endpoint chính: `auth`, `users`, `roles`, `health`.
- Auth dùng JWT access token + refresh token flow; `me` cần access token hợp lệ.
- `register` hiện là 2 bước: đăng ký chỉ tạo pending registration và gửi mail xác nhận; bấm confirm mới tạo account thật.
- `register/confirm` không auto login.
- `forgot-password` luôn trả generic success, không lộ account existence.
- `reset-password` nếu thành công sẽ kill auth state cũ: refresh tokens/sessions cũ không còn dùng được.
- `logout` là idempotent.
- `users` và `roles` chủ yếu là admin-only; `GET /users/:id` có rule self-or-admin.
- Response API dùng envelope thống nhất: `success`, `error`, `statusCode`, `data`.
- Health routes hiện không versioned: `/api/health/*`.

2. **Frontend-facing backend brief**

**auth endpoints + flow**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/register/confirm`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

**users endpoints + flow**
- Admin quản user đầy đủ:
  - `GET /api/v1/users`
  - `GET /api/v1/users/:id`
  - `POST /api/v1/users`
  - `PATCH /api/v1/users/:id`
  - `DELETE /api/v1/users/:id`
  - `PATCH /api/v1/users/:id/restore`
- User tự thao tác profile:
  - `PATCH /api/v1/users/me`
  - `PATCH /api/v1/users/me/password`

**roles endpoints + flow**
- Admin quản role:
  - `GET /api/v1/roles`
  - `GET /api/v1/roles/:id`
  - `POST /api/v1/roles`
  - `PATCH /api/v1/roles/:id`
  - `DELETE /api/v1/roles/:id`
  - `GET /api/v1/roles/:id/users`

**health endpoints**
- `GET /api/health/live`
- `GET /api/health/ready`

**public/protected/admin-only/self-or-admin map**
- Public:
  - `login`
  - `register`
  - `register/confirm`
  - `forgot-password`
  - `reset-password`
  - health endpoints
- Protected:
  - `me`
  - `logout`
  - `logout-all`
  - `users/me`
  - `users/me/password`
- Admin-only:
  - gần như toàn bộ `users` admin routes
  - toàn bộ `roles` routes
- Self-or-admin:
  - `GET /api/v1/users/:id`

**response/error envelope**
- Success:
```json
{
  "success": true,
  "error": null,
  "statusCode": 200,
  "data": {}
}
```
- Error:
```json
{
  "success": false,
  "error": "ERROR_CODE_OR_MESSAGE",
  "statusCode": 400
}
```
- Validation/domain errors có thể thêm `message`.

**FE must-know notes**
- Không assume register xong là có account usable ngay.
- Không assume confirm registration sẽ login luôn.
- Forgot password luôn success kiểu generic.
- Reset password thành công thì nên coi session hiện tại là hết hiệu lực.
- Health path không có `/api/v1`.

3. **Auth model cho frontend**

**login**
- Endpoint: `POST /api/v1/auth/login`
- Request chính:
```json
{ "email": "user@gmail.com", "password": "Password123A" }
```
- Response chính: auth payload thành công, dùng để set authenticated state.
- FE implication: login xong mới coi user authenticated.
- Error/security note: sai credentials trả `401`, không dùng để suy luận sâu hơn.

**refresh**
- Endpoint: `POST /api/v1/auth/refresh`
- Request chính: refresh token flow của backend.
- Response chính: token/session mới.
- FE implication: dùng để renew auth state.
- Error/security note: refresh token invalid/revoked/missing => `401`, phải logout local.

**logout**
- Endpoint: `POST /api/v1/auth/logout`
- Request chính: authenticated request.
- Response chính: success.
- FE implication: clear local auth state.
- Error/security note: idempotent, không cần treat như flow lỗi nghiệp vụ.

**logout-all**
- Endpoint: `POST /api/v1/auth/logout-all`
- Request chính: authenticated request.
- Response chính: success.
- FE implication: logout khỏi mọi session; clear local auth state luôn.
- Error/security note: thiếu auth => `401`.

**me**
- Endpoint: `GET /api/v1/auth/me`
- Request chính: access token hợp lệ.
- Response chính: current user.
- FE implication: endpoint chuẩn để bootstrap current session.
- Error/security note: token/session invalid => `401`.

**register**
- Endpoint: `POST /api/v1/auth/register`
- Request chính:
```json
{
  "name": "Duong Ngoc Anh",
  "email": "user@gmail.com",
  "password": "Password123A",
  "countryCode": "VN"
}
```
- Response chính:
```json
{
  "success": true,
  "error": null,
  "statusCode": 201,
  "data": { "requested": true }
}
```
- Success UX implication: chỉ báo “check your email to confirm registration”.
- Error/security note: chưa tạo account ngay; email đã tồn tại vẫn có thể trả domain error phù hợp.

**register/confirm**
- Endpoint: `POST /api/v1/auth/register/confirm`
- Request chính:
```json
{ "token": "raw-registration-token" }
```
- Response chính:
```json
{
  "success": true,
  "error": null,
  "statusCode": 201,
  "data": { "registered": true }
}
```
- Success UX implication: account đã được tạo; FE nên điều hướng sang login.
- Error/security note: token invalid/expired => lỗi domain; confirm không auto login.

**forgot-password**
- Endpoint: `POST /api/v1/auth/forgot-password`
- Request chính:
```json
{ "email": "user@gmail.com" }
```
- Response chính:
```json
{
  "success": true,
  "error": null,
  "statusCode": 201,
  "data": { "requested": true }
}
```
- Success UX implication: luôn show generic “if account exists, email was sent”.
- Error/security note: không lộ account existence.

**reset-password**
- Endpoint: `POST /api/v1/auth/reset-password`
- Request chính:
```json
{
  "token": "raw-reset-token",
  "newPassword": "NewPassword123A",
  "confirmNewPassword": "NewPassword123A"
}
```
- Response chính:
```json
{
  "success": true,
  "error": null,
  "statusCode": 201,
  "data": { "reset": true }
}
```
- Success UX implication: password đổi xong, nên đưa user về login.
- Error/security note:
  - token invalid/expired => `401` với `PASSWORD_RESET_TOKEN_INVALID`
  - password policy: tối thiểu 8 ký tự, có uppercase, lowercase, number
  - reset xong auth state cũ bị invalidate

4. **Admin capabilities cho frontend**

**users**
- List users
  - Endpoint: `GET /api/v1/users`
  - Boundary: admin-only
  - Note: hỗ trợ query/filter/pagination; FE admin list dùng endpoint này.
- User detail
  - Endpoint: `GET /api/v1/users/:id`
  - Boundary: self-or-admin
  - Note: admin xem user khác được; user thường chỉ xem chính mình qua id của họ.
- Create user
  - Endpoint: `POST /api/v1/users`
  - Boundary: admin-only
  - Note: lỗi hữu ích nhất là duplicate email.
- Update user
  - Endpoint: `PATCH /api/v1/users/:id`
  - Boundary: admin-only
  - Note: dùng cho role/isActive/profile fields của user khác.
- Delete user
  - Endpoint: `DELETE /api/v1/users/:id`
  - Boundary: admin-only
  - Note: là soft delete.
- Restore user
  - Endpoint: `PATCH /api/v1/users/:id/restore`
  - Boundary: admin-only
  - Note: restore soft-deleted user.
- Update my profile
  - Endpoint: `PATCH /api/v1/users/me`
  - Boundary: authenticated user
  - Note: self-service profile update.
- Change my password
  - Endpoint: `PATCH /api/v1/users/me/password`
  - Boundary: authenticated user
  - Note: cần current password đúng.

**roles**
- List roles
  - Endpoint: `GET /api/v1/roles`
  - Boundary: admin-only
  - Note: source cho role management UI/select options admin.
- Role detail
  - Endpoint: `GET /api/v1/roles/:id`
  - Boundary: admin-only
  - Note: dùng cho edit/detail role.
- Create role
  - Endpoint: `POST /api/v1/roles`
  - Boundary: admin-only
  - Note: lỗi chính là duplicate name/key semantics.
- Update role
  - Endpoint: `PATCH /api/v1/roles/:id`
  - Boundary: admin-only
  - Note: không assume mọi role đều editable như nhau.
- Delete role
  - Endpoint: `DELETE /api/v1/roles/:id`
  - Boundary: admin-only
  - Note: role đang được dùng có thể trả conflict.
- List role users
  - Endpoint: `GET /api/v1/roles/:id/users`
  - Boundary: admin-only
  - Note: có query behavior theo status/filter.

5. **FE must-not-misunderstand**
- `register` không tạo account ngay.
- `register/confirm` mới tạo account thật.
- `register/confirm` không auto login.
- `forgot-password` không lộ account existence.
- `forgot-password` generic success không có nghĩa email chắc chắn đã được gửi.
- `reset-password` thành công sẽ invalidate auth state cũ.
- `logout` là idempotent.
- `GET /users/:id` không phải admin-only tuyệt đối; self cũng được.
- Health routes là `/api/health/live` và `/api/health/ready`, không versioned.
- Toàn bộ API dùng response envelope; FE không nên parse response như raw DTO trần.
- Password policy cho reset/login-related forms: ít nhất 8 ký tự, có uppercase, lowercase, number.

6. **Short handoff block**
```md
Backend snapshot:
- NestJS admin/auth backend with modules: auth, users, roles, health.
- API uses envelope: `{ success, error, statusCode, data }`.
- Health routes are `/api/health/live` and `/api/health/ready` (not versioned).

Auth model:
- `POST /api/v1/auth/login`: login user.
- `POST /api/v1/auth/refresh`: refresh auth state.
- `POST /api/v1/auth/logout`: idempotent logout.
- `POST /api/v1/auth/logout-all`: logout all sessions.
- `GET /api/v1/auth/me`: fetch current user.
- `POST /api/v1/auth/register`: initiate registration only, returns `{ requested: true }`, no account created yet.
- `POST /api/v1/auth/register/confirm`: confirm token, creates account, returns `{ registered: true }`, no auto login.
- `POST /api/v1/auth/forgot-password`: always generic success `{ requested: true }`.
- `POST /api/v1/auth/reset-password`: resets password, returns `{ reset: true }`, invalidates old auth state.

Admin capabilities:
- Users: list/detail/create/update/delete/restore, plus self profile update and self password change.
- Roles: list/detail/create/update/delete/list-role-users.
- Most users/roles management is admin-only; `GET /users/:id` is self-or-admin.

Boundary notes:
- Public: login, register, register/confirm, forgot-password, reset-password, health.
- Protected: me, logout, logout-all, users/me, users/me/password.
- Admin-only: users management routes, all role routes.
- Self-or-admin: `GET /api/v1/users/:id`.

Security semantics:
- Do not assume register == account created.
- Do not assume confirm registration == logged in.
- Forgot-password does not reveal whether email exists.
- Reset-password success should force FE to treat old session as invalid.
```