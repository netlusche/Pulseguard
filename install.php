<?php
/**
 * PulseGuard Installation Script
 * Run this script via browser or CLI to set up the initial database and users.
 */

if (php_sapi_name() !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}

require_once __DIR__ . '/api/config.php';

// getDbConnection() from config.php connects to the DB.
// (For SQLite it also creates tables automatically, but for MariaDB we need to do it here).
$pdo = getDbConnection();

echo "======================================\n";
echo "       PulseGuard Installation\n";
echo "======================================\n\n";

// 0. Create Database Structure (Cross-compatible for SQLite and MariaDB)
$autoInc = (DB_TYPE === 'sqlite') ? 'AUTOINCREMENT' : 'AUTO_INCREMENT';
$varchar = (DB_TYPE === 'sqlite') ? 'TEXT' : 'VARCHAR(255)';

$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY $autoInc,
    email $varchar UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    `role` $varchar NOT NULL DEFAULT 'user',
    email_verified INTEGER DEFAULT 0,
    verification_token $varchar,
    pending_email $varchar,
    two_factor_code $varchar,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Migrations (Catch errors if columns already exist in old DBs)
try { $pdo->exec("ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE users ADD COLUMN verification_token $varchar"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE users ADD COLUMN pending_email $varchar"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE users ADD COLUMN two_factor_code $varchar"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"); } catch (PDOException $e) {}

$pdo->exec("CREATE TABLE IF NOT EXISTS settings (
    `key` $varchar PRIMARY KEY,
    value TEXT NOT NULL
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY $autoInc,
    userId $varchar NOT NULL,
    sys INTEGER NOT NULL,
    dia INTEGER NOT NULL,
    pulse INTEGER NOT NULL,
    notes TEXT,
    timestamp DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Default Settings if not exist
$insertIgnore = (DB_TYPE === 'sqlite') ? 'INSERT OR IGNORE' : 'INSERT IGNORE';
$pdo->exec("$insertIgnore INTO settings (`key`, value) VALUES ('strict_password_policy', '0')");
$pdo->exec("$insertIgnore INTO settings (`key`, value) VALUES ('two_factor_enabled', '0')");

echo "[OK] Database structure created/verified.\n";

// 1. Disable strict password policy and 2FA
$pdo->exec("UPDATE settings SET value = '0' WHERE `key` = 'strict_password_policy'");
$pdo->exec("UPDATE settings SET value = '0' WHERE `key` = 'two_factor_enabled'");
echo "[OK] Strict password policy and 2FA disabled for installation.\n";

// 2. Create Admin User
$adminEmail = 'admin@user.local';
$adminPass = 'admin';
$adminHash = password_hash($adminPass, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$adminEmail]);
$adminExists = $stmt->fetchColumn();

if (!$adminExists) {
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, `role`, email_verified) VALUES (?, ?, 'admin', 1)");
    $stmt->execute([$adminEmail, $adminHash]);
    echo "[OK] Admin user created: $adminEmail\n";
} else {
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->execute([$adminHash, $adminEmail]);
    echo "[OK] Admin user updated: $adminEmail\n";
}

// 3. Create Test User and 3 Months of Data
$testEmail = 'test@user.local';
$testPass = 'password';
$testHash = password_hash($testPass, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$testEmail]);
$testId = $stmt->fetchColumn();

if (!$testId) {
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, `role`, email_verified) VALUES (?, ?, 'user', 1)");
    $stmt->execute([$testEmail, $testHash]);
    $testId = $pdo->lastInsertId();
    echo "[OK] Test user created: $testEmail\n";
} else {
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->execute([$testHash, $testEmail]);
    // Clear old data
    $stmt = $pdo->prepare("DELETE FROM measurements WHERE userId = ?");
    $stmt->execute([$testId]);
    echo "[OK] Test user updated and old data cleared: $testEmail\n";
}

// Generate 3 months of test data
$startDate = new DateTime('-3 months');
$endDate = new DateTime('now');

$currentDate = clone $startDate;
$dataCount = 0;
while ($currentDate <= $endDate) {
    $sys = 125 + rand(-10, 15);
    $dia = 80 + rand(-5, 10);
    $pulse = rand(60, 85);

    $stmt = $pdo->prepare("INSERT INTO measurements (userId, sys, dia, pulse, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$testId, $sys, $dia, $pulse, "", $currentDate->format('Y-m-d\TH:i:s')]);
    
    $dataCount++;
    $currentDate->modify('+'.rand(1, 3).' days');
    $currentDate->setTime(rand(7, 22), rand(0, 59));
}
echo "[OK] Generated $dataCount sample measurements for test user.\n\n";

// 4. Output Warnings
echo "======================================\n";
echo "   ⚠️ IMPORTANT SECURITY WARNING ⚠️\n";
echo "======================================\n";
echo "1. Please log in immediately with the admin account (admin@user.local) \n";
echo "   and CHANGE the email address and password to valid, secure credentials!\n";
echo "2. It is STRONGLY RECOMMENDED to enable the 'Strict Password Policy' \n";
echo "   and 'Two-Factor Authentication (2FA)' in the Admin Dashboard \n";
echo "   after the initial setup to ensure data privacy.\n";
echo "3. You MUST delete this 'install.php' file immediately after setup to \n";
echo "   prevent unauthorized access and resetting of the system!\n\n";

echo "Installation complete. You can now log in at the homepage.\n";
