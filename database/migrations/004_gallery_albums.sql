-- ========================================================
-- Migration 004: Gallery Albums and Multi-Photo Support
-- ========================================================

CREATE TABLE IF NOT EXISTS `gallery_albums` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `cover_image` VARCHAR(500) NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `gallery_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_album_cat` (`category_id`),
  INDEX `idx_album_pub` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_photos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `album_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(255) NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_photo_album` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrate existing items from gallery table if gallery_albums is empty
INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 1, 1, 'Campus & Infrastructure', 'State-of-the-art campus buildings, lecture halls, and facilities.', 'https://picsum.photos/seed/campus1/800/600', 1, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 1);

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 2, 2, 'Academic Activities & Sessions', 'Interactive lectures, seminars, and academic discussions.', 'https://picsum.photos/seed/acad1/800/600', 2, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 2);

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 3, 3, 'Clinical & Hospital Training', 'Hands-on OPD and inpatient clinical postings at the attached hospital.', 'https://picsum.photos/seed/clin1/800/600', 3, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 3);

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 4, 4, 'Annual Events & Celebrations', 'Convocation ceremonies, cultural festivals, and annual functions.', 'https://picsum.photos/seed/event1/800/600', 4, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 4);

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 5, 6, 'Hands-on Workshops & Demos', 'Manual therapy workshops, electrotherapy demos, and practical training.', 'https://picsum.photos/seed/wksp1/800/600', 5, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 5);

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`)
SELECT 6, 7, 'Sports Meet & Athletics', 'Annual inter-collegiate sports and recreational activities.', 'https://picsum.photos/seed/sport1/800/600', 6, 1
WHERE NOT EXISTS (SELECT 1 FROM `gallery_albums` WHERE `id` = 6);

-- Populate existing photos into their respective albums
INSERT INTO `gallery_photos` (`album_id`, `image_url`, `caption`, `order_index`)
SELECT 
  CASE 
    WHEN category_id = 1 THEN 1
    WHEN category_id = 2 THEN 2
    WHEN category_id = 3 THEN 3
    WHEN category_id = 4 THEN 4
    WHEN category_id IN (5, 6) THEN 5
    WHEN category_id = 7 THEN 6
    ELSE 1
  END AS `album_id`,
  `image_url`,
  `title` AS `caption`,
  `order_index`
FROM `gallery`
WHERE NOT EXISTS (SELECT 1 FROM `gallery_photos` LIMIT 1);
