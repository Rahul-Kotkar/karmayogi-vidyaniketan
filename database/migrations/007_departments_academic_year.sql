-- Migration: 007_departments_academic_year.sql
-- Add year-wise categorization and rich fields to departments table

ALTER TABLE `departments`
  ADD COLUMN IF NOT EXISTS `academic_year` VARCHAR(50) NULL DEFAULT 'year-1' AFTER `head`,
  ADD COLUMN IF NOT EXISTS `tagline` VARCHAR(255) NULL AFTER `head`,
  ADD COLUMN IF NOT EXISTS `specializations` TEXT NULL AFTER `description`,
  ADD COLUMN IF NOT EXISTS `subject_count` INT NOT NULL DEFAULT 0 AFTER `specializations`;

-- Index for fast year-based queries
CREATE INDEX IF NOT EXISTS `idx_dept_year` ON `departments` (`academic_year`);
