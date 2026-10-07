<?php
// ========================================================
// College of Physiotherapy - Central Configuration & CORS
// ========================================================

// Error reporting for production / dev
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Security Secret Key for Auth Token Signing (Change this for production)
define('APP_SECRET', 'cop_ahilyanagar_secure_jwt_token_secret_2026_salt_9981');
define('APP_NAME', 'College of Physiotherapy');

// Upload directories
define('UPLOAD_BASE_DIR', dirname(__DIR__, 2) . '/public/uploads');
define('UPLOAD_BASE_URL', '/uploads');

// CORS Headers - Allow requests from Vite dev server and production domain
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:8000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins) || empty($origin)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
} else {
    // In production on the same host, or allow wildcard for public API
    header("Access-Control-Allow-Origin: *");
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

// Intercept preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
