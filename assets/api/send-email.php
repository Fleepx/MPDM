<?php
/**
 * Script PHP para enviar emails desde el formulario de contacto
 * Archivo: send-email.php
 */

// Configuración de CORS (si es necesario)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Configuración del email
$to = 'contacto@mpdm.cl';
$subject_prefix = 'Nuevo mensaje desde MPDM.cl';

// Obtener datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (empty($data['nombre']) || empty($data['email']) || empty($data['mensaje'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Sanitizar datos
$nombre = htmlspecialchars(strip_tags($data['nombre']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$empresa = isset($data['empresa']) ? htmlspecialchars(strip_tags($data['empresa'])) : 'No especificada';
$telefono = isset($data['telefono']) ? htmlspecialchars(strip_tags($data['telefono'])) : 'No especificado';
$servicio = isset($data['servicio']) ? htmlspecialchars(strip_tags($data['servicio'])) : 'No especificado';
$mensaje = htmlspecialchars(strip_tags($data['mensaje']));

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Mapear servicios
$servicios_nombres = [
    'desarrollo' => 'Desarrollo de Software',
    'diseno' => 'Diseño UX/UI',
    'infraestructura' => 'Infraestructura IT',
    'consultoria' => 'Consultoría Tecnológica',
    'integracion' => 'Integración de Sistemas',
    'redes' => 'Redes y Conectividad',
    'otro' => 'Otro'
];
$servicio_nombre = isset($servicios_nombres[$servicio]) ? $servicios_nombres[$servicio] : $servicio;

// Asunto del email
$subject = "$subject_prefix - $servicio_nombre";

// Crear el mensaje en HTML
$html_message = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #00d4ff, #0066ff);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .field {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #0066ff;
            display: block;
            margin-bottom: 5px;
        }
        .value {
            color: #333;
        }
        .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>Nuevo Mensaje de Contacto</h1>
        <p>MPDM - Soluciones Tecnológicas</p>
    </div>
    
    <div class='content'>
        <div class='field'>
            <span class='label'>Nombre:</span>
            <span class='value'>$nombre</span>
        </div>
        
        <div class='field'>
            <span class='label'>Email:</span>
            <span class='value'>$email</span>
        </div>
        
        <div class='field'>
            <span class='label'>Empresa:</span>
            <span class='value'>$empresa</span>
        </div>
        
        <div class='field'>
            <span class='label'>Teléfono:</span>
            <span class='value'>$telefono</span>
        </div>
        
        <div class='field'>
            <span class='label'>Servicio de Interés:</span>
            <span class='value'>$servicio_nombre</span>
        </div>
        
        <div class='field'>
            <span class='label'>Mensaje:</span>
            <div class='value' style='white-space: pre-wrap;'>$mensaje</div>
        </div>
    </div>
    
    <div class='footer'>
        <p>Este mensaje fue enviado desde el formulario de contacto de MPDM.cl</p>
        <p>Fecha: " . date('d/m/Y H:i:s') . "</p>
    </div>
</body>
</html>
";

// Crear versión de texto plano
$text_message = "
NUEVO MENSAJE DE CONTACTO - MPDM
================================

Nombre: $nombre
Email: $email
Empresa: $empresa
Teléfono: $telefono
Servicio: $servicio_nombre

Mensaje:
$mensaje

---
Enviado el: " . date('d/m/Y H:i:s') . "
";

// Headers del email
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: MPDM Contacto <noreply@mpdm.cl>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

// Enviar email
$mail_sent = mail($to, $subject, $html_message, implode("\r\n", $headers));

if ($mail_sent) {
    // Email de confirmación al cliente (opcional)
    $confirmation_subject = 'Hemos recibido tu mensaje - MPDM';
    $confirmation_message = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff, #0066ff); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>¡Gracias por contactarnos!</h1>
            </div>
            <div class='content'>
                <p>Hola $nombre,</p>
                <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo en menos de 24 horas.</p>
                <p><strong>Resumen de tu consulta:</strong></p>
                <p>Servicio: $servicio_nombre</p>
                <p>Atentamente,<br>Equipo MPDM</p>
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
    
    mail($email, $confirmation_subject, $confirmation_message, implode("\r\n", $confirmation_headers));
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor intenta nuevamente.'
    ]);
}
?>