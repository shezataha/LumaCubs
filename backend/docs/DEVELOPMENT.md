# LumaCubs Backend Development Notes

## Layout

```
backend/
  public/index.php     # front controller
  config/env.example
  src/                 # PHP classes (PSR-4-like LumaCubs\)
  sql/001_foundation.sql … 005_age_based_learning.sql
  docs/
```

## Conventions

- Controllers are static handlers receiving `Request`.
- Use prepared statements only.
- Return consistent `{ ok, ... }` JSON via `Response`.
- Validate/sanitize all inputs at the controller boundary.
- Do not put learning activity payloads in UI components; store metadata in catalog tables.

## Adding a subcategory later

1. Insert into `subcategories` + `subcategory_translations`.
2. Optionally add `topics` / `content_items` with translations and `content_age_map`.
3. Publish with `content_items.is_published = 1`.
4. Frontend fetches `/segments` and `/content` — no hardcoded catalogs.

## Migrating legacy users (future)

`parents.legacy_user_id` is reserved to map old `users.id` rows. A migration script can create a parent + default child and copy sticker JSON into progress/rewards later.

## Frontend integration (current)

- `config.js` sets `foundationApi` (default `http://127.0.0.1:8081`).
- Home loads `/segments` into **Learning paths** (fallback list if API offline). Guest/legacy keep this full catalog.
- Platform login → **child picker** → **age dashboard** (`/dashboard/child`) with recommended + explore lanes.
- Segment/category fetches may pass `age_group_id` when a child profile is active.
- Auth prefers foundation parent login/register when `/health` is up; legacy `api.php` remains fallback.
- Activity opens can POST `/progress` when a parent session + child exist.

## Age personalization (foundation A+B)

- Apply `sql/005_age_based_learning.sql` (DOB, age maps, learning controls, attempts/mastery stubs).
- `AgeService` derives age years + age group (1–4) from DOB; optional `learning_level_override`.
- Seed maps are **draft / reviewable**, not final curriculum.

## Testing checklist

- [x] `/health` returns ok
- [x] Register parent → token issued
- [x] Create child with DOB → auto age group
- [x] `/dashboard/child` returns recommended + explore
- [x] `/segments?age_group_id=` filters placements
- [ ] Unauthorized child access returns 401/404
- [x] `/segments` returns 13 items in en/ur/ar
- [ ] Progress upsert + list for owned child
- [ ] Legacy `api.php?action=ping` still works
- [ ] Frontend home shows 13 learning path cards
- [ ] Segment hub opens mapped activities
- [ ] Login opens child picker then age dashboard
