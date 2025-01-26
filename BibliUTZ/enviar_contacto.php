<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST['nombre']);
    $email = htmlspecialchars($_POST['email']);
    $asunto = htmlspecialchars($_POST['asunto']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    // Aquí puedes enviar el correo electrónico o guardar la información en una base de datos
    // Ejemplo para enviar un correo (asegúrate de configurar un servidor de correo en tu servidor)
    $to = "samuel.osuna.23s@utzmg.edu.mx";
    $subject = "Contacto desde la web: $asunto";
    $body = "Nombre: $nombre\nEmail: $email\n\nMensaje:\n$mensaje";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado con éxito.";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
}
?>
