<?php
include("conn.php");

// Obtiene la categoría desde la URL
$category = isset($_GET['category']) ? $_GET['category'] : '';

if (empty($category)) {
    echo json_encode(array(
        'success' => false,
        'error' => 'No category specified'
    ));
    exit;
}

// Prepara la consulta utilizando la categoría proporcionada
$sql = "SELECT * FROM libros WHERE clasificacion = $1";
$result = pg_query_params($conexion, $sql, array($category));

if (!$result) {
    echo json_encode(array(
        'success' => false,
        'error' => pg_last_error($conexion)
    ));
    exit;
}

$response = array(
    'success' => false,
    'categoryName' => htmlspecialchars($category),
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
