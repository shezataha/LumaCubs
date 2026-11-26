<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Auth\SessionService;
use LumaCubs\Db;
use LumaCubs\Request;
use LumaCubs\Response;
use PDO;

final class AuthController
{
    public static function register(Request $req): void
    {
        $email = strtolower($req->string('email'));
        $password = (string)$req->input('password', '');
        $name = $req->string('display_name');
        if ($name === '') {
            $name = $req->string('name');
        }

        if ($name === '' || mb_strlen($name) > 80) {
            Response::error('bad_name', 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('bad_email', 400);
        }
        if (mb_strlen($password) < 8) {
            Response::error('bad_password', 400);
        }

        $pdo = Db::pdo();
        $stmt = $pdo->prepare('SELECT id FROM parents WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            Response::error('email_taken', 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $pdo->beginTransaction();
        try {
            $pdo->prepare(
                'INSERT INTO parents (email, password_hash, display_name) VALUES (?, ?, ?)'
            )->execute([$email, $hash, $name]);
            $parentId = (int)$pdo->lastInsertId();

            $pdo->prepare(
                'INSERT INTO parent_settings (parent_id, settings_json) VALUES (?, ?)'
            )->execute([$parentId, json_encode([
                'speech_on' => true,
                'language' => 'en',
                'accessibility' => new \stdClass(),
            ], JSON_UNESCAPED_UNICODE)]);

            // Optional first child profile (never required for registration)
            $childName = $req->string('child_name');
            $child = null;
            if ($childName !== '') {
                $avatar = $req->string('avatar', '🧸');
                if (mb_strlen($avatar) > 8) {
                    $avatar = '🧸';
                }
                $lang = $req->string('preferred_language', 'en') ?: 'en';
                if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
                    $lang = 'en';
                }
                $dob = $req->string('date_of_birth');
                if ($dob === '') {
                    $dob = $req->string('dob');
                }
                $dobVal = null;
                $birthYear = null;
                $ageGroupId = $req->int('age_group_id', 0) ?: null;
                if ($dob !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dob)) {
                    $ts = strtotime($dob);
                    if ($ts !== false && $ts <= time()) {
                        $dobVal = $dob;
                        $birthYear = (int)substr($dob, 0, 4);
                        $ageYears = \LumaCubs\AgeService::ageFromDob($dob);
                        $fromDob = \LumaCubs\AgeService::ageGroupIdForAge($ageYears);
                        if ($fromDob !== null) {
                            $ageGroupId = $fromDob;
                        }
                    }
                }
                $pdo->prepare(
                    'INSERT INTO children
                      (parent_id, display_name, avatar, age_group_id, preferred_language, birth_year, date_of_birth)
                     VALUES (?, ?, ?, ?, ?, ?, ?)'
                )->execute([
                    $parentId,
                    mb_substr($childName, 0, 60),
                    $avatar,
                    $ageGroupId,
                    $lang,
                    $birthYear,
                    $dobVal,
                ]);
                $childId = (int)$pdo->lastInsertId();
                $pdo->prepare(
                    'INSERT INTO child_settings (child_id, settings_json) VALUES (?, ?)'
                )->execute([$childId, json_encode([
                    'speech_on' => true,
                    'language' => $lang,
                ], JSON_UNESCAPED_UNICODE)]);
                $pdo->prepare(
                    'INSERT INTO child_learning_controls (child_id) VALUES (?)'
                )->execute([$childId]);
                $child = \LumaCubs\AgeService::enrichChildRow([
                    'id' => $childId,
                    'display_name' => mb_substr($childName, 0, 60),
                    'avatar' => $avatar,
                    'age_group_id' => $ageGroupId,
                    'preferred_language' => $lang,
                    'date_of_birth' => $dobVal,
                    'birth_year' => $birthYear,
                    'learning_level_override' => null,
                ]);
            }

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            Response::error('register_failed', 500);
        }

        $session = SessionService::create($parentId);
        Response::ok([
            'parent' => [
                'id' => $parentId,
                'email' => $email,
                'display_name' => $name,
            ],
            'child' => $child,
            'token' => $session['token'],
            'expires_at' => $session['expires_at'],
        ], 201);
    }

    public static function login(Request $req): void
    {
        $email = strtolower($req->string('email'));
        $password = (string)$req->input('password', '');
        if ($email === '' || $password === '') {
            Response::error('missing', 400);
        }

        $stmt = Db::pdo()->prepare(
            'SELECT id, email, display_name, password_hash FROM parents WHERE email = ?'
        );
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || !password_verify($password, (string)$row['password_hash'])) {
            Response::error('invalid_credentials', 401);
        }

        $session = SessionService::create((int)$row['id']);
        Response::ok([
            'parent' => [
                'id' => (int)$row['id'],
                'email' => $row['email'],
                'display_name' => $row['display_name'],
            ],
            'token' => $session['token'],
            'expires_at' => $session['expires_at'],
        ]);
    }

    public static function logout(Request $req): void
    {
        SessionService::destroy($req->bearerToken());
        Response::ok(['message' => 'logged_out']);
    }

    public static function me(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        Response::ok(['parent' => $parent]);
    }

    public static function forgot(Request $req): void
    {
        $email = strtolower($req->string('email'));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('bad_email', 400);
        }
        $stmt = Db::pdo()->prepare('SELECT id FROM parents WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return generic success — do not leak account existence.
        if ($row) {
            $token = bin2hex(random_bytes(32));
            $hash = hash('sha256', $token);
            $expires = date('Y-m-d H:i:s', time() + 3600);
            Db::pdo()->prepare(
                'INSERT INTO password_reset_tokens (parent_id, token_hash, expires_at) VALUES (?, ?, ?)'
            )->execute([(int)$row['id'], $hash, $expires]);

            $payload = [
                'message' => 'If the account exists, a reset token was created.',
            ];
            // Local/dev only: expose token so parents can reset without email infra yet.
            if (\LumaCubs\Config::get('APP_ENV', 'local') === 'local') {
                $payload['dev_token'] = $token;
                $payload['expires_at'] = $expires;
            }
            Response::ok($payload);
        }
        Response::ok(['message' => 'If the account exists, a reset token was created.']);
    }

    public static function reset(Request $req): void
    {
        $token = $req->string('token');
        $password = (string)$req->input('password', '');
        if ($token === '') {
            Response::error('missing_token', 400);
        }
        if (mb_strlen($password) < 8) {
            Response::error('bad_password', 400);
        }
        $hash = hash('sha256', $token);
        $stmt = Db::pdo()->prepare(
            'SELECT id, parent_id, expires_at, used_at FROM password_reset_tokens WHERE token_hash = ?'
        );
        $stmt->execute([$hash]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || $row['used_at'] !== null) {
            Response::error('invalid_token', 400);
        }
        if (strtotime((string)$row['expires_at']) < time()) {
            Response::error('token_expired', 400);
        }

        $pwdHash = password_hash($password, PASSWORD_DEFAULT);
        $pdo = Db::pdo();
        $pdo->prepare('UPDATE parents SET password_hash = ?, updated_at = NOW() WHERE id = ?')
            ->execute([$pwdHash, (int)$row['parent_id']]);
        $pdo->prepare('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?')
            ->execute([(int)$row['id']]);
        $pdo->prepare('DELETE FROM parent_sessions WHERE parent_id = ?')
            ->execute([(int)$row['parent_id']]);

        Response::ok(['message' => 'Password updated successfully']);
    }
}