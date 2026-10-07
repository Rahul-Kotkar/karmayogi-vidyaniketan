-- ========================================================
-- Migration 003: System Media Storage & Migrations Tracker
-- ========================================================

CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `migration` VARCHAR(255) NOT NULL UNIQUE,
  `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_media_storage` (
  `file_path` VARCHAR(255) NOT NULL PRIMARY KEY,
  `mime_type` VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
  `file_data` LONGBLOB NOT NULL,
  `file_size` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_sms_mime` (`mime_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
