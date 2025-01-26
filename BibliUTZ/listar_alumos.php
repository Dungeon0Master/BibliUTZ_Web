<?php
include("conn.php");

if (!$conexion) {
    echo json_encode(array('success' => false, 'error' => 'Error al conectar a la base de datos: ' . pg_last_error()));
    exit;
}

$sql = "SELECT * FROM alumnos";
$result = pg_query($conexion, $sql);

$response = array('success' => false, 'results' => array());

while ($row = pg_fetch_assoc($result)) {
    $response['results'][] = array(
        'idalumno' => htmlspecialchars($row['idalumno']),
        'matricula' => htmlspecialchars($row['matricula']),
        'nombre' => htmlspecialchars($row['nombre']),
        'nombredos' => htmlspecialchars($row['nombredos']),
        'apellidop' => htmlspecialchars($row['apellidop']),
        'apeliidom' => htmlspecialchars($row['apeliidom']),
        'correo' => htmlspecialchars($row['correo']),
        'carrera' => htmlspecialchars($row['carrera']),
        'grupo' => htmlspecialchars($row['grupo']),
    );
}

if (count($response['results']) > 0) {
    $response['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
