<?php
// GET /api/notices.php         -> all notices, newest first
// GET /api/notices.php?id=3    -> single notice
require __DIR__ . '/config.php';

$notices = read_json(__DIR__ . '/../data/notices.json');
usort($notices, fn($a, $b) => strcmp($b['date'], $a['date']));

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    foreach ($notices as $n) {
        if ((int) $n['id'] === $id) respond($n);
    }
    respond(['error' => 'Notice not found'], 404);
}
respond($notices);
