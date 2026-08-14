<?php
header('Content-Type: application/json; charset=utf-8');

// Permitir apenas requisições POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Obter dados do corpo da requisição
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name     = trim($input['name'] ?? '');
$email    = trim($input['email'] ?? '');
$phone    = trim($input['phone'] ?? '');
$type     = trim($input['type'] ?? '');
$interest = trim($input['interest'] ?? '');
$message  = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios ausentes']);
    exit;
}

// Configurações SMTP Hostinger da caixa oficial
$smtpHost = 'ssl://smtp.hostinger.com';
$smtpPort = 465;
$smtpUser = 'aistravelmarrocos@aistravelmarrocos.com.br';
$smtpPass = 'vaso3238@';
$toEmail  = 'aistravelmarrocos@aistravelmarrocos.com.br';

$subject = "Nova Cotação do Site: $name";

$body = "
===============================================
  NOVA SOLICITAÇÃO DE COTAÇÃO - AIS TRAVEL MARROCOS
===============================================

Nome: $name
E-mail: $email
WhatsApp / Telefone: $phone
Perfil: $type
Interesse: $interest

Mensagem:
$message

===============================================
Enviado pelo formulário do site oficial.
";

// Função de envio via SMTP Socket SSL Nativo
function sendHostingerSmtp($host, $port, $user, $pass, $from, $to, $subject, $body, $replyTo) {
    $socket = @fsockopen($host, $port, $errno, $errstr, 15);
    if (!$socket) return false;

    $read = function() use ($socket) {
        $res = '';
        while ($str = @fgets($socket, 515)) {
            $res .= $str;
            if (substr($str, 3, 1) == ' ') break;
        }
        return $res;
    };

    $read();
    fwrite($socket, "EHLO hostinger.com\r\n"); $read();
    fwrite($socket, "AUTH LOGIN\r\n"); $read();
    fwrite($socket, base64_encode($user) . "\r\n"); $read();
    fwrite($socket, base64_encode($pass) . "\r\n"); $read();
    fwrite($socket, "MAIL FROM: <$from>\r\n"); $read();
    fwrite($socket, "RCPT TO: <$to>\r\n"); $read();
    fwrite($socket, "DATA\r\n"); $read();

    $headers  = "From: AIS Travel Marrocos <$from>\r\n";
    $headers .= "Reply-To: $replyTo\r\n";
    $headers .= "To: <$to>\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";

    fwrite($socket, $headers . $body . "\r\n.\r\n"); $read();
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
    return true;
}

$sent = sendHostingerSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpUser, $toEmail, $subject, $body, $email);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'E-mail enviado com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Falha no envio via SMTP']);
}
