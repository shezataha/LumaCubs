# LumaCubs Backend Foundation

PHP + MariaDB API that supports parent accounts, child profiles, learning catalog metadata, progress, and settings.

- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- API: [docs/API.md](docs/API.md)
- Setup: [docs/SETUP.md](docs/SETUP.md)
- Development: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

Quick start:

```powershell
cp config/env.example .env
# edit .env
mysql -u root < sql/001_foundation.sql
php -S 127.0.0.1:8081 -t public
```