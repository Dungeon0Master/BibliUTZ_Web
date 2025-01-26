<?php
include("conn.php");

if (!$conexion) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Error al conectar a la base de datos: ' . pg_last_error()
    ));
    exit;
}

// Prepara la consulta utilizando LIKE para la búsqueda
$sql = "SELECT * FROM libros";
$result = pg_query($conexion, $sql);

if (!$result) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Error en la consulta SQL: ' . pg_last_error($conexion)
    ));
    exit;
}

$response = array(
    'success' => false,
    'results' => array()
);

while ($row = pg_fetch_assoc($result)) {
    $response['results'][] = array(
        'portada' => htmlspecialchars($row['portada']),
        'isbn' => htmlspecialchars($row['isbn']),
        'titulo' => htmlspecialchars($row['titulo']),
        'editorial' => htmlspecialchars($row['editorial']),
        'autor' => htmlspecialchars($row['autor'])
    );
}

if (count($response['results']) > 0) {
    $response['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
