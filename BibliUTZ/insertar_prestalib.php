<?php
include 'conn.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos

if ($conexion) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $prestamoId = $data['prestamo_id'] ?? null;
    $libros = $data['libros'] ?? [];

    if (is_null($prestamoId) || !is_array($libros) || empty($libros)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos o inválidos.']);
        exit;
    }

    $insertedData = [];

    foreach ($libros as $libro) {
        // Obtenemos el idlibro basado en el ISBN
        $idLibroQuery = "SELECT idlibro FROM libros WHERE isbn = $1";
        $idLibroResult = pg_query_params($conexion, $idLibroQuery, array($libro['isbn']));
        
        if ($idLibroResult) {
            $idLibroRow = pg_fetch_assoc($idLibroResult);
            if (!$idLibroRow) {
                continue; // Si no se encuentra el idlibro, saltamos a la siguiente iteración
            }
            $idLibro = $idLibroRow['idlibro'];

            // Obtenemos la duración del préstamo para calcular la fecha de fin
            $duracionQuery = "SELECT duracion_prestamo FROM libros WHERE idlibro = $1"; 
            $duracionResult = pg_query_params($conexion, $duracionQuery, array($idLibro));
            
            if ($duracionResult) {
                $duracionRow = pg_fetch_assoc($duracionResult);
                if (!$duracionRow) {
                    continue; // Salta a la siguiente iteración si no hay duración
                }
                $duracionPrestamo = $duracionRow['duracion_prestamo'] ?? 0; 
                $fechaFin = date('Y-m-d', strtotime("+$duracionPrestamo days"));

                // Ahora insertamos en la tabla prestalib con el idlibro obtenido
                $prestalibQuery = "INSERT INTO prestalib (idprestamo, idlibro, fechafin, estadoprestamo, renovaciones) VALUES ($1, $2, $3, $4, $5)";
                $params = array($prestamoId, $idLibro, $fechaFin, 'Activo', 3);
                
                $prestalibResult = pg_query_params($conexion, $prestalibQuery, $params);
        
                if (!$prestalibResult) {
                    echo json_encode(['success' => false, 'message' => pg_last_error($conexion)]);
                    exit;
                } else {
                    $insertedData[] = $params; 
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al obtener la duración del préstamo.']);
                exit;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al obtener el ID del libro.']);
            exit;
        }
    }

    // Respuesta exitosa al final de todas las inserciones
    echo json_encode(['success' => true, 'insertedData' => $insertedData]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo conectar a la base de datos.']);
}
?>
