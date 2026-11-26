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

- `POST /auth/register` — `{ email, password, display_name, child_name?, avatar?, age_group_id?, preferred_language?, date_of_birth? }`
- `POST /auth/login` — `{ email, password }`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot` — `{ email }` (generic response; `dev_token` only when `APP_ENV=local`)
- `POST /auth/reset` — `{ token, password }`

## Children

- `GET /children` — each child includes `date_of_birth`, `age_years`, `resolved_age_group_id`, age group labels
- `POST /children` — `{ display_name, avatar?, preferred_language?, date_of_birth?, age_group_id?, birth_year? }`
  - When `date_of_birth` (`YYYY-MM-DD`) is set, `age_group_id` is derived automatically
- `PATCH /children/{id}` — may update `date_of_birth`, `learning_level_override` (−1|0|1), name, avatar, language
- `POST /children/{id}/select` — confirm active child (re-syncs age group from DOB)
- `POST /children/select` — body `{ child_id }` (same as above)
- `DELETE /children/{id}` — soft deactivate

## Age dashboard

- `GET /dashboard/child?child_id=&lang=` — age-ready recommended/explore segments + math categories, progress summary, controls
- `GET /dashboard/parent` — parent overview of children + progress counts

Draft placements live in `segment_age_map` / `category_age_map` (SQL `005_age_based_learning.sql`). Curriculum is tunable; do not treat seed maps as final approved content.

## Catalog (public metadata)

- `GET /age-groups`
- `GET /languages`
- `GET /segments?lang=en|ur|ar`
  - Optional: `age_group_id`, `placement=recommended|explore` — filters via `segment_age_map` (hides `hidden` by default)
- `GET /segments/{id}/subcategories?lang=...` (alias: categories)
  - Optional: `age_group_id`, `placement=` — filters via `category_age_map`
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