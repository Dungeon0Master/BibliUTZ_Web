<?php
header('Content-Type: application/json');
include 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar que los datos necesarios estén presentes
    if (!isset($data['matricula'], $data['nombre'], $data['apellidoPaterno'], $data['correo'], $data['carrera'], $data['grupo'])) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
        exit;
    }

    // Preparar la consulta SQL para llamar a la función insertar_alumno
    $query = "
        SELECT insertar_alumno(
            $1, $2, $3, $4, $5, 
            $6, $7, $8
        ) 
    ";

    // Parámetros a enviar a la función
    $params = [
        $data['matricula'],
        $data['nombre'],
        $data['segundoNombre'] === '(Si aplica)' ? '' : $data['segundoNombre'],
        $data['apellidoPaterno'],
        $data['apellidoMaterno'],
        $data['correo'] ,
        $data['carrera'],
        $data['grupo'],
    ];

    // Ejecutar la consulta y manejar el resultado
    $result = pg_query_params($conexion, $query, $params);

    if ($result) {
        $row = pg_fetch_row($result);
        echo json_encode(['success' => true, 'idalumno' => $row[0]]);
    } else {
        $error = pg_last_error($conexion);
        echo json_encode(['success' => false, 'message' => 'Error al agregar el alumno: ' . $error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
