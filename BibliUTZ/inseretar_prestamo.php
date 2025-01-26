<?php
include 'conn.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos

if ($conexion) {
    $data = json_decode(file_get_contents('php://input'), true);

    $alumnoId = $data['alumno_id'] ?? null;
    $adminId = $data['admin_id'] ?? null;
    $fechaInicio = $data['fecha_inicio'] ?? null;
    $libros = $data['libros'] ?? [];

    if (is_null($alumnoId) || is_null($adminId) || is_null($fechaInicio) || !is_array($libros) || empty($libros)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos o inválidos.']);
        exit;
    }

    $insertedData = [];
    $resultadoPrestamo = insertar_prestamo($alumnoId, $adminId, $fechaInicio);

    if ($resultadoPrestamo) {
        $prestamoId = $resultadoPrestamo;
        error_log("Préstamo insertado con ID: $prestamoId");

        foreach ($libros as $libro) {
            error_log("Procesando libro: " . print_r($libro, true));

            // Obtener idlibro usando el ISBN
            $idLibroQuery = "SELECT idlibro FROM libros WHERE isbn = $1";
            $idLibroResult = pg_query_params($conexion, $idLibroQuery, array($libro['isbn']));
            
            if ($idLibroResult && pg_num_rows($idLibroResult) > 0) {
                $idLibroRow = pg_fetch_assoc($idLibroResult);
                $idLibro = $idLibroRow['idlibro'];

                // Obtener la duración del préstamo
                $duracionQuery = "SELECT duracion_prestamo FROM libros WHERE idlibro = $1";
                $duracionResult = pg_query_params($conexion, $duracionQuery, array($idLibro));

                if ($duracionResult && pg_num_rows($duracionResult) > 0) {
                    $duracionRow = pg_fetch_assoc($duracionResult);
                    $duracionPrestamo = $duracionRow['duracion_prestamo'] ?? 0;
                    error_log("Duración del préstamo para idlibro $idLibro: $duracionPrestamo días");

                    $fechaFin = date('Y-m-d', strtotime($fechaInicio . " + $duracionPrestamo days"));
                    error_log("Fecha de fin calculada: $fechaFin");

                    // Insertar en prestalib con el idlibro
                    $prestalibQuery = "INSERT INTO prestlib (idprestamo, idlibro, fechafin, estadoprestamo, renovaciones) VALUES ($1, $2, $3, $4, $5)";
                    $params = array($prestamoId, $idLibro, $fechaFin, 'Activo', 3);

                    error_log("Intentando insertar en prestalib: " . print_r($params, true));

                    $prestalibResult = pg_query_params($conexion, $prestalibQuery, $params);

                    if (!$prestalibResult) {
                        error_log("Error al insertar en prestalib: " . pg_last_error($conexion));
                        echo json_encode(['success' => false, 'message' => 'Error al insertar en prestalib: ' . pg_last_error($conexion)]);
                        exit;
                    } else {
                        $insertedData[] = $params;
                        error_log("Datos insertados correctamente en prestalib: " . print_r($params, true));
                    }
                } else {
                    error_log("No se encontró duración para idlibro: $idLibro");
                    echo json_encode(['success' => false, 'message' => "No se encontró duración para el libro con id: $idLibro."]);
                    exit;
                }
            } else {
                error_log("No se encontró idlibro para ISBN: " . $libro['isbn']);
                echo json_encode(['success' => false, 'message' => "No se encontró el libro con ISBN: " . $libro['isbn']]);
                exit;
            }
        }

        // Respuesta exitosa al final de todas las inserciones
        echo json_encode(['success' => true, 'insertedData' => $insertedData]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al insertar el préstamo.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo conectar a la base de datos.']);
}

// Función para insertar préstamo
function insertar_prestamo($idalumno, $idadmins, $fechainicio) {
    global $conexion;

    $query = "SELECT insertar_prestamo($1, $2, $3)";
    $result = pg_query_params($conexion, $query, array($idalumno, $idadmins, $fechainicio));

    if ($result) {
        return pg_fetch_result($result, 0, 0);
    } else {
        return false;
    }
}
?>
