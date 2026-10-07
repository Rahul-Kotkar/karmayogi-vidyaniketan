<?php
namespace App\Config;

class Env {
    private static array $variables = [];

    public static function load(string $path): void {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || str_starts_with($line, '#')) {
                continue;
            }

            if (str_contains($line, '=')) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value, " \t\n\r\0\x0B\"'");
                self::$variables[$name] = $value;
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
                putenv("{$name}={$value}");
            }
        }
    }

    public static function get(string $key, mixed $default = null): mixed {
        return self::$variables[$key] ?? $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?: $default;
    }
}
