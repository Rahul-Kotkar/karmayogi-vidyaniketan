<?php
// ========================================================
// Karmayogi Vidyaniketan / Karmayogi Public School - Central Front Controller
// Shri Pandurang Pratishthan, Pandharpur
// Hostinger Shared Hosting & Apache Production Entry Point
// ========================================================

@clearstatcache();
if (function_exists('opcache_reset')) {
    @opcache_reset();
}

// 1. Autoload / include core components
require_once __DIR__ . '/../app/Config/Env.php';
require_once __DIR__ . '/../app/Config/Database.php';
require_once __DIR__ . '/../app/Helpers/MediaStorage.php';
require_once __DIR__ . '/../app/Helpers/functions.php';
require_once __DIR__ . '/../app/Controllers/MigrationsController.php';

// 2. Load environment variables from root .env
\App\Config\Env::load(__DIR__ . '/../.env');

// 3. Auto-heal / restore media files missing on disk from database LONGBLOB / persistent backup
\App\Helpers\MediaStorage::syncAllToDisk();

// 4. Parse incoming request URI
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedUrl = parse_url($requestUri);
$path = trim($parsedUrl['path'] ?? '/', '/');
$path = preg_replace('#^public/#i', '', $path);


// --------------------------------------------------------
// ROUTE: /uploads/* (Self-Healing on request)
// --------------------------------------------------------
if (str_starts_with($path, 'uploads/')) {
    $relPath = substr($path, 8);
    $diskPath = __DIR__ . '/uploads/' . $relPath;

    if (!file_exists($diskPath) || filesize($diskPath) === 0) {
        $backendPath = __DIR__ . '/../backend/uploads/' . $relPath;
        if (file_exists($backendPath) && filesize($backendPath) > 0) {
            $destDir = dirname($diskPath);
            if (!is_dir($destDir)) {
                @mkdir($destDir, 0755, true);
            }
            @copy($backendPath, $diskPath);
        } else {
            \App\Helpers\MediaStorage::restore($relPath);
        }
    }

    if (file_exists($diskPath) && filesize($diskPath) > 0) {
        $mime = 'application/octet-stream';
        $ext = strtolower(pathinfo($diskPath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'webp' => 'image/webp',
            'gif'  => 'image/gif',
            'pdf'  => 'application/pdf',
            'svg'  => 'image/svg+xml'
        ];
        if (isset($mimeTypes[$ext])) {
            $mime = $mimeTypes[$ext];
        } elseif (function_exists('mime_content_type')) {
            $mime = @mime_content_type($diskPath) ?: 'application/octet-stream';
        }

        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($diskPath));
        header('Cache-Control: public, max-age=86400');
        readfile($diskPath);
        exit;
    }

    http_response_code(404);
    echo "404 - File Not Found";
    exit;
}

// --------------------------------------------------------
// ROUTE: /api/* or /backend/api/* (REST API router)
// --------------------------------------------------------
if (str_starts_with($path, 'api') || str_starts_with($path, 'backend/api')) {
    require_once __DIR__ . '/../backend/api/index.php';
    exit;
}

// --------------------------------------------------------
// ROUTE: React SPA Front Controller Fallback
// --------------------------------------------------------
$spaHtmlFile = __DIR__ . '/index.html';
if (file_exists($spaHtmlFile)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($spaHtmlFile);
    exit;
}

// Fallback message if build has not been generated
http_response_code(200);
echo "<!DOCTYPE html><html><head><title>Karmayogi Vidyaniketan | Karmayogi Public School</title></head><body>";
echo "<h1>Karmayogi Vidyaniketan / Karmayogi Public School</h1>";
echo "<p>System is online. Production build is being configured.</p>";
echo "<p><a href='/admin/migrations'>Open Database Migrations &amp; Git Sync &rarr;</a></p>";
echo "</body></html>";
