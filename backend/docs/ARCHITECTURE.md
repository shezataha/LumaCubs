# LumaCubs Backend Architecture

## Goals

Provide a secure, expandable backend for an early-learning platform (ages 2–8) while preserving the existing vanilla JS frontend and legacy MariaDB API.

## Technology choices

| Layer | Choice | Why |
|-------|--------|-----|
| Language | PHP 8+ | Already used (`api.php`) |
| Database | MariaDB/MySQL | Already used (`setup.sql`) |
| Auth | Parent bearer sessions | Parent-controlled; works across GitHub Pages → API host |
| Frontend host | GitHub Pages | Existing deployment |
| Backend host | Separate PHP host | Pages cannot run PHP |

## High-level diagram

```
GitHub Pages (static UI)
        |
        | HTTPS JSON + Bearer token
        v
backend/public/index.php  --->  MariaDB (alphabet_game)
        |
        +-- parents / children / sessions
        +-- learning catalog (segments → content)
        +-- progress / achievements / settings

Legacy api.php remains for current guest/player flows.
```

## Domain model

- **Parent** authenticates; never a child account.
- **Child** profiles belong to a parent (1–N).
- **Age groups**: Little Explorers, Curious Learners, Smart Learners, Young Achievers.
- **Languages**: English, Urdu, Arabic (translations tables).
- **Learning segments**: 13 master categories (seeded). Subcategories/topics/content are metadata shells for later fills.
- **Progress** is per child + activity code (with optional content_id).
- **Settings** are parent-controlled JSON documents (speech, language, accessibility).

## Security posture

- No public child registration.
- Passwords hashed with `password_hash`.
- Session tokens stored hashed (`sha256`).
- CORS allow-list via `CORS_ORIGINS`.
- Secrets in `backend/.env` (not committed).
- Password reset does not reveal whether an email exists.
- Child/progress/settings routes require parent ownership checks.
- Catalog endpoints are public metadata only (no PII).

## Compatibility

- Existing tables (`users`, `user_progress`, …) are untouched.
- Root `api.php` continues to serve the current app.
- New API lives under `backend/public` and can be hosted separately for production.

## Deployment notes

1. Keep frontend on GitHub Pages.
2. Deploy `backend/` to a PHP + MariaDB host.
3. Point the frontend API base URL at that host when wiring the UI (future change).
4. Do not deploy without explicit approval.