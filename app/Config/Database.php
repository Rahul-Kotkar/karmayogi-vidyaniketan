<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            if (empty(Env::get('DB_NAME'))) {
                if (file_exists(__DIR__ . '/../../.env')) {
                    Env::load(__DIR__ . '/../../.env');
                } elseif (file_exists(__DIR__ . '/../../../.env')) {
                    Env::load(__DIR__ . '/../../../.env');
                }
            }
            $host = Env::get('DB_HOST', 'localhost');
            $port = Env::get('DB_PORT', '3306');
            $db   = Env::get('DB_NAME', 'physio_college');
            $user = Env::get('DB_USER', 'root');
            $pass = Env::get('DB_PASS', '');

            // Use socket connection when host is localhost (Hostinger/cPanel fix)
            if ($host === 'localhost' || empty($port)) {
                $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
            } else {
                $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
            }

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            self::$instance = new PDO($dsn, $user, $pass, $options);
            try {
                self::$instance->exec("SET time_zone = '+05:30'");
            } catch (PDOException $tzErr) {
                // Ignore if MySQL server timezone tables are not populated
            }
        }
        return self::$instance;
    }

    public static function resetConnection(): void {
        self::$instance = null;
    }
}
