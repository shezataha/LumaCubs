<?php
declare(strict_types=1);

namespace LumaCubs\Auth;

use LumaCubs\Db;
use LumaCubs\Response;
use PDO;

final class SessionService
{
    public static function create(int $parentId): array
    {
        $token = bin2hex(random_bytes(32));
        $hash = hash('sha256', $token);
        $ttl = \LumaCubs\Config::sessionTtl();
        $expires = date('Y-m-d H:i:s', time() + $ttl);
        $pdo = Db::pdo();
        $pdo->prepare(
            'INSERT INTO parent_sessions (parent_id, token_hash, expires_at) VALUES (?, ?, ?)'
        )->execute([$parentId, $hash, $expires]);
        return ['token' => $token, 'expires_at' => $expires];
    }

    public static function destroy(?string $token): void
    {
        if ($token === null || $token === '') {
            return;
        }
        $hash = hash('sha256', $token);
        Db::pdo()->prepare('DELETE FROM parent_sessions WHERE token_hash = ?')->execute([$hash]);
    }

    /** @return array{id:int,email:string,display_name:string}|null */
    public static function parentFromToken(?string $token): ?array
    {
        if ($token === null || $token === '') {
            return null;
        }
        $hash = hash('sha256', $token);
        $stmt = Db::pdo()->prepare(
            'SELECT p.id, p.email, p.display_name
             FROM parent_sessions s
             INNER JOIN parents p ON p.id = s.parent_id
             WHERE s.token_hash = ? AND s.expires_at > NOW()'
        );
        $stmt->execute([$hash]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public static function requireParent(?string $token): array
    {
        $parent = self::parentFromToken($token);
        if (!$parent) {
            Response::error('unauthorized', 401);
        }
        return $parent;
    }
}