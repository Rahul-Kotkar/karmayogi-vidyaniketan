<?php
use App\Helpers\MediaStorage;

if (!function_exists('asset')) {
    /**
     * Helper to resolve asset URLs with self-healing media recovery.
     * If an upload does not exist on disk, it automatically restores it from
     * persistent storage or the MySQL database before returning the URL.
     */
    function asset(string $path): string {
        $clean = ltrim($path, '/');

        // Check if this is an uploaded media item
        if (str_starts_with($clean, 'uploads/')) {
            $rel = substr($clean, 8);
            $publicPath = MediaStorage::getPublicUploadsDir() . '/' . $rel;

            if (!file_exists($publicPath) || filesize($publicPath) === 0) {
                MediaStorage::restore($rel);
            }
            return '/' . $clean;
        }

        return '/' . $clean;
    }
}
