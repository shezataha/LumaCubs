# LumaCubs Backend Development Notes

## Layout

```
backend/
  public/index.php     # front controller
  config/env.example
  src/                 # PHP classes (PSR-4-like LumaCubs\)
  sql/001_foundation.sql
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
- Home loads `/segments` into **Learning paths** (fallback list if API offline).
- Segment hub maps known codes to existing activities; empty paths show “Coming soon”.
- Auth prefers foundation parent login/register when `/health` is up; legacy `api.php` remains fallback.
- Activity opens can POST `/progress` when a parent session + child exist.

## Testing checklist

- [ ] `/health` returns ok
- [ ] Register parent → token issued
- [ ] Create multiple children under one parent
- [ ] Unauthorized child access returns 401/404
- [ ] `/segments` returns 13 items in en/ur/ar
- [ ] Progress upsert + list for owned child
- [ ] Legacy `api.php?action=ping` still works
- [ ] Frontend home shows 13 learning path cards
- [ ] Segment hub opens mapped activities