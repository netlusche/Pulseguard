<?php
require_once 'config.php';

$db = getDbConnection();

// Clear existing data for a clean test
$db->exec("DELETE FROM measurements");

$startDate = new DateTime('2025-11-15');
$endDate = new DateTime('now');
$interval = new DateInterval('P1D'); // Every day
$period = new DatePeriod($startDate, $interval, $endDate);

$userId = 'default-user';
$notes = [
    "Morgens nach dem Aufstehen",
    "Nach der Arbeit",
    "Vor dem Schlafen",
    "Nach dem Sport",
    "Stressiger Tag im Büro",
    "Wochenende, entspannt",
    "Kopfschmerzen",
    "Wetterumschwung"
];

echo "Generating test data...\n";

foreach ($period as $date) {
    // Generate 1-2 measurements per day
    $measurementsPerDay = rand(1, 2);
    
    for ($i = 0; $i < $measurementsPerDay; $i++) {
        $timestamp = clone $date;
        $hour = ($i === 0) ? rand(7, 9) : rand(18, 21);
        $timestamp->setTime($hour, rand(0, 59));

        // Logic for "Phasenweise hoher Blutdruck"
        $isHighPhase = false;
        $month = (int)$timestamp->format('m');
        $day = (int)$timestamp->format('d');
        
        // High phases: Dec 2025, early Feb 2026, mid April 2026
        if (($month == 12) || ($month == 2 && $day < 15) || ($month == 4 && $day > 10)) {
            $isHighPhase = true;
        }

        if ($isHighPhase) {
            $sys = rand(145, 165);
            $dia = rand(95, 105);
            $pulse = rand(75, 90);
            $note = "Werte erhöht! " . $notes[array_rand($notes)];
        } else {
            $sys = rand(115, 128);
            $dia = rand(75, 84);
            $pulse = rand(60, 72);
            $note = $notes[array_rand($notes)];
        }

        $stmt = $db->prepare("INSERT INTO measurements (userId, sys, dia, pulse, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId,
            $sys,
            $dia,
            $pulse,
            $note,
            $timestamp->format('Y-m-d H:i:s')
        ]);
    }
}

echo "Success! Database seeded from 2025-11-15 to today.\n";
