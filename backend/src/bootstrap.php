<?php
declare(strict_types=1);

namespace LumaCubs;

spl_autoload_register(static function (string $class): void {
    $prefix = 'LumaCubs\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $path = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $relative) . '.php';
    if (is_file($path)) {
        require_once $path;
    }
});

Config::load(dirname(__DIR__));