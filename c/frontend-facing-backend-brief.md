1. **Kết luận ngắn**
- Backend snapshot hiện tại có 8 nhóm endpoint chính: `auth`, `users`, `roles`, `galleries`, `projects`, `blogs`, `files`, `health`.
- `galleries` đã hoàn tất round 1 ở backend:
  - admin CRUD
  - soft delete / restore
  - admin list có pagination/filter
  - public list riêng
  - Accept-Language mapping
  - fallback locale hiện tại là `en`
  - public list có cache theo locale và invalidate khi write
- `users`, `roles`, `galleries`, `projects`, `blogs` admin routes đều là admin-only.
- `GET /api/v1/galleries/public` là public, không cần auth.
- `GET /api/v1/projects/public` và `GET /api/v1/projects/public/:id` là public.
- `POST /api/v1/files/request-upload` là public.
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

**projects endpoints + flow**
- Admin projects:
  - `GET /api/v1/projects`
  - `GET /api/v1/projects/:id`
  - `POST /api/v1/projects`
  - `PATCH /api/v1/projects/:id`
  - `DELETE /api/v1/projects/:id`
  - `PATCH /api/v1/projects/:id/restore`
- Public projects:
  - `GET /api/v1/projects/public`
  - `GET /api/v1/projects/public/:id`

**blogs endpoints + flow**
- Admin blogs:
  - `GET /api/v1/blogs`
  - `GET /api/v1/blogs/:id`
  - `POST /api/v1/blogs`
  - `PATCH /api/v1/blogs/:id`
  - `DELETE /api/v1/blogs/:id`
  - `PATCH /api/v1/blogs/:id/restore`
- Public blogs:
  - `GET /api/v1/blogs/public`
  - `GET /api/v1/blogs/public/:id`

**files endpoints + flow**
- Public files:
  - `POST /api/v1/files/request-upload`

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
  - `GET /api/v1/projects/public`
  - `GET /api/v1/projects/public/:id`
  - `GET /api/v1/blogs/public`
  - `GET /api/v1/blogs/public/:id`
  - `POST /api/v1/files/request-upload`
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
  - toàn bộ `projects` admin routes
  - toàn bộ `blogs` admin routes
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
- Cache key hiện dùng generation strategy (cùng style với projects public cache), không nên FE phụ thuộc vào key cụ thể.
- Create/update/delete/restore sẽ bump generation để invalid tất cả variant list cache liên quan.
- Đây là backend concern; FE không cần xử lý cache protocol riêng

5. **Projects contract cho frontend**

**admin projects list**
- Endpoint: `GET /api/v1/projects`
- Boundary: admin-only
- Query:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
  - `isPublished`
- Response item (practical):
```json
{
  "id": "project-id",
  "gallery": {
    "id": "gallery-id",
    "name": "Localized gallery name"
  },
  "name": {
    "en": "Spring Romance",
    "vi": "Tinh yeu mua xuan",
    "cn": "春日恋曲"
  },
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  },
  "isPublished": true,
  "isActive": true,
  "deletedAt": null,
  "createdBy": {
    "id": "user-admin",
    "name": "Admin User"
  },
  "createdAt": "2026-04-09T09:10:00.000Z",
  "updatedAt": "2026-04-09T09:10:00.000Z"
}
```
- FE note:
  - response không có `galleryId` trần; dùng `gallery.id`.
  - list thường không có `content` field.

**admin project detail**
- Endpoint: `GET /api/v1/projects/:id`
- Boundary: admin-only
- Shape giống admin list item nhưng có `content` đầy đủ.

**create project**
- Endpoint: `POST /api/v1/projects`
- Body:
```json
{
  "galleryId": "gallery-id",
  "name": { "en": "...", "vi": "...", "cn": "..." },
  "coverImageUploadToken": "token",
  "content": { "time": 1, "version": "2.x", "blocks": [] },
  "isPublished": true
}
```

**update project**
- Endpoint: `PATCH /api/v1/projects/:id`
- Optional fields:
  - `galleryId`
  - `name`
  - `coverImageUploadToken`
  - `content`
  - `isPublished`
- Có support đổi gallery nếu gallery mới active/hợp lệ.

**delete/restore project**
- `DELETE /api/v1/projects/:id` -> soft delete, response `{ "message": "Project deleted successfully" }`
- `PATCH /api/v1/projects/:id/restore` -> trả full admin project response

**public projects list by gallery**
- Endpoint: `GET /api/v1/projects/public`
- Query:
  - `galleryId` (required)
  - `page`
  - `limit`
- Response item:
```json
{
  "id": "project-id",
  "name": "Localized project name",
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  }
}
```

**public project detail**
- Endpoint: `GET /api/v1/projects/public/:id`
- Response:
```json
{
  "id": "project-id",
  "gallery": { "id": "gallery-id", "name": "Localized gallery name" },
  "name": "Localized project name",
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  },
  "content": { "time": 1, "version": "2.x", "blocks": [] },
  "createdAt": "2026-04-09T09:10:00.000Z",
  "updatedAt": "2026-04-09T09:10:00.000Z"
}
```

**projects errors hữu ích cho FE**
- `PROJECT_NOT_FOUND`
- `INVALID_PROJECT_GALLERY`
- `PROJECT_NAME_EN_ALREADY_EXISTS`
- `PROJECT_NAME_VI_ALREADY_EXISTS`
- `PROJECT_NAME_CN_ALREADY_EXISTS`
- `PROJECT_ALREADY_DELETED`
- `PROJECT_NOT_DELETED`
- `INVALID_PROJECT_CONTENT`
- `PROJECT_COVER_IMAGE_NOT_FOUND`
- `INVALID_FILE_UPLOAD_TOKEN`
- `INVALID_FILE_UPLOAD_STATE`

6. **Blogs contract cho frontend**

**blogs shape tổng quát**
- `blogs` là single-language.
- `name` là `string`, không multilingual.
- `content` là whole JSON document.
- Không có `language` field.
- `coverImage` và `createdBy` expand theo cùng style của `projects`.

**admin blogs list**
- Endpoint: `GET /api/v1/blogs`
- Boundary: admin-only
- Query:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
  - `isPublished`
  - `isPinned`
- Response item:
```json
{
  "id": "blog-id",
  "name": "Spring Story",
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  },
  "isPinned": true,
  "isPublished": true,
  "isActive": true,
  "deletedAt": null,
  "createdBy": {
    "id": "user-admin",
    "name": "Admin User"
  },
  "createdAt": "2026-04-10T02:10:00.000Z",
  "updatedAt": "2026-04-10T02:10:00.000Z"
}
```
- Admin detail `GET /api/v1/blogs/:id` cùng shape nhưng có `content` đầy đủ.

**create/update blog**
- `POST /api/v1/blogs`
- `PATCH /api/v1/blogs/:id`
- Body practical:
```json
{
  "name": "Spring Story",
  "coverImageUploadToken": "token",
  "content": { "time": 1, "version": "2.x", "blocks": [] },
  "isPinned": true,
  "isPublished": true
}
```
- Update là partial update cho các field trên.

**public blogs list/detail**
- `GET /api/v1/blogs/public`
- `GET /api/v1/blogs/public/:id`
- Public list có pagination: `page`, `limit`.
- Backend sort runtime: 
  1. `isPinned desc`
  2. `createdAt desc`
- Public list item:
```json
{
  "id": "blog-id",
  "name": "Spring Story",
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  }
}
```
- Public detail:
```json
{
  "id": "blog-id",
  "name": "Spring Story",
  "coverImage": {
    "id": "file-id",
    "url": "https://...",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "originalName": "cover.jpg"
  },
  "content": { "time": 1, "version": "2.x", "blocks": [] },
  "createdAt": "2026-04-10T02:10:00.000Z",
  "updatedAt": "2026-04-10T02:10:00.000Z"
}
```
- Public blogs không trả:
  - `isPinned`
  - `isPublished`
  - `isActive`
  - `deletedAt`
  - `createdBy`

**blogs content/upload semantics**
- Cover upload dùng `POST /api/v1/files/request-upload` như projects.
- `content` là whole JSON document, không base64.
- Với `mediaLayout.data.items[]`:
  - image mới dùng `uploadToken`
  - image cũ dùng `{ fileId, url }`
  - youtube item giữ `url`
- FE không được assume generic image block ngoài semantics hiện backend đang support.

**blogs errors hữu ích cho FE**
- `BLOG_NOT_FOUND`
- `BLOG_ALREADY_DELETED`
- `BLOG_NOT_DELETED`
- `INVALID_BLOG_NAME`
- `INVALID_BLOG_CONTENT`
- `BLOG_COVER_IMAGE_NOT_FOUND`
- `INVALID_FILE_UPLOAD_TOKEN`
- `INVALID_FILE_UPLOAD_STATE`

7. **Files request-upload contract (phục vụ create/update projects + blogs)**
- Endpoint: `POST /api/v1/files/request-upload` (public).
- FE upload flow cho cover/content image của `projects` và `blogs` cần gọi endpoint này để nhận upload token trước khi gửi create/update payload.
- Relevant purposes hiện tại gồm:
  - `project-cover`
  - `project-content`
  - `blog-cover`
  - `blog-content`

8. **Galleries errors hữu ích cho FE**

- `GALLERY_NOT_FOUND`
- `GALLERY_NAME_EN_ALREADY_EXISTS`
- `GALLERY_NAME_VI_ALREADY_EXISTS`
- `GALLERY_NAME_CN_ALREADY_EXISTS`
- `GALLERY_ALREADY_DELETED`
- `GALLERY_NOT_DELETED`

Practical FE handling:
- create/update form nên map 3 lỗi duplicate name theo từng locale field
- delete/restore action nên handle `not found`, `already deleted`, `not deleted` như action-state error bình thường

9. **Frontend planning notes cho FE admin repo**

- Repo admin này nên implement:
  - admin galleries list
  - admin gallery detail
  - create gallery
  - update gallery
  - delete gallery
  - restore gallery
  - admin projects list/detail/create/update/delete/restore
  - admin blogs list/detail/create/update/delete/restore
- Chưa implement public galleries UI trong repo này.
- Chưa implement public blogs UI trong repo admin này nếu chưa có yêu cầu riêng.
- Public galleries hiện dùng cho app/customer-facing context khác; chỉ cần hiểu contract để tránh invent sai API.
- Galleries admin pages/components nên follow pattern đang có hoặc sẽ có của `users` / `roles`:
  - list page có query state `page`, `limit`, `keyword`, `isActive`
  - create/update form dùng multilingual object local cho 3 field `en/vi/cn`
  - detail/edit page đọc full multilingual object, không dùng localized string

10. **FE must-not-misunderstand**

- Không assume `createdBy` là editable field ở gallery form.
- Không assume public galleries response có full object `name`.
- Không assume locale fallback là `vi`; hiện tại là `en`.
- Không assume delete gallery là hard delete.
- Không parse API như raw DTO trần; luôn unwrap envelope trước.
- Không bịa public detail API cho galleries; backend hiện chưa có.
- Không bịa cache contract riêng cho FE; backend tự cache public list.
- Không assume project admin response có `galleryId`; dùng `gallery.id`.
- Không assume project public list có `gallery`; list chỉ có `id`, localized `name`, `coverImage`.
- Không assume blogs có multilingual `name` hoặc `language` field.
- Không gửi base64 image payload cho blog content; backend đang dùng upload-token flow.

11. **Short handoff block**
```md
Backend snapshot:
- Modules: auth, users, roles, galleries, projects, blogs, files, health.
- API uses envelope: `{ success, data, message, error, statusCode, timestamp, path, requestId }`.
- Health routes are `/api/health/live` and `/api/health/ready`.

Galleries + Projects snapshot:
- Admin routes:
  - `GET /api/v1/galleries`
  - `GET /api/v1/galleries/:id`
  - `POST /api/v1/galleries`
  - `PATCH /api/v1/galleries/:id`
  - `DELETE /api/v1/galleries/:id`
  - `PATCH /api/v1/galleries/:id/restore`
  - `GET /api/v1/projects`
  - `GET /api/v1/projects/:id`
  - `POST /api/v1/projects`
  - `PATCH /api/v1/projects/:id`
  - `DELETE /api/v1/projects/:id`
  - `PATCH /api/v1/projects/:id/restore`
- Public route:
  - `GET /api/v1/galleries/public`
  - `GET /api/v1/projects/public`
  - `GET /api/v1/projects/public/:id`
  - `GET /api/v1/blogs/public`
  - `GET /api/v1/blogs/public/:id`
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
- Implement admin projects/blogs in this repo when tới đúng stage.
- Do not implement public galleries UI in this repo.
- Do not implement public blogs UI in this repo unless explicitly requested.
- Follow users/roles admin CRUD patterns.
```
