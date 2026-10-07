<?php
namespace App\Helpers;

use App\Config\Database;
use PDO;
use Exception;

class MediaStorage {
    private static function getProjectRoot(): string {
        return dirname(__DIR__, 2);
    }

    public static function getPublicUploadsDir(): string {
        return self::getProjectRoot() . '/public/uploads';
    }

    public static function getPersistentStorageDir(): string {
        return self::getProjectRoot() . '/persistent_storage';
    }

    public static function cleanPath(string $path): string {
        $clean = ltrim($path, '/\\');
        if (str_starts_with($clean, 'uploads/')) {
            $clean = substr($clean, 8);
        } elseif (str_starts_with($clean, 'public/uploads/')) {
            $clean = substr($clean, 15);
        } elseif (str_starts_with($clean, 'backend/uploads/')) {
            $clean = substr($clean, 16);
        }
        return ltrim($clean, '/\\');
    }

    /**
     * Dual-write storage:
     * 1. Public disk (public/uploads/)
     * 2. External disk (persistent_storage/)
     * 3. MySQL database (system_media_storage table as LONGBLOB)
     */
    public static function save(string $relativePath, string $sourcePath, string $mimeType = ''): bool {
        $rel = self::cleanPath($relativePath);
        if (empty($rel) || !file_exists($sourcePath)) {
            return false;
        }

        if (empty($mimeType) && function_exists('mime_content_type')) {
            $mimeType = @mime_content_type($sourcePath) ?: 'application/octet-stream';
        }

        $fileData = file_get_contents($sourcePath);
        if ($fileData === false) {
            return false;
        }
        $fileSize = strlen($fileData);

        // 1. Write to public/uploads
        $publicDest = self::getPublicUploadsDir() . '/' . $rel;
        $publicDir = dirname($publicDest);
        if (!is_dir($publicDir)) {
            @mkdir($publicDir, 0755, true);
        }
        @file_put_contents($publicDest, $fileData);

        // Mirror to backend/uploads for backward compatibility with existing direct links
        $backendDest = self::getProjectRoot() . '/backend/uploads/' . $rel;
        $backendDir = dirname($backendDest);
        if (!is_dir($backendDir)) {
            @mkdir($backendDir, 0755, true);
        }
        @file_put_contents($backendDest, $fileData);

        // 2. Write duplicate to persistent_storage/ (outside web root)
        $persistentDest = self::getPersistentStorageDir() . '/' . $rel;
        $persistentDir = dirname($persistentDest);
        if (!is_dir($persistentDir)) {
            @mkdir($persistentDir, 0755, true);
        }
        @file_put_contents($persistentDest, $fileData);

        // 3. Insert / update binary blob in MySQL system_media_storage
        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $stmt = $db->prepare("
                INSERT INTO system_media_storage (file_path, mime_type, file_data, file_size, updated_at)
                VALUES (:file_path, :mime_type, :file_data, :file_size, NOW())
                ON DUPLICATE KEY UPDATE
                    mime_type = VALUES(mime_type),
                    file_data = VALUES(file_data),
                    file_size = VALUES(file_size),
                    updated_at = NOW()
            ");
            $stmt->bindValue(':file_path', $rel, PDO::PARAM_STR);
            $stmt->bindValue(':mime_type', $mimeType, PDO::PARAM_STR);
            $stmt->bindValue(':file_data', $fileData, PDO::PARAM_LOB);
            $stmt->bindValue(':file_size', $fileSize, PDO::PARAM_INT);
            $stmt->execute();
        } catch (Exception $e) {
            error_log("MediaStorage database backup notice: " . $e->getMessage());
        }

        return true;
    }

    /**
     * Self-healing single file restore:
     * If file is missing from public/uploads/, restores it from persistent_storage/ or MySQL LONGBLOB.
     */
    public static function restore(string $relativePath): bool {
        $rel = self::cleanPath($relativePath);
        if (empty($rel)) {
            return false;
        }

        $publicDest = self::getPublicUploadsDir() . '/' . $rel;
        if (file_exists($publicDest) && filesize($publicDest) > 0) {
            return true;
        }

        // Try persistent_storage first
        $persistentPath = self::getPersistentStorageDir() . '/' . $rel;
        if (file_exists($persistentPath) && filesize($persistentPath) > 0) {
            $dir = dirname($publicDest);
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            if (@copy($persistentPath, $publicDest)) {
                return true;
            }
        }

        // Try database system_media_storage
        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $stmt = $db->prepare("SELECT file_data, mime_type FROM system_media_storage WHERE file_path = :file_path LIMIT 1");
            $stmt->execute([':file_path' => $rel]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && !empty($row['file_data'])) {
                $dir = dirname($publicDest);
                if (!is_dir($dir)) {
                    @mkdir($dir, 0755, true);
                }
                file_put_contents($publicDest, $row['file_data']);

                // Also populate persistent_storage
                $pDir = dirname($persistentPath);
                if (!is_dir($pDir)) {
                    @mkdir($pDir, 0755, true);
                }
                file_put_contents($persistentPath, $row['file_data']);

                return true;
            }
        } catch (Exception $e) {
            error_log("MediaStorage restore error: " . $e->getMessage());
        }

        return false;
    }

    /**
     * Self-Healing sync: Re-populates all missing physical media files from database / persistent backup.
     */
    public static function syncAllToDisk(): int {
        $restoredCount = 0;
        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $stmt = $db->query("SELECT file_path, mime_type, file_data FROM system_media_storage");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $rel = self::cleanPath($row['file_path']);
                $publicDest = self::getPublicUploadsDir() . '/' . $rel;
                if (!file_exists($publicDest) || filesize($publicDest) === 0) {
                    $dir = dirname($publicDest);
                    if (!is_dir($dir)) {
                        @mkdir($dir, 0755, true);
                    }
                    if (!empty($row['file_data'])) {
                        file_put_contents($publicDest, $row['file_data']);
                        $restoredCount++;
                    }
                }
            }
        } catch (Exception $e) {
            // Silently ignore if DB credentials are not configured yet
        }
        return $restoredCount;
    }

    public static function ensureTableExists(PDO $db): void {
        $sql = "CREATE TABLE IF NOT EXISTS `system_media_storage` (
            `file_path` VARCHAR(255) NOT NULL PRIMARY KEY,
            `mime_type` VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
            `file_data` LONGBLOB NOT NULL,
            `file_size` INT UNSIGNED NOT NULL DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_sms_mime` (`mime_type`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        $db->exec($sql);
    }
}
