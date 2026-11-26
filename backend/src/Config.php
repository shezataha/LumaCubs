<?php
declare(strict_types=1);

namespace LumaCubs;

final class Config
{
    private static ?array $env = null;

    public static function load(string $rootDir): void
    {
        if (self::$env !== null) {
            return;
        }
        self::$env = [];
        $path = $rootDir . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($path)) {
            return;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            $pos = strpos($line, '=');
            if ($pos === false) {
                continue;
            }
            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));
            self::$env[$key] = $val;
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, $_ENV)) {
            return (string)$_ENV[$key];
        }
        if (self::$env !== null && array_key_exists($key, self::$env)) {
            return self::$env[$key];
        }
        $v = getenv($key);
        if ($v !== false) {
            return (string)$v;
        }
        return $default;
    }

    public static function require(string $key): string
    {
        $v = self::get($key);
        if ($v === null || $v === '') {
            Response::error('config_missing', 500, ['key' => $key]);
        }
        return $v;
    }

    /** @return list<string> */
    public static function corsOrigins(): array
    {
        $raw = self::get('CORS_ORIGINS', 'http://127.0.0.1:8080,http://localhost:8080');
        $parts = array_map('trim', explode(',', (string)$raw));
        return array_values(array_filter($parts, static fn($o) => $o !== ''));
    }

    public static function sessionTtl(): int
    {
        return max(3600, (int)self::get('SESSION_TTL', '2592000'));
    }
}