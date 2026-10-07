<?php
// ========================================================
// College of Physiotherapy - Safe File & Image Upload Helper
// ========================================================

require_once __DIR__ . '/../../app/Config/Env.php';
require_once __DIR__ . '/../../app/Config/Database.php';
require_once __DIR__ . '/../../app/Helpers/MediaStorage.php';

use App\Helpers\MediaStorage;

class Uploader {
    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private const ALLOWED_MIMES = [
        'image/jpeg'      => 'jpg',
        'image/png'       => 'png',
        'image/webp'      => 'webp',
        'image/gif'       => 'gif',
        'application/pdf' => 'pdf'
    ];

    public static function upload(array $file, string $subfolder = 'general'): string {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new Exception('Invalid upload parameters.');
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new Exception('No file was uploaded.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new Exception('Exceeded file size limit.');
            default:
                throw new Exception('Unknown upload error.');
        }

        if ($file['size'] > self::MAX_FILE_SIZE) {
            throw new Exception('File size exceeds the 10MB maximum limit.');
        }

        // Validate MIME type securely using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::ALLOWED_MIMES)) {
            throw new Exception("Invalid file format ({$mime}). Only JPG, PNG, WEBP, and PDF files are permitted.");
        }

        $extension = self::ALLOWED_MIMES[$mime];
        $safeSubfolder = preg_replace('/[^a-zA-Z0-9_-]/', '', $subfolder) ?: 'general';
        $targetDir = defined('UPLOAD_BASE_DIR') ? UPLOAD_BASE_DIR . '/' . $safeSubfolder : MediaStorage::getPublicUploadsDir() . '/' . $safeSubfolder;

        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0755, true)) {
                throw new Exception('Failed to create upload destination directory.');
            }
        }

        // Generate unique sanitized filename
        $originalBasename = pathinfo($file['name'], PATHINFO_FILENAME);
        $cleanBasename = preg_replace('/[^a-zA-Z0-9_-]/', '_', strtolower($originalBasename));
        $cleanBasename = substr($cleanBasename, 0, 40) ?: 'file';
        $filename = sprintf('%s_%s.%s', $cleanBasename, bin2hex(random_bytes(6)), $extension);

        $destination = $targetDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to save uploaded file.');
        }

        // 3-Layer Persistent Dual-Write (Public Disk + External persistent_storage/ + MySQL LONGBLOB)
        $relPath = $safeSubfolder . '/' . $filename;
        MediaStorage::save($relPath, $destination, $mime);

        return '/uploads/' . $relPath;
    }
}
