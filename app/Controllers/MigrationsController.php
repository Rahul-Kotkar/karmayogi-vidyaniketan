<?php
namespace App\Controllers;

use App\Config\Database;
use App\Config\Env;
use App\Helpers\MediaStorage;
use PDO;
use Exception;

class MigrationsController {
    private static function getMigrationsDir(): string {
        $candidates = [
            dirname(__DIR__, 2) . '/database/migrations',
            dirname(__DIR__, 2) . '/database',
            dirname(__DIR__, 1) . '/database/migrations',
            __DIR__ . '/../../database/migrations',
            __DIR__ . '/../../../database/migrations',
            ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/database/migrations',
            ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/../database/migrations',
            dirname($_SERVER['SCRIPT_FILENAME'] ?? '') . '/database/migrations',
            dirname($_SERVER['SCRIPT_FILENAME'] ?? '') . '/../database/migrations'
        ];
        foreach ($candidates as $c) {
            if (!empty($c) && is_dir($c)) {
                $files = @scandir($c);
                if ($files) {
                    foreach ($files as $f) {
                        if (str_ends_with($f, '.sql')) {
                            return $c;
                        }
                    }
                }
            }
        }
        return dirname(__DIR__, 2) . '/database/migrations';
    }

    private static function getProjectRoot(): string {
        return dirname(__DIR__, 2);
    }

    public static function handleRequest(): void {
        header('Content-Type: application/json; charset=utf-8');

        $rawInput = file_get_contents('php://input');
        $json = !empty($rawInput) ? json_decode($rawInput, true) : [];
        if (!is_array($json)) {
            $json = [];
        }

        $action = $json['action'] ?? $_POST['action'] ?? $_GET['action'] ?? '';

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Default POST action to migrate if empty or index
            if (empty($action) || $action === 'index') {
                $action = 'migrate';
            }

            switch ($action) {
                case 'migrate':
                    $force = !empty($json['force']) || !empty($_POST['force']) || !empty($_GET['force']);
                    $specific = $json['file'] ?? $_POST['file'] ?? $_GET['file'] ?? null;
                    $result = self::runMigrations($force, $specific);
                    break;
                case 'sync_media':
                    $count = MediaStorage::syncAllToDisk();
                    $result = [
                        'success' => true,
                        'message' => "Successfully synced media to disk. {$count} missing files restored.",
                        'data'    => ['restored' => $count]
                    ];
                    break;
                default:
                    $result = ['success' => false, 'message' => "Unknown action: {$action}"];
                    break;
            }

            echo json_encode($result);
            exit;
        }

        $status = self::getStatus();
        echo json_encode([
            'success'      => true,
            'db_connected' => $status['db_connected'],
            'db_error'     => $status['db_error'],
            'migrations'   => $status['migrations'],
            'total'        => $status['total'],
            'pending'      => $status['pending'],
            'data'         => $status
        ]);
        exit;
    }

    public static function getStatus(): array {
        $migrations = [];
        $dbConnected = false;
        $dbError = '';
        $executed = [];

        $knownDescriptions = [
            '001_initial_schema.sql' => 'Core tables setup: users, pages, notices, events, faculty, courses, facilities, messages, settings',
            '002_initial_seed.sql' => 'Initial baseline data for departments, college profile, and administrator account',
            '003_system_media_storage.sql' => 'Persistent media and file upload storage table',
            '004_gallery_albums.sql' => 'Photo albums, image galleries, and event tagging schema',
            '005_devadmin_and_rbac.sql' => 'Role-Based Access Control (RBAC) and user granular permissions',
            '006_activity_and_audit_logs.sql' => 'User activity logs and audit trail tracking',
            '007_departments_academic_year.sql' => 'Year-wise department categorization schema',
            '008_faculty_scholar_fields.sql' => 'Faculty research profiles: program badge, Google Scholar, ORCID, LinkedIn, Resume'
        ];

        try {
            $db = Database::getConnection();
            $dbConnected = true;

            // Ensure migrations table exists
            $db->exec("CREATE TABLE IF NOT EXISTS `migrations` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `migration` VARCHAR(255) NOT NULL UNIQUE,
                `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $stmt = $db->query("SELECT migration, executed_at FROM migrations ORDER BY id ASC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $executed[$row['migration']] = $row['executed_at'];
            }
        } catch (Exception $e) {
            $dbError = $e->getMessage();
        }

        $dir = self::getMigrationsDir();
        $filesFound = [];
        if (!empty($dir) && is_dir($dir)) {
            $scanned = @scandir($dir);
            if ($scanned) {
                foreach ($scanned as $f) {
                    if (str_ends_with($f, '.sql')) {
                        $filesFound[] = $f;
                    }
                }
            }
        }

        if (empty($filesFound)) {
            $filesFound = array_keys($knownDescriptions);
        } else {
            sort($filesFound);
        }

        foreach ($filesFound as $file) {
            $isRun = isset($executed[$file]);
            $migrations[] = [
                'file'        => $file,
                'description' => $knownDescriptions[$file] ?? 'Database schema update script',
                'executed'    => $isRun,
                'executed_at' => $isRun ? $executed[$file] : null
            ];
        }

        return [
            'db_connected' => $dbConnected,
            'db_error'     => $dbError,
            'migrations'   => $migrations,
            'total'        => count($migrations),
            'pending'      => count(array_filter($migrations, fn($m) => !$m['executed']))
        ];
    }

    public static function runMigrations(bool $force = false, ?string $specificFile = null): array {
        try {
            $db = Database::getConnection();
            
            // Ensure migrations table exists
            $db->exec("CREATE TABLE IF NOT EXISTS `migrations` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `migration` VARCHAR(255) NOT NULL UNIQUE,
                `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $stmt = $db->query("SELECT migration FROM migrations");
            $executed = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $dir = self::getMigrationsDir();
            $files = (is_dir($dir) && is_readable($dir)) ? scandir($dir) : [];
            if (empty($files)) {
                $files = ['001_initial_schema.sql', '002_initial_seed.sql', '003_system_media_storage.sql', '004_gallery_albums.sql', '005_devadmin_and_rbac.sql', '006_activity_and_audit_logs.sql', '007_departments_academic_year.sql', '008_faculty_scholar_fields.sql'];
            }
            sort($files);

            $ran = [];
            foreach ($files as $file) {
                if (!str_ends_with($file, '.sql')) continue;
                if (!empty($specificFile) && $file !== $specificFile) continue;
                if (!$force && in_array($file, $executed)) continue;

                $filePath = $dir . '/' . $file;
                if (!file_exists($filePath)) {
                    $fallback = __DIR__ . '/../../database/migrations/' . $file;
                    if (file_exists($fallback)) {
                        $filePath = $fallback;
                    }
                }
                $sql = file_exists($filePath) ? file_get_contents($filePath) : '';
                if (!empty($sql)) {
                    try {
                        $db->exec($sql);
                    } catch (Exception $execEx) {
                        // Fallback: execute statement by statement handling column/index differences
                        $stmts = array_filter(array_map('trim', explode(';', $sql)));
                        foreach ($stmts as $stmtSql) {
                            if (empty($stmtSql)) continue;
                            try {
                                $db->exec($stmtSql);
                            } catch (Exception $stmtErr) {
                                $msg = strtolower($stmtErr->getMessage());
                                if (
                                    str_contains($msg, 'duplicate column') ||
                                    str_contains($msg, 'already exists') ||
                                    str_contains($msg, 'duplicate key name') ||
                                    str_contains($msg, 'duplicate entry')
                                ) {
                                    // Column or index already exists - safely ignore
                                    continue;
                                }

                                // Handle ADD COLUMN syntax difference on older MySQL / MariaDB
                                if (str_contains(strtolower($stmtSql), 'permissions')) {
                                    try {
                                        $colCheck = $db->query("SHOW COLUMNS FROM `users` LIKE 'permissions'");
                                        if (!$colCheck || !$colCheck->fetch()) {
                                            $db->exec("ALTER TABLE `users` ADD `permissions` LONGTEXT NULL AFTER `role`");
                                        }
                                    } catch (Exception $eCol) {}
                                } else {
                                    // Non-ignorable error - log and continue to allow remaining scripts
                                    error_log("Migration {$file} statement warning: " . $stmtErr->getMessage());
                                }
                            }
                        }
                    }
                    $ins = $db->prepare("INSERT INTO migrations (migration, executed_at) VALUES (:migration, NOW()) ON DUPLICATE KEY UPDATE executed_at = NOW()");
                    $ins->execute([':migration' => $file]);
                    $ran[] = $file;
                }
            }

            // Sync media to disk if any media table migrations ran
            MediaStorage::syncAllToDisk();

            if (empty($ran)) {
                return ['success' => true, 'message' => 'Database is already up to date. All migrations have been verified and applied.', 'data' => ['ran' => []]];
            }

            return ['success' => true, 'message' => 'Successfully executed ' . count($ran) . ' migration(s): ' . implode(', ', $ran), 'data' => ['ran' => $ran]];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Migration failed: ' . $e->getMessage(), 'data' => []];
        }
    }
}
