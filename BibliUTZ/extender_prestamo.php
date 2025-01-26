<?php
include 'conn.php';

// Establece el tipo de contenido a JSON
header('Content-Type: application/json');

// Obtén el contenido de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

$idLibro = isset($data['idLibro']) ? $data['idLibro'] : null;
$idPrestamo = isset($data['idPrestamo']) ? $data['idPrestamo'] : null;

if ($idLibro === null || $idPrestamo === null) {
    echo json_encode(['success' => false, 'message' => 'Parámetros no válidos.']);
    exit;
}

try {
    // Consultar la duración del préstamo desde la tabla libros
    $query = "SELECT duracion_prestamo FROM libros WHERE idlibro = $1";
    $stmt = pg_prepare($conexion, "get_duracion_prestamo", $query);
    $result = pg_execute($conexion, "get_duracion_prestamo", [$idLibro]);

    if (!$result) {
        throw new Exception('Error al obtener la duración del préstamo: ' . pg_last_error($conexion));
    }

    $row = pg_fetch_assoc($result);
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'No se encontró el libro.']);
        exit;
    }

    $duracionPrestamo = (int) $row['duracion_prestamo']; // Duración en días

    // Verificar renovaciones disponibles
    $query = "SELECT renovaciones FROM prestlib WHERE idprestamo = $1 AND idlibro = $2";
    $stmt = pg_prepare($conexion, "check_renovaciones", $query);
    $result = pg_execute($conexion, "check_renovaciones", [$idPrestamo, $idLibro]);

    if (!$result) {
        throw new Exception('Error al verificar renovaciones: ' . pg_last_error($conexion));
    }

    $row = pg_fetch_assoc($result);
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'No se encontró el préstamo o el libro.']);
        exit;
    }

    $renovaciones = (int) $row['renovaciones'];

    if ($renovaciones > 0) {
        // Actualizar renovaciones y fecha de finalización
        $query = "UPDATE prestlib SET renovaciones = renovaciones - 1, fechafin = fechafin + interval '$duracionPrestamo days' WHERE idprestamo = $1 AND idlibro = $2";
        $stmt = pg_prepare($conexion, "update_prestamo", $query);
        $result = pg_execute($conexion, "update_prestamo", [$idPrestamo, $idLibro]);

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('Error al actualizar el préstamo: ' . pg_last_error($conexion));
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No se puede renovar más.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

