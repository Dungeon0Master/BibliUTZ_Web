<?php
include("conn.php");

if (!$conexion) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Error al conectar a la base de datos: ' . pg_last_error()
    ));
    exit;
}

// Consulta para obtener los préstamos
$sql = "SELECT idprest, idalumno, fechainicio FROM prestamos";
$result = pg_query($conexion, $sql);

$response = array(
    'success' => false,
    'results' => array()
);

if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $response['results'][] = array(
            'idprest' => htmlspecialchars($row['idprest']),
            ' idalumno' => htmlspecialchars($row['idalumno']),
            'fechainicio' => htmlspecialchars($row['fechainicio'])
        );
    }
    $response['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
