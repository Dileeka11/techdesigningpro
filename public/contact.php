<?php
/**
 * TechDesigningPro – contact form handler for shared hosting.
 * Receives the "Get in Touch!" form and emails it with PHP mail().
 * Replies as JSON for the JS form, or redirects back for a plain POST.
 */

// ---- Settings -------------------------------------------------------------
$TO         = 'info@techdesigningpro.com';
// Use an address on your own domain so the mail isn't flagged as spoofed.
$FROM       = 'no-reply@techdesigningpro.com';
$SUBJECT    = 'Website enquiry – TechDesigningPro';
$RETURN_URL = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/contact-us/';
// ---------------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');
$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function respond($ok, $wantsJson, $returnUrl, $code = 200)
{
    if ($wantsJson) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('ok' => $ok));
    } else {
        header('Location: ' . $returnUrl . '?sent=' . ($ok ? '1' : '0') . '#contact-form', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . $RETURN_URL, true, 302);
    exit;
}

// Honeypot: bots fill every field, people never see this one.
if (!empty($_POST['website'])) {
    respond(true, $wantsJson, $RETURN_URL);
}

function clean($value, $max)
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    return mb_substr($value, 0, $max, 'UTF-8');
}
function oneLine($value)
{
    // Prevents e-mail header injection.
    return str_replace(array("\r", "\n", '%0a', '%0d'), ' ', $value);
}

$name    = oneLine(clean($_POST['pname'] ?? '', 120));
$phone   = oneLine(clean($_POST['pcell'] ?? '', 40));
$email   = oneLine(clean($_POST['pemail'] ?? '', 160));
$message = clean($_POST['message'] ?? '', 5000);

if ($name === '' || $phone === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, $wantsJson, $RETURN_URL, 422);
}

$body = "Full Name: {$name}\n"
      . "Phone Number: {$phone}\n"
      . "Email address: {$email}\n\n"
      . "Message:\n{$message}\n\n"
      . "--\nSent from " . ($_SERVER['HTTP_HOST'] ?? 'website') . ' on ' . date('Y-m-d H:i') . "\n";

$headers = array(
    'From: TechDesigningPro Website <' . $FROM . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
);

$subject = '=?UTF-8?B?' . base64_encode($SUBJECT) . '?=';
$sent = @mail($TO, $subject, $body, implode("\r\n", $headers), '-f' . $FROM);

respond((bool) $sent, $wantsJson, $RETURN_URL, $sent ? 200 : 500);
