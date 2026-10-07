<?php
// ========================================================
// College of Physiotherapy - Auth Middleware
// ========================================================

require_once __DIR__ . '/../helpers/Auth.php';
require_once __DIR__ . '/../helpers/Response.php';

class AuthMiddleware {
    public static function requireAdmin(): array {
        $token = Auth::getBearerToken();
        if (!$token) {
            Response::unauthorized('Authentication token is required.');
        }

        $payload = Auth::verifyToken($token);
        if (!$payload) {
            Response::unauthorized('Session has expired or token is invalid. Please log in again.');
        }

        return $payload;
    }

    public static function requireDevAdmin(): array {
        $payload = self::requireAdmin();
        $role = strtolower($payload['role'] ?? '');
        $email = strtolower($payload['email'] ?? '');
        $name = strtolower($payload['name'] ?? '');
        $sub = (int)($payload['sub'] ?? 0);

        $isDev = ($role === 'superadmin' || $role === 'devadmin' || $role === 'developer' || $email === 'devkarma' || str_contains($email, 'devkarma') || $sub === 1);
        if (!$isDev) {
            Response::error('Access forbidden: Administrator credentials required.', 403);
        }
        return $payload;
    }
}
