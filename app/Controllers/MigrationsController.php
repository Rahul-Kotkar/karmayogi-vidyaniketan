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
                case 'create_backup':
                    try {
                        $db = Database::getConnection();
                        $fname = self::createAutoBackup($db, 'manual');
                        $result = [
                            'success' => true,
                            'message' => "Database snapshot backup created successfully ({$fname}).",
                            'data'    => ['filename' => $fname]
                        ];
                    } catch (\Throwable $e) {
                        $result = ['success' => false, 'message' => "Backup failed: " . $e->getMessage()];
                    }
                    break;
                case 'list_backups':
                    $result = [
                        'success' => true,
                        'data'    => self::listBackups()
                    ];
                    break;
                case 'restore_backup':
                    $fname = $json['filename'] ?? $_POST['filename'] ?? '';
                    try {
                        $db = Database::getConnection();
                        $result = self::restoreBackup($db, $fname);
                    } catch (\Throwable $e) {
                        $result = ['success' => false, 'message' => "Restore failed: " . $e->getMessage()];
                    }
                    break;
                case 'save_db_config':
                    $host = trim($json['host'] ?? $_POST['host'] ?? 'localhost');
                    $port = trim($json['port'] ?? $_POST['port'] ?? '3306');
                    $dbName = trim($json['db'] ?? $_POST['db'] ?? '');
                    $user = trim($json['user'] ?? $_POST['user'] ?? '');
                    $pass = $json['pass'] ?? $_POST['pass'] ?? '';

                    if ($pass === '' && empty($json['clear_pass'])) {
                        $pass = Env::get('DB_PASS', '');
                    }

                    $buildDsn = function($h, $p, $d) {
                        if ($h === 'localhost' || empty($p)) {
                            return "mysql:host={$h};dbname={$d};charset=utf8mb4";
                        }
                        return "mysql:host={$h};port={$p};dbname={$d};charset=utf8mb4";
                    };

                    $testSuccess = false;
                    $testErr = '';
                    $workingHost = $host;
                    $options = [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ];

                    try {
                        $pdo = new PDO($buildDsn($host, $port, $dbName), $user, $pass, $options);
                        $testSuccess = true;
                    } catch (\PDOException $e1) {
                        $altHost = ($host === 'localhost') ? '127.0.0.1' : (($host === '127.0.0.1') ? 'localhost' : null);
                        if ($altHost) {
                            try {
                                $pdo = new PDO($buildDsn($altHost, $port, $dbName), $user, $pass, $options);
                                $testSuccess = true;
                                $workingHost = $altHost;
                            } catch (\PDOException $e2) {
                                $testErr = $e1->getMessage();
                            }
                        } else {
                            $testErr = $e1->getMessage();
                        }
                    }

                    if (!$testSuccess) {
                        $result = [
                            'success' => false,
                            'message' => "Database connection test failed: {$testErr}. In Hostinger hPanel -> Databases -> MySQL Databases, verify this user exists, password is correct, and user is assigned to database '{$dbName}' with ALL PRIVILEGES."
                        ];
                        break;
                    }

                    $envPath = self::getEnvPath();
                    self::updateEnvFile($envPath, [
                        'DB_HOST' => $workingHost,
                        'DB_PORT' => $port,
                        'DB_NAME' => $dbName,
                        'DB_USER' => $user,
                        'DB_PASS' => $pass,
                    ]);

                    Database::resetConnection();
                    Env::load($envPath);

                    // Run pending migrations only - NEVER force overwrite seeds
                    $migResult = self::runMigrations(false);

                    $result = [
                        'success' => true,
                        'message' => "Database connection verified and saved successfully! " . ($migResult['message'] ?? ''),
                        'data'    => [
                            'working_host' => $workingHost,
                            'mig_result'   => $migResult
                        ]
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
            'db_config'    => $status['db_config'] ?? null,
            'migrations'   => $status['migrations'],
            'total'        => $status['total'],
            'pending'      => $status['pending'],
            'data'         => $status
        ]);
        exit;
    }

    public static function getEnvPath(): string {
        $candidates = [
            dirname(__DIR__, 2) . '/.env',
            dirname(__DIR__, 3) . '/.env',
            ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/.env',
            ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/../.env',
            __DIR__ . '/../../.env'
        ];
        foreach ($candidates as $c) {
            if (!empty($c) && file_exists($c)) {
                return $c;
            }
        }
        return dirname(__DIR__, 2) . '/.env';
    }

    public static function updateEnvFile(string $path, array $keyValues): bool {
        $content = file_exists($path) ? file_get_contents($path) : '';
        foreach ($keyValues as $k => $v) {
            $formattedVal = (string)$v;
            if (preg_match('/[\s#"\'\\\\]/', $formattedVal) || $formattedVal === '') {
                $formattedVal = '"' . addcslashes($formattedVal, '"\\$') . '"';
            }
            $pattern = "/^{$k}=.*$/m";
            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, "{$k}={$formattedVal}", $content);
            } else {
                $content .= "\n{$k}={$formattedVal}";
            }
        }
        return (bool)@file_put_contents($path, trim($content) . "\n");
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
            'db_config'    => [
                'host'     => Env::get('DB_HOST', 'localhost'),
                'port'     => Env::get('DB_PORT', '3306'),
                'db'       => Env::get('DB_NAME', 'vidyaniketan_school'),
                'user'     => Env::get('DB_USER', 'root'),
                'has_pass' => (Env::get('DB_PASS', '') !== '')
            ],
            'migrations'   => $migrations,
            'total'        => count($migrations),
            'pending'      => count(array_filter($migrations, fn($m) => !$m['executed'])),
            'backups'      => self::listBackups()
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

            // Automatic snapshot backup before executing any migrations to prevent data loss
            self::createAutoBackup($db, 'pre_migration');

            $ran = [];
            foreach ($files as $file) {
                if (!str_ends_with($file, '.sql')) continue;
                if (!empty($specificFile) && $file !== $specificFile) continue;
                if (!$force && in_array($file, $executed)) continue;

                // CRITICAL SEED SHIELD: Never re-run baseline seed files if they have already run
                // or if database tables already contain populated user data!
                if (str_contains(strtolower($file), 'seed')) {
                    if (in_array($file, $executed)) {
                        continue;
                    }
                    try {
                        $checkUsers = (int)$db->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
                        if ($checkUsers > 0) {
                            $ins = $db->prepare("INSERT INTO migrations (migration, executed_at) VALUES (:migration, NOW()) ON DUPLICATE KEY UPDATE executed_at = NOW()");
                            $ins->execute([':migration' => $file]);
                            continue;
                        }
                    } catch (\Throwable $tSeed) {}
                }

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
                return ['success' => true, 'message' => 'Database schema is already up to date. All migrations verified.', 'data' => ['ran' => []]];
            }

            return ['success' => true, 'message' => 'Successfully executed ' . count($ran) . ' migration(s): ' . implode(', ', $ran), 'data' => ['ran' => $ran]];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Migration failed: ' . $e->getMessage(), 'data' => []];
        }
    }

    public static function getBackupDir(): string {
        $dir = dirname(__DIR__, 2) . '/persistent_storage/backups';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }

    public static function createAutoBackup(PDO $db, string $reason = 'auto'): ?string {
        try {
            $tables = [
                'users', 'settings', 'departments', 'faculty', 'courses', 
                'notices', 'events', 'facilities', 'gallery_categories', 
                'gallery', 'admissions', 'pages', 'contact_messages'
            ];
            $backupData = [
                'created_at' => date('Y-m-d H:i:s'),
                'reason'     => $reason,
                'tables'     => []
            ];

            foreach ($tables as $tbl) {
                try {
                    $stmt = $db->query("SELECT * FROM `{$tbl}`");
                    if ($stmt) {
                        $backupData['tables'][$tbl] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                } catch (\Throwable $tErr) {
                    // Ignore missing tables during pre-migration
                }
            }

            $backupDir = self::getBackupDir();
            $filename = 'backup_' . date('Ymd_His') . '_' . $reason . '.json';
            $path = $backupDir . '/' . $filename;
            @file_put_contents($path, json_encode($backupData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            // Retain up to 20 recent backups
            $scanned = @scandir($backupDir) ?: [];
            $allBackups = [];
            foreach ($scanned as $f) {
                if (str_ends_with($f, '.json')) {
                    $allBackups[] = $backupDir . '/' . $f;
                }
            }
            if (count($allBackups) > 20) {
                sort($allBackups);
                while (count($allBackups) > 20) {
                    $old = array_shift($allBackups);
                    @unlink($old);
                }
            }

            return $filename;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function listBackups(): array {
        $backupDir = self::getBackupDir();
        $list = [];
        if (is_dir($backupDir)) {
            $scanned = @scandir($backupDir) ?: [];
            foreach ($scanned as $f) {
                if (str_ends_with($f, '.json')) {
                    $path = $backupDir . '/' . $f;
                    $list[] = [
                        'filename'   => $f,
                        'size_bytes' => filesize($path),
                        'created_at' => date('Y-m-d H:i:s', filemtime($path))
                    ];
                }
            }
        }
        usort($list, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));
        return $list;
    }

    public static function restoreBackup(PDO $db, string $filename): array {
        $backupDir = self::getBackupDir();
        $safeName = basename($filename);
        $path = $backupDir . '/' . $safeName;
        if (!file_exists($path)) {
            return ['success' => false, 'message' => 'Selected backup file not found.'];
        }
        $raw = file_get_contents($path);
        $data = json_decode($raw, true);
        if (!is_array($data) || empty($data['tables'])) {
            return ['success' => false, 'message' => 'Corrupt or unreadable backup file.'];
        }

        $restored = [];
        $db->beginTransaction();
        try {
            foreach ($data['tables'] as $table => $rows) {
                if (!is_array($rows)) continue;
                $db->exec("DELETE FROM `{$table}`");
                if (!empty($rows)) {
                    $cols = array_keys($rows[0]);
                    $colList = implode('`, `', $cols);
                    $placeholders = implode(', ', array_fill(0, count($cols), '?'));
                    $insertSql = "INSERT INTO `{$table}` (`{$colList}`) VALUES ({$placeholders})";
                    $stmt = $db->prepare($insertSql);
                    foreach ($rows as $row) {
                        $stmt->execute(array_values($row));
                    }
                }
                $restored[$table] = count($rows);
            }
            $db->commit();
            return [
                'success' => true,
                'message' => 'Database successfully restored from snapshot (' . count($restored) . ' tables restored).',
                'restored' => $restored
            ];
        } catch (\Throwable $e) {
            $db->rollBack();
            return ['success' => false, 'message' => 'Restore failed: ' . $e->getMessage()];
        }
    }
}
