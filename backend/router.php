<?php
// ========================================================
// College of Physiotherapy - Built-in Server Router
// Handles routing for: php -S localhost:8000 router.php
// ========================================================

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve existing files (e.g. uploads, static assets)
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}

// Rewrite all API requests to api/index.php
require __DIR__ . '/api/index.php';
