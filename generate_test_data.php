<?php
require_once __DIR__ . '/api/config.php';

$pdo = getDbConnection();

$users = [
    [
        'email' => 'green@pulseguard.de',
        'sysBase' => 118,
        'diaBase' => 75,
        'variance' => 5,
        'trend' => false
    ],
    [
        'email' => 'yellow@pulseguard.de',
        'sysBase' => 134,
        'diaBase' => 87,
        'variance' => 4,
        'trend' => false
    ],
    [
        'email' => 'red@pulseguard.de',
        'sysBase' => 145,
        'diaBase' => 92,
        'variance' => 5,
        'trend' => false
    ],
    [
        'email' => 'trend@pulseguard.de',
        'sysBase' => 120,
        'diaBase' => 80,
        'variance' => 5,
        'trend' => true
    ]
];

$password = password_hash('test1234', PASSWORD_DEFAULT);

foreach ($users as $u) {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$u['email']]);
    $userId = $stmt->fetchColumn();

    if (!$userId) {
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role, email_verified) VALUES (?, ?, 'user', 1)");
        $stmt->execute([$u['email'], $password]);
        $userId = $pdo->lastInsertId();
    } else {
        // Delete old measurements for clean slate
        $stmt = $pdo->prepare("DELETE FROM measurements WHERE userId = ?");
        $stmt->execute([$userId]);
    }

    // Generate 12 months of data (roughly every 3 days)
    $startDate = new DateTime('-12 months');
    $endDate = new DateTime('now');
    
    // For trend user, stop normal generation 7 days ago
    $normalEndDate = $u['trend'] ? new DateTime('-7 days') : $endDate;

    $currentDate = clone $startDate;
    while ($currentDate <= $normalEndDate) {
        $sys = $u['sysBase'] + rand(-$u['variance'], $u['variance']);
        $dia = $u['diaBase'] + rand(-$u['variance'], $u['variance']);
        $pulse = rand(60, 80);

        $stmt = $pdo->prepare("INSERT INTO measurements (userId, sys, dia, pulse, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $sys, $dia, $pulse, "", $currentDate->format('Y-m-d\TH:i:s')]);

        $currentDate->modify('+'.rand(2, 4).' days');
        // randomize hours
        $currentDate->setTime(rand(7, 22), rand(0, 59));
    }

    if ($u['trend']) {
        // Add the trend spikes
        $spikes = [
            ['-6 days', 130, 85],
            ['-4 days', 145, 90],
            ['-2 days', 150, 95],
            ['-1 days', 165, 100]
        ];
        foreach ($spikes as $spike) {
            $dt = new DateTime($spike[0]);
            $stmt = $pdo->prepare("INSERT INTO measurements (userId, sys, dia, pulse, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $spike[1], $spike[2], rand(70, 95), "Spike notes", $dt->format('Y-m-d\TH:i:s')]);
        }
    }

    echo "Generated data for {$u['email']}\n";
}
echo "Done.\n";
