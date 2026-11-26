# LumaCubs API Reference (Foundation)

Base URL (local example):

`http://127.0.0.1:8081`

All JSON responses include `"ok": true|false`.

Authenticated routes require:

`Authorization: Bearer <token>`

## Health

- `GET /health` — DB ping
- `GET /ping` — alias

## Auth (parents only)

- `POST /auth/register` — `{ email, password, display_name, child_name?, avatar?, age_group_id?, preferred_language? }`
- `POST /auth/login` — `{ email, password }`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot` — `{ email }` (generic response; `dev_token` only when `APP_ENV=local`)
- `POST /auth/reset` — `{ token, password }`

## Children

- `GET /children`
- `POST /children` — `{ display_name, avatar?, age_group_id?, preferred_language?, birth_year? }`
- `PATCH /children/{id}`
- `DELETE /children/{id}` — soft deactivate

## Catalog (public metadata)

- `GET /age-groups`
- `GET /languages`
- `GET /segments?lang=en|ur|ar`
- `GET /segments/{id}/subcategories?lang=...` (alias: categories)
- `GET /segments/{id}/categories?lang=...` — includes illustration/icon URIs, accent, age metadata
- `GET /categories/{id}/topics?lang=...`
- `GET /content?segment_id=&category_id=&age_group_id=&lang=&published=1`

### Segment 01 note
Numbers & Math exposes **16 approved main categories**. Subcategory topic shells stay empty until the approved hierarchy is provided.

## Progress

- `GET /progress?child_id=`
- `POST /progress` — `{ child_id, activity_code, status, content_id?, score?, time_spent_sec?, meta? }`
- `GET /achievements?child_id=&lang=`

## Settings

- `GET|POST|PUT /settings/parent` — body `{ settings: { speech_on, language, accessibility } }`
- `GET|POST|PUT /settings/children/{id}` — same shape

## Legacy API

Root `api.php?action=...` remains available for the current frontend (`ping`, `register`, `login`, `load`, `save`, …).