<?php
// eliminar_libro.php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $isbn = $data['isbn'];

    // Leer el contenido de guardado.txt
    $libros = file('guardado.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($libros === false) {
        echo json_encode(['success' => false, 'message' => 'Error al leer el archivo.']);
        exit;
    }

    $nuevos_libros = [];

    // Filtrar los libros para eliminar el que coincide con el ISBN
    foreach ($libros as $libro) {
        if (trim($libro) !== $isbn) {
            $nuevos_libros[] = $libro; // Mantener libros que no se eliminarán
        }
    }

    // Guardar los libros restantes de nuevo en guardado.txt
    $resultado = file_put_contents('guardado.txt', implode(PHP_EOL, $nuevos_libros));
    if ($resultado === false) {
        echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo.']);
        exit;
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
