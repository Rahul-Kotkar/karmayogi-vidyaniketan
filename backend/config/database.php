<?php
// ========================================================
// College of Physiotherapy - Database Connection (PDO)
// Hostinger Shared Hosting & Local Development Compatible
// ========================================================

require_once __DIR__ . '/../../app/Config/Env.php';
require_once __DIR__ . '/../../app/Config/Database.php';

use App\Config\Database as AppDatabase;

class Database {
    public static function getConnection(): PDO {
        return AppDatabase::getConnection();
    }
}
