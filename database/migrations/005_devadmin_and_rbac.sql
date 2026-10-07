-- ========================================================
-- Migration 005: Developer Admin & Role-Based Access Control (RBAC)
-- ========================================================

SET NAMES utf8mb4;

-- 1. Ensure `role` supports custom roles like 'devadmin'
ALTER TABLE `users` MODIFY COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'admin';

-- 2. Add `permissions` column to store JSON array of permitted menu & submenu keys
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `permissions` LONGTEXT NULL AFTER `role`;

-- 3. Remove any old accounts like vikhepatil and ensure devkarma is root Administrator
DELETE FROM `users` WHERE `email` LIKE '%vikhepatil%';

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `permissions`, `is_active`)
VALUES (
  1,
  'Administrator',
  'devkarma',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'superadmin',
  '["*"]',
  1
)
ON DUPLICATE KEY UPDATE
  `name` = 'Administrator',
  `email` = 'devkarma',
  `role` = 'superadmin',
  `permissions` = '["*"]',
  `is_active` = 1;
