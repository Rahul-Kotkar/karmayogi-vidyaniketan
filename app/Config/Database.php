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
            $db   = Env::get('DB_NAME', 'vidyaniketan_school');
            $user = Env::get('DB_USER', 'root');
            $pass = Env::get('DB_PASS', '');

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $buildDsn = function(string $h, string $p, string $d): string {
                if ($h === 'localhost' || empty($p)) {
                    return "mysql:host={$h};dbname={$d};charset=utf8mb4";
                }
                return "mysql:host={$h};port={$p};dbname={$d};charset=utf8mb4";
            };

            $dsn = $buildDsn($host, $port, $db);

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $firstErr) {
                // If localhost failed (e.g. host user mismatch or unix socket issue), try 127.0.0.1 (and vice versa)
                $alternateHost = ($host === 'localhost') ? '127.0.0.1' : (($host === '127.0.0.1') ? 'localhost' : null);
                if ($alternateHost !== null) {
                    try {
                        $altDsn = $buildDsn($alternateHost, $port, $db);
                        self::$instance = new PDO($altDsn, $user, $pass, $options);
                    } catch (PDOException $secondErr) {
                        // Throw original exception with helpful context
                        throw $firstErr;
                    }
                } else {
                    throw $firstErr;
                }
            }

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
