1. **Kết luận ngắn**
- Backend snapshot hiện tại có 5 nhóm endpoint chính: `auth`, `users`, `roles`, `galleries`, `health`.
- `galleries` đã hoàn tất round 1 ở backend:
  - admin CRUD
  - soft delete / restore
  - admin list có pagination/filter
  - public list riêng
  - Accept-Language mapping
  - fallback locale hiện tại là `en`
  - public list có cache theo locale và invalidate khi write
- `users`, `roles`, `galleries` admin routes đều là admin-only.
- `GET /api/v1/galleries/public` là public, không cần auth.
- Response API dùng envelope thống nhất: `success`, `data`, `message`, `error`, `statusCode`, `timestamp`, `path`, `requestId`.
- Health routes hiện không versioned: `/api/health/live`, `/api/health/ready`.

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

**galleries endpoints + flow**
- Admin galleries:
  - `GET /api/v1/galleries`
  - `GET /api/v1/galleries/:id`
  - `POST /api/v1/galleries`
  - `PATCH /api/v1/galleries/:id`
  - `DELETE /api/v1/galleries/:id`
  - `PATCH /api/v1/galleries/:id/restore`
- Public galleries:
  - `GET /api/v1/galleries/public`

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
  - `GET /api/v1/galleries/public`
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
  - toàn bộ `galleries` admin routes
- Self-or-admin:
  - `GET /api/v1/users/:id`

**response/error envelope**
- Success:
```json
{
  "success": true,
  "data": {},
  "message": "Request successful",
  "error": null,
  "statusCode": 200,
  "timestamp": "2026-04-08T07:15:00.000Z",
  "path": "/api/v1/example",
  "requestId": "uuid"
}
```
- Error:
```json
{
  "success": false,
  "data": null,
  "message": "Human readable message",
  "error": "DOMAIN_OR_HTTP_ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2026-04-08T07:15:00.000Z",
  "path": "/api/v1/example",
  "requestId": "uuid"
}
```

3. **Auth model cho frontend**

**register**
- `POST /api/v1/auth/register`
- Chỉ initiate registration, chưa tạo account thật.
- Response success:
```json
{ "requested": true }
```

**register/confirm**
- `POST /api/v1/auth/register/confirm`
- Xác nhận token rồi mới tạo account thật.
- Không auto login.
- Response success:
```json
{ "registered": true }
```

**forgot-password**
- `POST /api/v1/auth/forgot-password`
- Luôn generic success, không lộ account existence.
- Response success:
```json
{ "requested": true }
```

**reset-password**
- `POST /api/v1/auth/reset-password`
- Reset thành công thì auth state cũ bị invalidate.
- Response success:
```json
{ "reset": true }
```

**login / refresh / me / logout**
- FE vẫn bám flow auth hiện có trong Postman.
- `logout` là idempotent.
- `me` là endpoint bootstrap session chuẩn.

4. **Galleries contract cho frontend**

**admin galleries list**
- Endpoint: `GET /api/v1/galleries`
- Boundary: admin-only
- Query:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
- Response item:
```json
{
  "id": "gallery-id",
  "name": {
    "en": "Couple",
    "vi": "Cap doi",
    "cn": "情侣"
  },
  "createdBy": {
    "id": "user-admin",
    "name": "Admin User"
  },
  "isActive": true,
  "deletedAt": null,
  "createdAt": "2026-04-08T07:15:00.000Z",
  "updatedAt": "2026-04-08T07:15:00.000Z"
}
```
- Note practical:
  - admin list đã được tối ưu creator lookup ở backend, không còn loop `findById` từng gallery item
  - FE không cần xử lý thêm creator hydrate

**admin gallery detail**
- Endpoint: `GET /api/v1/galleries/:id`
- Boundary: admin-only
- Shape giống item của admin list

**create gallery**
- Endpoint: `POST /api/v1/galleries`
- Boundary: admin-only
- Request body:
```json
{
  "name": {
    "en": "Couple",
    "vi": "Cap doi",
    "cn": "情侣"
  }
}
```
- `createdBy` không gửi từ FE; backend lấy từ current authenticated user.
- Tất cả `en/vi/cn` đều required.
- `createdBy` phải là user active ở backend.

**update gallery**
- Endpoint: `PATCH /api/v1/galleries/:id`
- Boundary: admin-only
- Request body giống create:
```json
{
  "name": {
    "en": "Updated Couple",
    "vi": "Cap doi moi",
    "cn": "新情侣"
  }
}
```

**delete gallery**
- Endpoint: `DELETE /api/v1/galleries/:id`
- Boundary: admin-only
- Business semantics: soft delete
  - `isActive = false`
  - `deletedAt = now`
- Response contract hiện tại:
```json
{
  "message": "Gallery deleted successfully"
}
```

**restore gallery**
- Endpoint: `PATCH /api/v1/galleries/:id/restore`
- Boundary: admin-only
- Restore thành công trả full admin gallery response

**public galleries list**
- Endpoint: `GET /api/v1/galleries/public`
- Boundary: public
- Dùng header `Accept-Language`
- Supported locale:
  - `vi`
  - `en`
  - `cn`
- Mapping practical:
  - `vi`, `vi-VN` -> `vi`
  - `en`, `en-US`, `en-GB` -> `en`
  - `zh`, `zh-CN`, `zh-Hans`, `cn` -> `cn`
- Fallback hiện tại: `en`
- Chỉ trả gallery active
- Public response item:
```json
{
  "id": "gallery-id",
  "name": "Localized gallery name"
}
```
- Không trả:
  - `createdBy`
  - `isActive`
  - `deletedAt`
  - full multilingual object

**public galleries cache behavior**
- Backend hiện đã cache public galleries list theo locale
- Key thực tế theo locale normalized:
  - `galleries:public:list:vi`
  - `galleries:public:list:en`
  - `galleries:public:list:cn`
- Create/update/delete/restore sẽ invalidate toàn bộ public list cache
- Đây là backend concern; FE không cần xử lý cache protocol riêng

5. **Galleries errors hữu ích cho FE**

- `GALLERY_NOT_FOUND`
- `GALLERY_NAME_EN_ALREADY_EXISTS`
- `GALLERY_NAME_VI_ALREADY_EXISTS`
- `GALLERY_NAME_CN_ALREADY_EXISTS`
- `GALLERY_ALREADY_DELETED`
- `GALLERY_NOT_DELETED`

Practical FE handling:
- create/update form nên map 3 lỗi duplicate name theo từng locale field
- delete/restore action nên handle `not found`, `already deleted`, `not deleted` như action-state error bình thường

6. **Frontend planning notes cho FE admin repo**

- Repo admin này nên implement:
  - admin galleries list
  - admin gallery detail
  - create gallery
  - update gallery
  - delete gallery
  - restore gallery
- Chưa implement public galleries UI trong repo này.
- Public galleries hiện dùng cho app/customer-facing context khác; chỉ cần hiểu contract để tránh invent sai API.
- Galleries admin pages/components nên follow pattern đang có hoặc sẽ có của `users` / `roles`:
  - list page có query state `page`, `limit`, `keyword`, `isActive`
  - create/update form dùng multilingual object local cho 3 field `en/vi/cn`
  - detail/edit page đọc full multilingual object, không dùng localized string

7. **FE must-not-misunderstand**

- Không assume `createdBy` là editable field ở gallery form.
- Không assume public galleries response có full object `name`.
- Không assume locale fallback là `vi`; hiện tại là `en`.
- Không assume delete gallery là hard delete.
- Không parse API như raw DTO trần; luôn unwrap envelope trước.
- Không bịa public detail API cho galleries; backend hiện chưa có.
- Không bịa cache contract riêng cho FE; backend tự cache public list.

8. **Short handoff block**
```md
Backend snapshot:
- Modules: auth, users, roles, galleries, health.
- API uses envelope: `{ success, data, message, error, statusCode, timestamp, path, requestId }`.
- Health routes are `/api/health/live` and `/api/health/ready`.

Galleries snapshot:
- Admin routes:
  - `GET /api/v1/galleries`
  - `GET /api/v1/galleries/:id`
  - `POST /api/v1/galleries`
  - `PATCH /api/v1/galleries/:id`
  - `DELETE /api/v1/galleries/:id`
  - `PATCH /api/v1/galleries/:id/restore`
- Public route:
  - `GET /api/v1/galleries/public`
- Admin-only for all admin gallery routes.
- Public list uses `Accept-Language`, supports `vi/en/cn`, fallback `en`.
- Public list response is minimal: `{ id, name }`.
- Admin list/detail returns full multilingual `name` plus `createdBy`, `isActive`, `deletedAt`, `createdAt`, `updatedAt`.
- Delete is soft delete.
- Important gallery errors:
  - `GALLERY_NOT_FOUND`
  - `GALLERY_NAME_EN_ALREADY_EXISTS`
  - `GALLERY_NAME_VI_ALREADY_EXISTS`
  - `GALLERY_NAME_CN_ALREADY_EXISTS`
  - `GALLERY_ALREADY_DELETED`
  - `GALLERY_NOT_DELETED`

FE admin scope:
- Implement admin galleries in this repo.
- Do not implement public galleries UI in this repo.
- Follow users/roles admin CRUD patterns.
```
