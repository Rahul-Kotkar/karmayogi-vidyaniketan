<?php
// ========================================================
// College of Physiotherapy - Authentication Helper
// Secure HMAC-SHA256 Token & Password Hashing
// ========================================================

class Auth {
    private const TOKEN_EXPIRY_SECONDS = 7 * 24 * 3600; // 7 days

    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    public static function generateToken(array $user): string {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $permissions = $user['permissions'] ?? [];
        if ($user['role'] === 'devadmin') {
            $permissions = ['*'];
        }
        $payload = [
            'sub'         => $user['id'],
            'name'        => $user['name'],
            'email'       => $user['email'],
            'role'        => $user['role'] ?? 'admin',
            'permissions' => $permissions,
            'iat'         => time(),
            'exp'         => time() + self::TOKEN_EXPIRY_SECONDS
        ];

        $encodedHeader = self::base64UrlEncode(json_encode($header));
        $encodedPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", APP_SECRET, true);
        $encodedSignature = self::base64UrlEncode($signature);

        return "{$encodedHeader}.{$encodedPayload}.{$encodedSignature}";
    }

    public static function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $signature = self::base64UrlDecode($encodedSignature);
        $expectedSignature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", APP_SECRET, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($encodedPayload), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    public static function getBearerToken(): ?string {
        $headers = self::getRequestHeaders();
        $authHeader = null;

        foreach ($headers as $key => $value) {
            if (strcasecmp($key, 'Authorization') === 0) {
                $authHeader = $value;
                break;
            }
        }

        if (!$authHeader) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        if ($authHeader && preg_match('/Bearer\s+(\S+)/i', trim($authHeader), $matches)) {
            return $matches[1];
        }
        return null;
    }

    private static function getRequestHeaders(): array {
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if ($headers) return $headers;
        }
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (substr($key, 0, 5) === 'HTTP_') {
                $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                $headers[$header] = $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) $headers['Content-Type'] = $_SERVER['CONTENT_TYPE'];
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        return $headers;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }
}
