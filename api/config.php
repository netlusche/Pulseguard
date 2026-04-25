<?php
/**
 * PulseGuard Database Configuration
 */

// DATABASE TYPE: 'sqlite' or 'mariadb'
define('DB_TYPE', 'mariadb'); 

// SQLite Configuration
define('DB_SQLITE_PATH', __DIR__ . '/../database.sqlite');

// MariaDB Configuration (Scaling)
define('DB_HOST', 'localhost');
define('DB_NAME', 'pulseguard');
define('DB_USER', 'frank');
define('DB_PASS', '');

// Mail Configuration
define('MAIL_FROM', 'no-reply@pulseguard.de');
define('ENABLE_MAIL_LOG', true); // Write emails to mail.log
define('ENABLE_REAL_MAIL', false); // Actually send emails via PHP mail()

function getDbConnection() {
    try {
        if (DB_TYPE === 'sqlite') {
            $pdo = new PDO('sqlite:' . DB_SQLITE_PATH);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Create tables if not exists
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                `role` TEXT NOT NULL DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");

            // Migrations for users table (catch errors if columns already exist)
            try { $pdo->exec("ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN verification_token TEXT"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN pending_email TEXT"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN two_factor_code TEXT"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN reset_token TEXT"); } catch (PDOException $e) {}
            try { $pdo->exec("ALTER TABLE users ADD COLUMN reset_expires DATETIME"); } catch (PDOException $e) {}

            $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )");
            
            // Default Settings
            $pdo->exec("INSERT OR IGNORE INTO settings (key, value) VALUES ('strict_password_policy', '0')");
            $pdo->exec("INSERT OR IGNORE INTO settings (key, value) VALUES ('two_factor_enabled', '0')");

            $pdo->exec("CREATE TABLE IF NOT EXISTS measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                sys INTEGER NOT NULL,
                dia INTEGER NOT NULL,
                pulse INTEGER NOT NULL,
                notes TEXT,
                timestamp DATETIME NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )");

            // Migration: Create test user
            $hash = password_hash('password', PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, `role`) SELECT 'test@pulseguard.de', ?, 'user' WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@pulseguard.de')");
            $stmt->execute([$hash]);

            // Migration: Create admin user
            $adminHash = password_hash('admin', PASSWORD_DEFAULT);
            $stmtAdmin = $pdo->prepare("INSERT INTO users (email, password_hash, `role`) SELECT 'admin@pulseguard.de', ?, 'admin' WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@pulseguard.de')");
            $stmtAdmin->execute([$adminHash]);
            
            // Migration: Set existing test users as verified
            $pdo->exec("UPDATE users SET email_verified = 1 WHERE email IN ('test@pulseguard.de', 'admin@pulseguard.de')");
            
            // Migration: Update existing measurements
            $pdo->exec("UPDATE measurements SET userId = (SELECT id FROM users WHERE email = 'test@pulseguard.de') WHERE userId = 'default-user'");
            return $pdo;
        } else {
            // MariaDB / MySQL
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        }
    } catch (PDOException $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit;
    }
}
