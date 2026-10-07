<?php
// ========================================================
// College of Physiotherapy - Standard JSON Response Helper
// ========================================================

class Response {
    public static function json($data = null, int $code = 200, bool $success = true, ?string $message = null): void {
        http_response_code($code);
        $payload = [
            'success' => $success,
            'message' => $message,
            'data'    => $data
        ];
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success($data = null, string $message = 'Success', int $code = 200): void {
        self::json($data, $code, true, $message);
    }

    public static function error(string $message = 'An error occurred', int $code = 400, $errors = null): void {
        http_response_code($code);
        $payload = [
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ];
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): void {
        self::error($message, 403);
    }
}
