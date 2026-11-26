# LumaCubs Backend Setup

## Prerequisites

- PHP 8.1+ with PDO MySQL
- MariaDB/MySQL
- Existing DB from root `setup.sql` (or create it first)

## 1. Configure environment

```bash
cp backend/config/env.example backend/.env
```

Edit `backend/.env` with your DB credentials and CORS origins.

## 2. Apply foundation schema

```bash
mysql -u root -p < backend/sql/001_foundation.sql
mysql -u root -p < backend/sql/002_segment_subcategories.sql
mysql -u root -p < backend/sql/003_numbers_math_categories.sql
php assets/segments/numbers-math/generate-assets.php
```

Windows (example):

```powershell
C:\mariadb\bin\mysql.exe -u root < "backend\sql\001_foundation.sql"
C:\mariadb\bin\mysql.exe -u root < "backend\sql\002_segment_subcategories.sql"
# Prefer applying media columns first if ALTER IF NOT EXISTS is unsupported, then 003 inserts
C:\mariadb\bin\mysql.exe -u root < "backend\sql\003_numbers_math_categories.sql"
php assets/segments/numbers-math/generate-assets.php
```

This creates new tables and seeds age groups, languages, the 13 learning segments, placeholder subcategories for other segments, and **Segment 01’s 16 approved Numbers & Math categories** with media URIs (EN/UR/AR). Legacy tables are preserved.

## 3. Run the API locally

From the repo root:

```powershell
php -S 127.0.0.1:8081 -t backend/public
```

Smoke check:

```powershell
curl http://127.0.0.1:8081/health
curl http://127.0.0.1:8081/segments?lang=en
```

## 4. Keep the existing frontend

The current game still uses root `api.php` on port 8080. That path is unchanged.

```powershell
php -S 127.0.0.1:8080 -t .
```

## 5. Production (not deployed yet)

- Host `backend/public` on a PHP server with HTTPS.
- Restrict CORS to `https://shezataha.github.io`.
- Set `APP_ENV=production`.
- Never commit `.env`.
- Wire frontend API base URL later (out of scope for foundation).