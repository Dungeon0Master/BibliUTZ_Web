<?php
// Lee el contenido de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['isbn'])) {
    $isbn = $data['isbn'];

    // Ruta del archivo donde se guardarán los ISBNs
    $archivo = 'guardado.txt';

    // Escribe el ISBN en el archivo
    file_put_contents($archivo, $isbn . PHP_EOL, FILE_APPEND);

    // Devuelve una respuesta JSON
    echo json_encode(['success' => true]);
} else {
    // Devuelve un error si no se proporciona el ISBN
    echo json_encode(['success' => false, 'error' => 'No se proporcionó ISBN.']);
}
?>
