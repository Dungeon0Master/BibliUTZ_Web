<?php
include("conn.php");

// Verifica si la conexión fue exitosa
if (!$conexion) {
    echo json_encode(array('success' => false, 'error' => 'Error al conectar a la base de datos: ' . pg_last_error()));
    exit;
}

// Consulta para obtener todos los registros de la tabla 'administrador'
$sql = "SELECT * FROM administrador";
$result = pg_query($conexion, $sql);

// Prepara la respuesta
$response = array('success' => false, 'results' => array());

// Recorre los resultados y agrega cada fila a la respuesta
while ($row = pg_fetch_assoc($result)) {
    $response['results'][] = array(
        'idadministrador' => htmlspecialchars($row['idadministrador']),
        'matricula' => htmlspecialchars($row['matricula']),
        'correo' => htmlspecialchars($row['correo']),
        'nombre' => htmlspecialchars($row['nombre']),
        'apellido' => htmlspecialchars($row['apellido']),
        'pass' => htmlspecialchars($row['pass']),
        'secnom' => htmlspecialchars($row['secnom']),
        'apeliidom' => htmlspecialchars($row['apeliidom']),
    );
}

// Si hay resultados, cambia el estado de 'success' a true
if (count($response['results']) > 0) {
    $response['success'] = true;
}

// Envía la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
