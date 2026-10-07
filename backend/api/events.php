<?php
// GET /api/events.php         -> all events, soonest first
// GET /api/events.php?id=2    -> single event
require __DIR__ . '/config.php';

$events = read_json(__DIR__ . '/../data/events.json');
usort($events, fn($a, $b) => strcmp($a['date'], $b['date']));

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    foreach ($events as $e) {
        if ((int) $e['id'] === $id) respond($e);
    }
    respond(['error' => 'Event not found'], 404);
}
respond($events);
