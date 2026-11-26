<?php
declare(strict_types=1);

namespace LumaCubs;

final class Response
{
    public static function applyCors(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = Config::corsOrigins();
        if ($origin !== '' && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        } elseif (Config::get('APP_ENV', 'local') === 'local' && $origin === '') {
            // Same-origin / curl local tooling
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Child-Id');
    }

    public static function json(array $data, int $code = 200): never
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function ok(array $data = [], int $code = 200): never
    {
        self::json(array_merge(['ok' => true], $data), $code);
    }

    public static function error(string $error, int $code = 400, array $extra = []): never
    {
        self::json(array_merge(['ok' => false, 'error' => $error], $extra), $code);
    }
}