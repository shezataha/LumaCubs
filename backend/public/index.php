<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/src/bootstrap.php';

use LumaCubs\Response;
use LumaCubs\Router;

Response::applyCors();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();
require dirname(__DIR__) . '/src/routes.php';

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = is_string($uri) ? $uri : '/';

// Support both /api/... (when proxied) and direct /...
if (str_starts_with($uri, '/api')) {
    $uri = substr($uri, 4) ?: '/';
}

// When PHP built-in server uses -t backend/public with router script,
// strip folder prefixes if present.
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
if ($scriptName && str_ends_with($scriptName, '/index.php')) {
    $base = substr($scriptName, 0, -strlen('/index.php'));
    if ($base !== '' && str_starts_with($uri, $base)) {
        $uri = substr($uri, strlen($base)) ?: '/';
    }
}

$uri = '/' . trim($uri, '/');
if ($uri !== '/') {
    // keep leading slash, drop trailing
    $uri = rtrim($uri, '/') ?: '/';
}

$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $uri);