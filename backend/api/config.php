<?php
// Shared configuration & helpers for the College of Physiotherapy API.
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function read_json($file) {
    if (!file_exists($file)) respond(['error' => 'Data file not found'], 404);
    $data = json_decode(file_get_contents($file), true);
    if ($data === null) respond(['error' => 'Invalid data file'], 500);
    return $data;
}
