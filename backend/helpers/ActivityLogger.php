<?php
// ========================================================
// College of Physiotherapy - User Activity & Audit Logger
// Records Admin logins, IP addresses, timestamps & data mutations
// ========================================================

require_once __DIR__ . '/../config/database.php';

class ActivityLogger {
    private static ?bool $tableChecked = null;

    /**
     * Resolves the client's public IP address securely through reverse proxies / CDNs
     */
    public static function getClientIp(): string {
        $headers = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_CLIENT_IP',
            'HTTP_X_REAL_IP',
            'REMOTE_ADDR'
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return substr($ip, 0, 45);
                }
            }
        }
        return substr($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', 0, 45);
    }

    /**
     * Returns sanitized user agent
     */
    public static function getUserAgent(): string {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown Client';
        return substr(trim($ua), 0, 255);
    }

    /**
     * Checks if a user is the root developer admin (supervisor) whose logs should be excluded
     */
    public static function isDevAdminUser(?array $user): bool {
        if (!$user) return false;
        $userId = !empty($user['id']) ? (int)$user['id'] : (!empty($user['sub']) ? (int)$user['sub'] : null);
        $userEmail = strtolower($user['email'] ?? '');
        $userRole = strtolower($user['role'] ?? '');
        return ($userId === 1 || $userEmail === 'devkarma' || str_contains($userEmail, 'devkarma') || in_array($userRole, ['superadmin', 'devadmin', 'developer']));
    }

    /**
     * Records an activity or audit log entry (created users only)
     *
     * @param array|null $user Authenticated user details (id/sub, name, email, role)
     * @param string $action 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE'
     * @param string $resource Target resource ('auth', 'notices', 'events', 'faculty', 'users', etc.)
     * @param string|int|null $resourceId Target record ID
     * @param string $description Human-readable summary of the action
     * @param mixed $details Optional details or data payload
     * @return bool
     */
    public static function log(
        ?array $user,
        string $action,
        string $resource,
        $resourceId = null,
        string $description = '',
        $details = null
    ): bool {
        // Exclude root/developer admin from logging (only supervise created users)
        if (self::isDevAdminUser($user)) {
            return false;
        }

        $userId = !empty($user['id']) ? (int)$user['id'] : (!empty($user['sub']) ? (int)$user['sub'] : null);
        $userName = !empty($user['name']) ? substr($user['name'], 0, 150) : 'Administrator';
        $userEmail = !empty($user['email']) ? substr($user['email'], 0, 191) : 'admin';
        $userRole = !empty($user['role']) ? substr($user['role'], 0, 50) : 'admin';

        $action = strtoupper(trim($action));
        $resource = strtolower(trim($resource));
        $resourceId = $resourceId !== null ? (string)$resourceId : null;
        $ip = self::getClientIp();
        $ua = self::getUserAgent();

        // Sanitize details payload (strip sensitive keys like passwords or auth tokens)
        $detailsJson = null;
        if ($details !== null) {
            if (is_array($details)) {
                $cleaned = self::sanitizePayload($details);
                $detailsJson = json_encode($cleaned, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } elseif (is_string($details)) {
                $detailsJson = $details;
            } else {
                $detailsJson = json_encode($details);
            }
            if ($detailsJson && strlen($detailsJson) > 65000) {
                $detailsJson = substr($detailsJson, 0, 65000) . '...[truncated]';
            }
        }

        $logRecord = [
            'user_id'     => $userId,
            'user_name'   => $userName,
            'user_email'  => $userEmail,
            'user_role'   => $userRole,
            'action'      => $action,
            'resource'    => $resource,
            'resource_id' => $resourceId,
            'description' => $description,
            'details'     => $detailsJson,
            'ip_address'  => $ip,
            'user_agent'  => $ua,
            'created_at'  => date('Y-m-d H:i:s')
        ];

        // 1. Write to MySQL Database
        $savedToDb = false;
        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $stmt = $db->prepare("
                INSERT INTO activity_logs (
                    user_id, user_name, user_email, user_role,
                    action, resource, resource_id, description,
                    details, ip_address, user_agent, created_at
                ) VALUES (
                    :uid, :uname, :uemail, :urole,
                    :action, :resource, :resid, :desc,
                    :details, :ip, :ua, NOW()
                )
            ");
            $savedToDb = $stmt->execute([
                ':uid'      => $userId,
                ':uname'    => $userName,
                ':uemail'   => $userEmail,
                ':urole'    => $userRole,
                ':action'   => $action,
                ':resource' => $resource,
                ':resid'    => $resourceId,
                ':desc'     => $description,
                ':details'  => $detailsJson,
                ':ip'       => $ip,
                ':ua'       => $ua
            ]);
        } catch (Exception $e) {
            error_log("ActivityLogger DB error: " . $e->getMessage());
        }

        // 2. Dual-Write to Persistent JSON Backup (for offline resilience and shared hosting safety)
        self::writeToJsonBackup($logRecord);

        return $savedToDb;
    }

    /**
     * Strips passwords, hashes, and auth tokens from payload
     */
    private static function sanitizePayload(array $data): array {
        $sensitiveKeys = ['password', 'password_hash', 'current_password', 'new_password', 'token', 'secret'];
        $clean = [];
        foreach ($data as $k => $v) {
            $kLower = strtolower($k);
            if (in_array($kLower, $sensitiveKeys) || str_contains($kLower, 'password')) {
                $clean[$k] = '[HIDDEN]';
            } elseif (is_array($v)) {
                $clean[$k] = self::sanitizePayload($v);
            } else {
                $clean[$k] = $v;
            }
        }
        return $clean;
    }

    /**
     * Appends to fallback JSON log file
     */
    private static function writeToJsonBackup(array $logRecord): void {
        try {
            $storageDir = dirname(__DIR__, 2) . '/persistent_storage';
            if (!is_dir($storageDir)) {
                @mkdir($storageDir, 0755, true);
            }
            $logFile = $storageDir . '/activity_logs.json';

            $logs = [];
            if (file_exists($logFile)) {
                $raw = @file_get_contents($logFile);
                if ($raw) {
                    $logs = json_decode($raw, true) ?: [];
                }
            }

            // Prepend newest entry and retain last 1000 records
            array_unshift($logs, $logRecord);
            if (count($logs) > 1000) {
                $logs = array_slice($logs, 0, 1000);
            }

            @file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } catch (Exception $e) {
            // Silently ignore fallback write error
        }
    }

    /**
     * Ensures activity_logs table exists in MySQL
     */
    private static function ensureTableExists(PDO $db): void {
        if (self::$tableChecked) return;

        $sql = "CREATE TABLE IF NOT EXISTS `activity_logs` (
            `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT UNSIGNED NULL,
            `user_name` VARCHAR(150) NOT NULL,
            `user_email` VARCHAR(191) NOT NULL,
            `user_role` VARCHAR(50) NOT NULL DEFAULT 'admin',
            `action` VARCHAR(50) NOT NULL,
            `resource` VARCHAR(100) NOT NULL,
            `resource_id` VARCHAR(100) NULL,
            `description` TEXT NOT NULL,
            `details` LONGTEXT NULL,
            `ip_address` VARCHAR(45) NOT NULL,
            `user_agent` TEXT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_act_user_id` (`user_id`),
            INDEX `idx_act_user_email` (`user_email`),
            INDEX `idx_act_action` (`action`),
            INDEX `idx_act_resource` (`resource`),
            INDEX `idx_act_created_at` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        $db->exec($sql);
        // Clean out any historical devkarma logs so only created users remain
        try {
            $db->exec("DELETE FROM activity_logs WHERE user_email LIKE '%devkarma%' OR user_id = 1 OR user_role IN ('superadmin', 'devadmin', 'developer')");
        } catch (Exception $eClean) {}
        self::$tableChecked = true;
    }

    /**
     * Retrieves filtered and paginated activity logs (Created Users Only)
     */
    public static function getLogs(array $filters = []): array {
        $userId = !empty($filters['user_id']) ? (int)$filters['user_id'] : null;
        $userEmail = !empty($filters['user_email']) ? trim($filters['user_email']) : null;
        $action = !empty($filters['action']) ? strtoupper(trim($filters['action'])) : null;
        $resource = !empty($filters['resource']) ? strtolower(trim($filters['resource'])) : null;
        $search = !empty($filters['search']) ? trim($filters['search']) : null;
        $fromDate = !empty($filters['from_date']) ? trim($filters['from_date']) : null;
        $toDate = !empty($filters['to_date']) ? trim($filters['to_date']) : null;

        $page = max(1, (int)($filters['page'] ?? 1));
        $limit = min(200, max(1, (int)($filters['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $where = [
                "(user_email NOT LIKE '%devkarma%' AND (user_id != 1 OR user_id IS NULL) AND user_role NOT IN ('superadmin', 'devadmin', 'developer'))"
            ];
            $params = [];

            if ($userId) {
                $where[] = "user_id = :uid";
                $params[':uid'] = $userId;
            }

            if ($userEmail) {
                $where[] = "user_email = :uemail";
                $params[':uemail'] = $userEmail;
            }

            if ($action) {
                if ($action === 'CHANGES') {
                    $where[] = "action IN ('CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE')";
                } else {
                    $where[] = "action = :act";
                    $params[':act'] = $action;
                }
            }

            if ($resource) {
                $where[] = "resource = :res";
                $params[':res'] = $resource;
            }

            if ($search) {
                $where[] = "(user_name LIKE :s1 OR user_email LIKE :s2 OR ip_address LIKE :s3 OR description LIKE :s4)";
                $searchWildcard = "%{$search}%";
                $params[':s1'] = $searchWildcard;
                $params[':s2'] = $searchWildcard;
                $params[':s3'] = $searchWildcard;
                $params[':s4'] = $searchWildcard;
            }

            if ($fromDate) {
                $where[] = "created_at >= :fdate";
                $params[':fdate'] = $fromDate . ' 00:00:00';
            }

            if ($toDate) {
                $where[] = "created_at <= :tdate";
                $params[':tdate'] = $toDate . ' 23:59:59';
            }

            $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            // Total count
            $countStmt = $db->prepare("SELECT COUNT(*) FROM activity_logs {$whereSql}");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Fetch records
            $sql = "SELECT id, user_id, user_name, user_email, user_role, action, resource, resource_id, description, details, ip_address, user_agent, created_at
                    FROM activity_logs {$whereSql}
                    ORDER BY id DESC
                    LIMIT {$limit} OFFSET {$offset}";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $logs = $stmt->fetchAll();

            return [
                'logs'        => $logs,
                'total'       => $total,
                'page'        => $page,
                'limit'       => $limit,
                'total_pages' => ceil($total / $limit) ?: 1
            ];
        } catch (Exception $e) {
            // Fallback to JSON backup
            return self::getLogsFromJsonBackup($filters, $page, $limit);
        }
    }

    /**
     * Fallback parser for JSON logs
     */
    private static function getLogsFromJsonBackup(array $filters, int $page, int $limit): array {
        $logFile = dirname(__DIR__, 2) . '/persistent_storage/activity_logs.json';
        if (!file_exists($logFile)) {
            return ['logs' => [], 'total' => 0, 'page' => 1, 'limit' => $limit, 'total_pages' => 1];
        }

        $all = json_decode(file_get_contents($logFile), true) ?: [];
        $userId = !empty($filters['user_id']) ? (int)$filters['user_id'] : null;
        $userEmail = !empty($filters['user_email']) ? strtolower(trim($filters['user_email'])) : null;
        $action = !empty($filters['action']) ? strtoupper(trim($filters['action'])) : null;
        $resource = !empty($filters['resource']) ? strtolower(trim($filters['resource'])) : null;
        $search = !empty($filters['search']) ? strtolower(trim($filters['search'])) : null;

        $filtered = array_filter($all, function($item) use ($userId, $userEmail, $action, $resource, $search) {
            $itemEmail = strtolower($item['user_email'] ?? '');
            $itemRole = strtolower($item['user_role'] ?? '');
            $itemId = (int)($item['user_id'] ?? 0);
            if ($itemEmail === 'devkarma' || str_contains($itemEmail, 'devkarma') || $itemId === 1 || in_array($itemRole, ['superadmin', 'devadmin', 'developer'])) {
                return false;
            }
            if ($userId && (int)($item['user_id'] ?? 0) !== $userId) return false;
            if ($userEmail && strtolower($item['user_email'] ?? '') !== $userEmail) return false;
            if ($action) {
                if ($action === 'CHANGES' && !in_array($item['action'] ?? '', ['CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE'])) return false;
                if ($action !== 'CHANGES' && ($item['action'] ?? '') !== $action) return false;
            }
            if ($resource && ($item['resource'] ?? '') !== $resource) return false;
            if ($search) {
                $text = strtolower(($item['user_name'] ?? '') . ' ' . ($item['user_email'] ?? '') . ' ' . ($item['ip_address'] ?? '') . ' ' . ($item['description'] ?? ''));
                if (!str_contains($text, $search)) return false;
            }
            return true;
        });

        $total = count($filtered);
        $offset = ($page - 1) * $limit;
        $slice = array_slice($filtered, $offset, $limit);

        return [
            'logs'        => array_values($slice),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'total_pages' => ceil($total / $limit) ?: 1
        ];
    }

    /**
     * Aggregated statistics for the audit logs dashboard (Created Users Only)
     */
    public static function getStats(): array {
        try {
            $db = Database::getConnection();
            self::ensureTableExists($db);

            $baseWhere = "WHERE (user_email NOT LIKE '%devkarma%' AND (user_id != 1 OR user_id IS NULL) AND user_role NOT IN ('superadmin', 'devadmin', 'developer'))";
            $total = (int)$db->query("SELECT COUNT(*) FROM activity_logs {$baseWhere}")->fetchColumn();
            $logins = (int)$db->query("SELECT COUNT(*) FROM activity_logs {$baseWhere} AND action = 'LOGIN'")->fetchColumn();
            $changes = (int)$db->query("SELECT COUNT(*) FROM activity_logs {$baseWhere} AND action IN ('CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE')")->fetchColumn();
            
            $todayLogins = (int)$db->query("SELECT COUNT(*) FROM activity_logs {$baseWhere} AND action = 'LOGIN' AND created_at >= CURDATE()")->fetchColumn();
            $todayChanges = (int)$db->query("SELECT COUNT(*) FROM activity_logs {$baseWhere} AND action != 'LOGIN' AND created_at >= CURDATE()")->fetchColumn();

            $uniqueUsers = (int)$db->query("SELECT COUNT(DISTINCT user_email) FROM activity_logs {$baseWhere} AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetchColumn();

            return [
                'total_logs'           => $total,
                'total_logins'         => $logins,
                'total_changes'        => $changes,
                'today_logins'         => $todayLogins,
                'today_changes'        => $todayChanges,
                'active_users_30d'     => $uniqueUsers
            ];
        } catch (Exception $e) {
            return [
                'total_logs'           => 0,
                'total_logins'         => 0,
                'total_changes'        => 0,
                'today_logins'         => 0,
                'today_changes'        => 0,
                'active_users_30d'     => 0
            ];
        }
    }
}

