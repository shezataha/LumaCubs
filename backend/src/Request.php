<?php
declare(strict_types=1);

namespace LumaCubs;

final class Request
{
    private array $json;
    private array $params;

    public function __construct(array $params = [])
    {
        $this->params = $params;
        $this->json = [];
        $raw = file_get_contents('php://input');
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $this->json = $decoded;
            }
        }
    }

    public function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public function param(string $key, mixed $default = null): mixed
    {
        return $this->params[$key] ?? $default;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        if (array_key_exists($key, $this->json)) {
            return $this->json[$key];
        }
        if (array_key_exists($key, $_POST)) {
            return $_POST[$key];
        }
        return $default;
    }

    public function string(string $key, string $default = ''): string
    {
        $v = $this->input($key, $default);
        return is_string($v) ? trim($v) : trim((string)$v);
    }

    public function int(string $key, int $default = 0): int
    {
        $v = $this->input($key, $default);
        return (int)$v;
    }

    public function bool(string $key, bool $default = false): bool
    {
        $v = $this->input($key, null);
        if ($v === null) {
            return $default;
        }
        return filter_var($v, FILTER_VALIDATE_BOOLEAN);
    }

    public function bearerToken(): ?string
    {
        $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+(\S+)$/i', $hdr, $m)) {
            return $m[1];
        }
        $alt = $this->string('token', '');
        return $alt !== '' ? $alt : null;
    }
}