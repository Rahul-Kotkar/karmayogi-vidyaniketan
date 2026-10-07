-- ========================================================
-- Migration 006: User Activity and Audit Logging System
-- Tracks Admin logins, IP addresses, timestamps, and data changes
-- ========================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_email` VARCHAR(191) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `action` VARCHAR(50) NOT NULL, -- 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE'
  `resource` VARCHAR(100) NOT NULL, -- 'auth', 'notices', 'events', 'faculty', 'courses', 'departments', 'facilities', 'gallery', 'admissions', 'pages', 'settings', 'users', etc.
  `resource_id` VARCHAR(100) NULL,
  `description` TEXT NOT NULL,
  `details` LONGTEXT NULL, -- JSON formatted data diff or payload
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_act_user_id` (`user_id`),
  INDEX `idx_act_user_email` (`user_email`),
  INDEX `idx_act_action` (`action`),
  INDEX `idx_act_resource` (`resource`),
  INDEX `idx_act_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
