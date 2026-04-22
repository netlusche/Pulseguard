<?php
require_once 'config.php';
require_once 'mailer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

const JWT_SECRET = 'super_secret_pulseguard_key_2026';

function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyJWT($jwt) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;
    $signature = hash_hmac('sha256', $parts[0] . "." . $parts[1], JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    if (hash_equals($base64UrlSignature, $parts[2])) {
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        if (isset($payload['exp']) && $payload['exp'] < time()) return false;
        return $payload;
    }
    return false;
}

function getAuthUser() {
    $authHeader = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';
    }
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return verifyJWT($matches[1]);
    }
    return false;
}

$db = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

function getSetting($db, $key, $default = '0') {
    $stmt = $db->prepare("SELECT value FROM settings WHERE `key` = ?");
    $stmt->execute([$key]);
    $res = $stmt->fetchColumn();
    return $res !== false ? $res : $default;
}

function checkPasswordPolicy($password, $strict) {
    if ($strict == '1') {
        if (strlen($password) < 12) return false;
        if (!preg_match('/[A-Z]/', $password)) return false;
        if (!preg_match('/[a-z]/', $password)) return false;
        if (!preg_match('/[0-9]/', $password)) return false;
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) return false;
    }
    return true;
}

try {
    if ($action === 'login' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$input['email'] ?? '']);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($input['password'] ?? '', $user['password_hash'])) {
            if (isset($user['email_verified']) && $user['email_verified'] == 0) {
                http_response_code(403);
                echo json_encode(['error' => 'Please verify your email address before logging in.']);
                exit;
            }
            
            $twoFactorEnabled = getSetting($db, 'two_factor_enabled', '0');
            if ($twoFactorEnabled == '1') {
                $code = sprintf("%06d", mt_rand(1, 999999));
                $stmt = $db->prepare("UPDATE users SET two_factor_code = ? WHERE id = ?");
                $stmt->execute([$code, $user['id']]);
                sendMail($user['email'], "Your PulseGuard 2FA Code", "Your login code is: $code");
                echo json_encode(['require_2fa' => true, 'email' => $user['email']]);
                exit;
            }
            
            $payload = ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role'], 'exp' => time() + 86400 * 30];
            echo json_encode([
                'token' => generateJWT($payload),
                'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        exit;
    }

    if ($action === 'verify_2fa' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $code = $input['code'] ?? '';
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND two_factor_code = ?");
        $stmt->execute([$email, $code]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $stmt = $db->prepare("UPDATE users SET two_factor_code = NULL WHERE id = ?");
            $stmt->execute([$user['id']]);
            $payload = ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role'], 'exp' => time() + 86400 * 30];
            echo json_encode([
                'token' => generateJWT($payload),
                'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid 2FA code.']);
        }
        exit;
    }

    if ($action === 'register' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $strictPolicy = getSetting($db, 'strict_password_policy', '0');
        if (!checkPasswordPolicy($input['password'], $strictPolicy)) {
            http_response_code(400);
            echo json_encode(['error' => 'Password does not meet policy requirements (min 12 chars, uppercase, lowercase, number, special character).']);
            exit;
        }
        $hash = password_hash($input['password'], PASSWORD_DEFAULT);
        $token = bin2hex(random_bytes(16));
        $stmt = $db->prepare("INSERT INTO users (email, password_hash, role, email_verified, verification_token) VALUES (?, ?, 'user', 0, ?)");
        $stmt->execute([$input['email'], $hash, $token]);
        
        $basePath = dirname(dirname($_SERVER['PHP_SELF']));
        $basePath = $basePath === '/' ? '' : $basePath;
        $verifyLink = "http://" . $_SERVER['HTTP_HOST'] . $basePath . "/index.html?action=verify&token=" . $token;
        
        sendMail($input['email'], "Verify your PulseGuard Account", "Click here to verify: $verifyLink");
        echo json_encode(['success' => true]);
        exit;
    }

    if ($action === 'verify' && $method === 'GET') {
        $token = $_GET['token'] ?? '';
        $stmt = $db->prepare("UPDATE users SET email_verified = 1, verification_token = NULL WHERE verification_token = ?");
        $stmt->execute([$token]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Email verified successfully.']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or expired token.']);
        }
        exit;
    }

    $user = getAuthUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if ($action === 'profile' && $method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $currentPassword = $input['currentPassword'] ?? '';
        $newEmail = $input['newEmail'] ?? '';
        $newPassword = $input['newPassword'] ?? '';

        $stmt = $db->prepare("SELECT password_hash, email FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $dbUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$dbUser || !password_verify($currentPassword, $dbUser['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid current password']);
            exit;
        }

        $strictPolicy = getSetting($db, 'strict_password_policy', '0');
        if ($newPassword && !checkPasswordPolicy($newPassword, $strictPolicy)) {
            http_response_code(400);
            echo json_encode(['error' => 'New password does not meet policy requirements (min 12 chars, uppercase, lowercase, number, special character).']);
            exit;
        }

        $emailChanged = false;
        if ($newEmail && $newEmail !== $dbUser['email']) {
            $token = bin2hex(random_bytes(16));
            $stmt = $db->prepare("UPDATE users SET pending_email = ?, verification_token = ? WHERE id = ?");
            $stmt->execute([$newEmail, $token, $user['id']]);
            
            $basePath = dirname(dirname($_SERVER['PHP_SELF']));
            $basePath = $basePath === '/' ? '' : $basePath;
            $verifyLink = "http://" . $_SERVER['HTTP_HOST'] . $basePath . "/index.html?action=verify_change&token=" . $token;
            
            sendMail($newEmail, "Verify your new email", "Click here to verify: $verifyLink");
            $emailChanged = true;
        }

        if ($newPassword) {
            $hash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$hash, $user['id']]);
        }

        $payload = ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role'], 'exp' => time() + 86400 * 30];
        echo json_encode([
            'success' => true,
            'email_change_pending' => $emailChanged,
            'token' => generateJWT($payload),
            'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]
        ]);
        exit;
    }

    if ($action === 'verify_change' && $method === 'GET') {
        $token = $_GET['token'] ?? '';
        $stmt = $db->prepare("SELECT id, pending_email FROM users WHERE verification_token = ? AND pending_email IS NOT NULL");
        $stmt->execute([$token]);
        $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($targetUser) {
            $stmt = $db->prepare("UPDATE users SET email = ?, pending_email = NULL, verification_token = NULL WHERE id = ?");
            $stmt->execute([$targetUser['pending_email'], $targetUser['id']]);
            echo json_encode(['success' => true, 'message' => 'Email changed successfully.']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or expired token.']);
        }
        exit;
    }

    if ($action === 'settings' && $user['role'] === 'admin') {
        if ($method === 'GET') {
            $stmt = $db->query("SELECT `key`, value FROM settings");
            $settings = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $settings[$row['key']] = $row['value'];
            }
            echo json_encode($settings);
        } elseif ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("REPLACE INTO settings (`key`, value) VALUES (?, ?)");
            foreach ($input as $k => $v) {
                $stmt->execute([$k, (string)$v]);
            }
            echo json_encode(['success' => true]);
        }
        exit;
    }

    if ($action === 'users' && $user['role'] === 'admin') {
        if ($method === 'GET') {
            $stmt = $db->query("SELECT id, email, role, created_at FROM users");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method === 'DELETE') {
            $id = $_GET['id'] ?? null;
            if ($id != $user['id']) {
                $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$id]);
                // Delete associated measurements too
                $stmt = $db->prepare("DELETE FROM measurements WHERE userId = ?");
                $stmt->execute([$id]);
            }
            echo json_encode(['success' => true]);
        } elseif ($method === 'PATCH') {
            $id = $_GET['id'] ?? null;
            $input = json_decode(file_get_contents('php://input'), true);
            $newRole = $input['role'] ?? 'user';
            
            if ($id) {
                if ($id == $user['id'] && $newRole === 'user') {
                    $stmt = $db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
                    $adminCount = $stmt->fetchColumn();
                    if ($adminCount <= 1) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Cannot demote the only remaining admin.']);
                        exit;
                    }
                }
                
                $stmt = $db->prepare("UPDATE users SET role = ? WHERE id = ?");
                $stmt->execute([$newRole, $id]);
            }
            echo json_encode(['success' => true]);
        }
        exit;
    }

    // Measurements CRUD
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM measurements WHERE userId = ? ORDER BY timestamp DESC");
            $stmt->execute([$user['id']]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($results as &$row) {
                $row['id'] = (int)$row['id'];
                $row['sys'] = (int)$row['sys'];
                $row['dia'] = (int)$row['dia'];
                $row['pulse'] = (int)$row['pulse'];
            }
            echo json_encode($results);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO measurements (userId, sys, dia, pulse, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $user['id'],
                $input['sys'],
                $input['dia'],
                $input['pulse'],
                $input['notes'] ?? '',
                $input['timestamp']
            ]);
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            // Ensure the measurement belongs to the user
            $stmt = $db->prepare("DELETE FROM measurements WHERE id = ? AND userId = ?");
            $stmt->execute([$id, $user['id']]);
            echo json_encode(['success' => true]);
            break;

        default:
            throw new Exception('Method not supported');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
