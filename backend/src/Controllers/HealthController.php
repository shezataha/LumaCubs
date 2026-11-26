<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Db;
use LumaCubs\Request;
use LumaCubs\Response;

final class HealthController
{
    public static function ping(Request $req): void
    {
        Db::pdo()->query('SELECT 1');
        Response::ok([
            'service' => 'lumacubs-api',
            'version' => '1.0.0-foundation',
        ]);
    }
}