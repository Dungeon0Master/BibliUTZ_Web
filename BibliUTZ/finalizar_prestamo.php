<?php
include 'conn.php';  // Asegúrate de que la conexión se esté incluyendo correctamente

// Establece el tipo de contenido a JSON
header('Content-Type: application/json');

// Obtén el contenido de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

$idLibro = isset($data['idLibro']) ? $data['idLibro'] : null;
$idPrestamo = isset($data['idPrestamo']) ? $data['idPrestamo'] : null;

if ($idLibro === null || $idPrestamo === null) {
    echo json_encode(['success' => false, 'message' => 'Parámetros no válidos.']);
    
}

try {
    // Consultar si el libro pertenece al préstamo
    $query = "SELECT 1 FROM prestlib WHERE idprestamo = $1 AND idlibro = $2";
    $stmt = pg_prepare($conexion, "check_libro_prestamo", $query);
    $result = pg_execute($conexion, "check_libro_prestamo", [$idPrestamo, $idLibro]);

    if (!$result) {
        throw new Exception('Error al verificar el libro en el préstamo: ' . pg_last_error($conexion));
    }

    if (pg_num_rows($result) === 0) {
        echo json_encode(['success' => false, 'message' => 'El libro no pertenece a este préstamo.']);
        exit;
    }

    // Actualizar el estado del préstamo a finalizado
    $query = "UPDATE prestlib SET estadoprestamo = 'Finalizado' WHERE idprestamo = $1 AND idlibro = $2";
    $stmt = pg_prepare($conexion, "update_estado_prestamo", $query);
    $result = pg_execute($conexion, "update_estado_prestamo", [$idPrestamo, $idLibro]);

    if (!$result) {
        throw new Exception('Error al actualizar el estado del préstamo: ' . pg_last_error($conexion));
    }

    // Incrementar la cantidad de ejemplares disponibles
    $query = "UPDATE libros SET no_ejempl = no_ejempl + 1 WHERE idlibro = $1";
    $stmt = pg_prepare($conexion, "update_libro_ejemplares", $query);
    $result = pg_execute($conexion, "update_libro_ejemplares", [$idLibro]);

    if (!$result) {
        throw new Exception('Error al actualizar la cantidad de ejemplares: ' . pg_last_error($conexion));
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
