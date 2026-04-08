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
- Backend hiện có `auth`, `users`, `roles`, `galleries`, `health`.
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

### Galleries errors hữu ích cho FE
- `GALLERY_NOT_FOUND`
- `GALLERY_NAME_EN_ALREADY_EXISTS`
- `GALLERY_NAME_VI_ALREADY_EXISTS`
- `GALLERY_NAME_CN_ALREADY_EXISTS`
- `GALLERY_ALREADY_DELETED`
- `GALLERY_NOT_DELETED`

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

### Stage 7 — Polish
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
- Không implement public galleries UI trong repo admin này nếu tôi chưa yêu cầu riêng.
- Không bịa route/API ngoài backend brief và Postman hiện tại.
- Không invent public gallery detail API.
- Không assume locale fallback là `vi`; current fallback là `en`.
