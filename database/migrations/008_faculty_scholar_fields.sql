-- Migration: 008_faculty_scholar_fields.sql
-- Add program badge, research interests, and optional academic/professional URLs to faculty table

ALTER TABLE `faculty`
  ADD COLUMN IF NOT EXISTS `program_badge` VARCHAR(50) NULL DEFAULT 'BPT' AFTER `designation`,
  ADD COLUMN IF NOT EXISTS `research_interests` TEXT NULL AFTER `profile_description`,
  ADD COLUMN IF NOT EXISTS `google_scholar` VARCHAR(500) NULL AFTER `research_interests`,
  ADD COLUMN IF NOT EXISTS `orcid` VARCHAR(255) NULL AFTER `google_scholar`,
  ADD COLUMN IF NOT EXISTS `scopus` VARCHAR(500) NULL AFTER `orcid`,
  ADD COLUMN IF NOT EXISTS `linkedin` VARCHAR(500) NULL AFTER `scopus`,
  ADD COLUMN IF NOT EXISTS `research_gate` VARCHAR(500) NULL AFTER `linkedin`,
  ADD COLUMN IF NOT EXISTS `resume_url` VARCHAR(500) NULL AFTER `research_gate`;
