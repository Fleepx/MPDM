<?php
/**
 * Script PHP para enviar emails desde el formulario de contacto MPDM
 * Versión sin campo "servicio"
 * Archivo: send-email.php
 */

// Configuración de CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// ========== CONFIGURACIÓN ==========
$to = 'contacto@mpdm.cl'; // Email destino
$subject_prefix = 'Nuevo mensaje desde MPDM.cl';

// ========== OBTENER DATOS DEL FORMULARIO ==========
$data = json_decode(file_get_contents('php://input'), true);

// Si no viene en JSON, intentar con $_POST
if (empty($data)) {
    $data = $_POST;
}

// ========== VALIDAR DATOS REQUERIDOS ==========
if (empty($data['nombre']) || empty($data['email']) || empty($data['mensaje'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// ========== SANITIZAR DATOS ==========
$nombre = htmlspecialchars(strip_tags(trim($data['nombre'])));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$empresa = isset($data['empresa']) ? htmlspecialchars(strip_tags(trim($data['empresa']))) : 'No especificada';
$telefono = isset($data['telefono']) ? htmlspecialchars(strip_tags(trim($data['telefono']))) : 'No especificado';
$mensaje = htmlspecialchars(strip_tags(trim($data['mensaje'])));

// ========== VALIDAR EMAIL ==========
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// ========== VALIDAR LONGITUD DE MENSAJE ==========
if (strlen($mensaje) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El mensaje es demasiado corto']);
    exit;
}

if (strlen($mensaje) > 2000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El mensaje es demasiado largo']);
    exit;
}

// ========== ASUNTO DEL EMAIL ==========
$subject = "$subject_prefix - Mensaje de $nombre";

// ========== CREAR MENSAJE EN HTML ==========
$html_message = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            margin: 20px auto;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #5234a5, #0d0d68);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .field {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .label {
            font-weight: 600;
            color: #5234a5;
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #333;
            font-size: 15px;
        }
        .mensaje-text {
            white-space: pre-wrap;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border-left: 3px solid #5234a5;
        }
        .footer {
            background: #1a1a2e;
            color: #999;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .footer p {
            margin: 5px 0;
        }
        .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #5234a5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>📧 Nuevo Mensaje de Contacto</h1>
            <p>MPDM - Soluciones Tecnológicas</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <span class='label'>👤 Nombre</span>
                <span class='value'>$nombre</span>
            </div>
            
            <div class='field'>
                <span class='label'>📧 Email</span>
                <span class='value'><a href='mailto:$email' style='color: #5234a5; text-decoration: none;'>$email</a></span>
            </div>
            
            <div class='field'>
                <span class='label'>🏢 Empresa</span>
                <span class='value'>$empresa</span>
            </div>
            
            <div class='field'>
                <span class='label'>📱 Teléfono</span>
                <span class='value'>$telefono</span>
            </div>
            
            <div class='field'>
                <span class='label'>💬 Mensaje</span>
                <div class='value mensaje-text'>$mensaje</div>
            </div>
            
            <div style='text-align: center; margin-top: 30px;'>
                <a href='mailto:$email' class='cta-button'>Responder al cliente</a>
            </div>
        </div>
        
        <div class='footer'>
            <p>Este mensaje fue enviado desde el formulario de contacto de <strong>mpdm.cl</strong></p>
            <p>📅 Fecha: " . date('d/m/Y') . " | ⏰ Hora: " . date('H:i:s') . "</p>
            <p style='margin-top: 15px; font-size: 11px;'>IP del remitente: " . $_SERVER['REMOTE_ADDR'] . "</p>
        </div>
    </div>
</body>
</html>
";

// ========== VERSIÓN DE TEXTO PLANO ==========
$text_message = "
═══════════════════════════════════════
NUEVO MENSAJE DE CONTACTO - MPDM
═══════════════════════════════════════

Nombre: $nombre
Email: $email
Empresa: $empresa
Teléfono: $telefono

───────────────────────────────────────
MENSAJE:
───────────────────────────────────────
$mensaje

───────────────────────────────────────
Enviado el: " . date('d/m/Y H:i:s') . "
IP: " . $_SERVER['REMOTE_ADDR'] . "
═══════════════════════════════════════
";

// ========== HEADERS DEL EMAIL ==========
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: MPDM Contacto <noreply@mpdm.cl>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1',
    'Importance: High'
];

// ========== ENVIAR EMAIL ==========
$mail_sent = @mail($to, $subject, $html_message, implode("\r\n", $headers));

if ($mail_sent) {
    // ========== EMAIL DE CONFIRMACIÓN AL CLIENTE ==========
    $confirmation_subject = '✅ Hemos recibido tu mensaje - MPDM';
    $confirmation_message = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #5234a5, #0d0d68); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .content p { margin: 15px 0; font-size: 16px; }
            .highlight { background: #f0f0ff; padding: 20px; border-radius: 8px; border-left: 4px solid #5234a5; margin: 20px 0; }
            .footer { background: #1a1a2e; color: #999; padding: 20px; text-align: center; font-size: 13px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>¡Gracias por contactarnos!</h1>
            </div>
            <div class='content'>
                <p>Hola <strong>$nombre</strong>,</p>
                <p>Hemos recibido tu mensaje correctamente y nuestro equipo lo está revisando.</p>
                
                <div class='highlight'>
                    <p style='margin: 0;'><strong>📋 Resumen de tu consulta:</strong></p>
                    <p style='margin: 10px 0 0;'>Te responderemos en menos de 24 horas hábiles a <strong>$email</strong></p>
                </div>
                
                <p>Mientras tanto, te invitamos a conocer más sobre nuestros servicios en <a href='https://mpdm.cl' style='color: #5234a5;'>mpdm.cl</a></p>
                
                <p style='margin-top: 30px;'>Atentamente,<br><strong>Equipo MPDM</strong><br>Soluciones Tecnológicas</p>
            </div>
            <div class='footer'>
                <p>MPDM - Transformando ideas en soluciones tecnológicas</p>
                <p style='margin-top: 10px;'>📧 contacto@mpdm.cl | 🌐 mpdm.cl</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $confirmation_headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: MPDM <noreply@mpdm.cl>',
        'Reply-To: contacto@mpdm.cl'
    ];
    
    // Enviar confirmación al cliente
    @mail($email, $confirmation_subject, $confirmation_message, implode("\r\n", $confirmation_headers));
    
    // ========== RESPUESTA EXITOSA ==========
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente. Revisa tu email para la confirmación.'
    ]);
} else {
    // ========== ERROR AL ENVIAR ==========
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor intenta nuevamente o escríbenos a contacto@mpdm.cl'
    ]);
}

// ========== LOG DE SEGURIDAD (OPCIONAL) ==========
// Descomenta estas líneas si quieres guardar un log
/*
$log_entry = date('Y-m-d H:i:s') . " | $nombre | $email | " . ($mail_sent ? 'ÉXITO' : 'ERROR') . "\n";
file_put_contents('contact_log.txt', $log_entry, FILE_APPEND);
*/
?>