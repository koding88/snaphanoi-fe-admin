Hãy làm việc như một senior frontend architect / senior product-minded engineer thực dụng.

Ưu tiên practical hơn là pattern đẹp trên giấy.
Không over-engineer.
Phân tích trước, code sau.
Không sửa lan man ngoài scope.
Cái gì dùng chung nhiều chỗ thì gom lại.
Cái gì local 1 chỗ thì giữ local nếu dễ đọc hơn.
Mọi phân tích phải bám sát backend/API thực tế, không áp pattern máy móc.

## Context
Tôi sẽ cung cấp cho bạn:
1. instruction prompt
2. folder structure
3. backend handoff summary / frontend-facing backend brief
4. Postman collection
5. tech stack mong muốn

Tech stack bắt buộc:
- Next.js
- Tailwind CSS
- Zustand
- shadcn/ui
- Font Awesome

Yêu cầu UI:
- responsive cho mobile / tablet / desktop
- polished
- phù hợp business photographer / premium visual service
- mượt, tinh tế, không over-animation

## Cơ chế làm việc bắt buộc
Bạn KHÔNG được tự ý làm toàn bộ project một lượt.

Bạn phải làm theo từng **stage riêng biệt**.
Ở mỗi stage:
- chỉ làm đúng scope của stage đó
- tự code
- tự chạy verify phù hợp
- báo cáo kết quả
- DỪNG LẠI

Không được tự sang stage tiếp theo nếu tôi chưa xác nhận.

## Nguyên tắc bắt buộc
- Không mở scope ngoài stage hiện tại
- Không làm trước các stage sau
- Không “tiện tay” refactor lan man
- Không bịa API trái Postman/backend brief
- Không bỏ qua responsive
- Không làm UI thô sơ
- Không over-engineer architecture khi chưa cần

## Format output bắt buộc sau mỗi stage
1. Kết luận ngắn
2. Những gì đã làm trong stage này
3. File tạo mới
4. File sửa
5. Verify đã chạy
6. Những gì chưa làm vì thuộc stage sau
7. Rủi ro / assumption nhỏ nếu có

## Backend contract notes phải giữ đúng

### Core backend snapshot
- Backend hiện có `auth`, `users`, `roles`, `galleries`, `projects`, `blogs`, `files`, `health`.
- Response envelope chuẩn:
  - `success`
  - `data`
  - `message`
  - `error`
  - `statusCode`
  - `timestamp`
  - `path`
  - `requestId`
- Health routes không versioned:
  - `/api/health/live`
  - `/api/health/ready`

### Auth semantics
- `register` chỉ initiate registration, chưa tạo account usable ngay.
- `register/confirm` mới tạo account thật.
- `register/confirm` không auto login.
- `forgot-password` luôn generic success, không lộ account existence.
- `reset-password` thành công sẽ invalidate auth state cũ.
- `logout` là idempotent.

### Users / roles semantics
- Users admin CRUD và roles admin CRUD bám Postman/backend brief hiện tại.
- `GET /api/v1/users/:id` là self-or-admin, không phải admin-only tuyệt đối.

### Galleries semantics bắt buộc
- Galleries đã có backend round 1 hoàn chỉnh.
- Admin routes:
  - `GET /api/v1/galleries`
  - `GET /api/v1/galleries/:id`
  - `POST /api/v1/galleries`
  - `PATCH /api/v1/galleries/:id`
  - `DELETE /api/v1/galleries/:id`
  - `PATCH /api/v1/galleries/:id/restore`
- Public route:
  - `GET /api/v1/galleries/public`
- Tất cả admin gallery routes là admin-only.
- Public galleries route không cần auth.
- Gallery create/update request body chỉ có multilingual `name`:
```json
{
  "name": {
    "en": "Couple",
    "vi": "Cap doi",
    "cn": "情侣"
  }
}
```
- `createdBy` không do FE gửi; backend lấy từ current authenticated user.
- Admin list query:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
- Admin list/detail response trả:
  - `id`
  - `name: { en, vi, cn }`
  - `createdBy: { id, name }`
  - `isActive`
  - `deletedAt`
  - `createdAt`
  - `updatedAt`
- Delete gallery là soft delete business-wise.
- Restore trả lại full admin gallery response.

### Public galleries semantics bắt buộc
- Public route dùng `Accept-Language`.
- Supported locale:
  - `vi`
  - `en`
  - `cn`
- Mapping practical:
  - `vi`, `vi-VN` -> `vi`
  - `en`, `en-US`, `en-GB` -> `en`
  - `zh`, `zh-CN`, `zh-Hans`, `cn` -> `cn`
- Fallback locale hiện tại là `en`.
- Public response chỉ:
```json
{
  "id": "gallery-id",
  "name": "Localized gallery name"
}
```
- Không assume public response có:
  - `createdBy`
  - `isActive`
  - `deletedAt`
  - full multilingual object
- Backend hiện đã cache public galleries list theo locale; FE không cần custom cache protocol riêng.

### Projects semantics bắt buộc
- Projects đã có cả admin routes và public routes.
- Admin routes:
  - `GET /api/v1/projects`
  - `GET /api/v1/projects/:id`
  - `POST /api/v1/projects`
  - `PATCH /api/v1/projects/:id`
  - `DELETE /api/v1/projects/:id`
  - `PATCH /api/v1/projects/:id/restore`
- Public routes:
  - `GET /api/v1/projects/public?galleryId=...&page=...&limit=...`
  - `GET /api/v1/projects/public/:id`
- Admin list query support:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
  - `isPublished`
- Admin response hiện trả `gallery` object:
```json
{
  "gallery": {
    "id": "gallery-id",
    "name": "Localized gallery name"
  }
}
```
- Không assume admin/project response có `galleryId` ở output.
- Public list item chỉ có:
  - `id`
  - localized `name`
  - `coverImage`
- Public detail có:
  - `id`
  - `gallery { id, name }`
  - localized `name`
  - `coverImage`
  - `content`
  - `createdAt`
  - `updatedAt`
- Public detail không có:
  - `isPublished`
  - `isActive`
  - `deletedAt`
  - `createdBy`

### Blogs semantics bắt buộc
- Blogs đã có cả admin routes và public routes.
- Admin routes:
  - `GET /api/v1/blogs`
  - `GET /api/v1/blogs/:id`
  - `POST /api/v1/blogs`
  - `PATCH /api/v1/blogs/:id`
  - `DELETE /api/v1/blogs/:id`
  - `PATCH /api/v1/blogs/:id/restore`
- Public routes:
  - `GET /api/v1/blogs/public?page=...&limit=...`
  - `GET /api/v1/blogs/public/:id`
- Blogs là single-language:
  - `name` là `string`
  - `content` là whole JSON document
  - không multilingual `name`
  - không multilingual `content`
  - không có `language` field
- Admin list query support:
  - `page`
  - `limit`
  - `keyword`
  - `isActive`
  - `isPublished`
  - `isPinned`
- Admin response trả full:
  - `id`
  - `name`
  - `coverImage`
  - `content`
  - `isPinned`
  - `isPublished`
  - `isActive`
  - `deletedAt`
  - `createdBy`
  - `createdAt`
  - `updatedAt`
- Public list item chỉ có:
  - `id`
  - `name`
  - `coverImage`
- Public detail có:
  - `id`
  - `name`
  - `coverImage`
  - `content`
  - `createdAt`
  - `updatedAt`
- Public blogs response không có:
  - `isPinned`
  - `isPublished`
  - `isActive`
  - `deletedAt`
  - `createdBy`
- Public list runtime sort:
  - `isPinned desc`
  - `createdAt desc`

### Files upload-token semantics (liên quan projects + blogs)
- Endpoint `POST /api/v1/files/request-upload` là public.
- FE phải request upload token trước khi gửi:
  - `coverImageUploadToken` cho project cover
  - `uploadToken` cho image item trong `projects.content.blocks[].mediaLayout.data.items[]`
  - `coverImageUploadToken` cho blog cover
  - `uploadToken` cho image item trong `blogs.content.blocks[].mediaLayout.data.items[]`
- Không dùng base64 payload cho projects/blogs content image flow.

### Galleries errors hữu ích cho FE
- `GALLERY_NOT_FOUND`
- `GALLERY_NAME_EN_ALREADY_EXISTS`
- `GALLERY_NAME_VI_ALREADY_EXISTS`
- `GALLERY_NAME_CN_ALREADY_EXISTS`
- `GALLERY_ALREADY_DELETED`
- `GALLERY_NOT_DELETED`

### Projects errors hữu ích cho FE
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

### Blogs errors hữu ích cho FE
- `BLOG_NOT_FOUND`
- `BLOG_ALREADY_DELETED`
- `BLOG_NOT_DELETED`
- `INVALID_BLOG_NAME`
- `INVALID_BLOG_CONTENT`
- `BLOG_COVER_IMAGE_NOT_FOUND`
- `INVALID_FILE_UPLOAD_TOKEN`
- `INVALID_FILE_UPLOAD_STATE`

## Stage list tổng thể

### Stage 0 — Planning only
Chỉ làm:
- đọc toàn bộ input
- chốt route map
- page map
- auth model FE
- API integration model
- state model
- component/layout strategy
- implementation order

Không code.

### Stage 1 — Foundation/setup
Chỉ làm:
- tạo Next.js app structure
- setup Tailwind
- setup shadcn/ui
- setup Zustand
- setup Font Awesome
- setup base design tokens / theme direction
- setup app shell cơ bản
- setup API client foundation
- setup env pattern
- setup responsive base layout
- setup minimal utility structure

Chưa làm auth pages thật.
Chưa làm admin CRUD.

### Stage 2 — Auth flows
Chỉ làm:
- login
- register
- register confirm
- forgot password
- reset password
- bootstrap auth/me
- route guard cơ bản
- auth UX states

Chưa làm admin shell phức tạp.
Chưa làm users/roles/galleries CRUD.

### Stage 3 — Admin shell
Chỉ làm:
- protected admin layout
- sidebar/topbar
- dashboard placeholder practical
- common loading/empty/error states
- navigation structure

Chưa làm users/roles/galleries CRUD hoàn chỉnh.

### Stage 4 — Users management
Chỉ làm:
- users list
- user detail
- create user
- update user
- delete user
- restore user
- update my profile
- change my password

### Stage 5 — Roles management
Chỉ làm:
- roles list
- role detail
- create role
- update role
- delete role
- list role users

### Stage 6 — Galleries management
Chỉ làm:
- admin galleries list
- gallery detail
- create gallery
- update gallery
- delete gallery
- restore gallery
- multilingual form UX cho `en/vi/cn`
- list filter với `page`, `limit`, `keyword`, `isActive`
- conflict/error handling cho 3 field locale name

Không làm public galleries UI ở repo này.

### Stage 7 — Projects management
Chỉ làm:
- admin projects list
- project detail
- create project
- update project
- delete project
- restore project
- query/filter với `page`, `limit`, `keyword`, `isActive`, `isPublished`
- map đúng response `gallery { id, name }`
- flow upload token cover/content theo backend contract

Không làm public projects UI trong repo admin này nếu chưa có yêu cầu riêng.

### Stage 8 — Blogs management
Chỉ làm:
- admin blogs list
- blog detail
- create blog
- update blog
- delete blog
- restore blog
- query/filter với `page`, `limit`, `keyword`, `isActive`, `isPublished`, `isPinned`
- map đúng single-language `name`
- flow upload token cover/content theo backend contract của blogs

Không làm public blogs UI trong repo admin này nếu chưa có yêu cầu riêng.

### Stage 9 — Polish
Chỉ làm:
- responsive refinement
- animation/motion polish
- UI polish
- consistency cleanup
- final UX refinement

## Cách làm ở stage hiện tại
Tôi sẽ nói rõ stage nào cần làm.
Bạn chỉ được làm stage đó.

Nếu stage là Stage 0:
- chỉ planning
- không code

Nếu stage là Stage 1 trở đi:
- chỉ implement đúng stage đó
- tự verify
- dừng lại sau khi xong

## Skill
Nếu skill `frontend-design` có sẵn và khả dụng, hãy dùng nó để hỗ trợ định hướng UI/UX và polish giao diện.
Nếu không khả dụng thì tiếp tục best effort bình thường.

## Quality bar
- Practical
- Dễ review
- Dễ commit từng chặng
- Đúng backend
- Đẹp, polished, responsive
- Không cần tôi giải thích lại từ đầu

## Scope guard cực kỳ quan trọng
- Implement admin galleries trong repo admin này khi tới đúng stage.
- Implement admin blogs trong repo admin này khi tới đúng stage.
- Không implement public galleries UI trong repo admin này nếu tôi chưa yêu cầu riêng.
- Không implement public blogs UI trong repo admin này nếu tôi chưa yêu cầu riêng.
- Không bịa route/API ngoài backend brief và Postman hiện tại.
- Không invent public gallery detail API.
- Không assume locale fallback là `vi`; current fallback là `en`.
