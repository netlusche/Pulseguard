<?php
/**
 * PulseGuard Development Mailer
 * Simulates sending emails by writing them to a local log file.
 */

function sendMail($to, $subject, $body) {
    // 1. Write to Log if enabled
    if (defined('ENABLE_MAIL_LOG') && ENABLE_MAIL_LOG) {
        $logFile = __DIR__ . '/mail.log';
        $timestamp = date('Y-m-d H:i:s');
        
        $logEntry = "=================================================\n";
        $logEntry .= "Date: $timestamp\n";
        $logEntry .= "To: $to\n";
        $logEntry .= "Subject: $subject\n";
        $logEntry .= "-------------------------------------------------\n";
        $logEntry .= "$body\n";
        $logEntry .= "=================================================\n\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
    
    // 2. Send real email via PHP mail() if enabled
    if (defined('ENABLE_REAL_MAIL') && ENABLE_REAL_MAIL) {
        $from = defined('MAIL_FROM') ? MAIL_FROM : 'no-reply@localhost';
        $headers = "From: " . $from . "\r\n" .
                   "Reply-To: " . $from . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
                   
        // Suppress warnings in case mail server is not configured correctly on the host
        @mail($to, $subject, $body, $headers);
    }
    
    return true;
}
