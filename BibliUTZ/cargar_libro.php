<?php
include("conn.php");

// Verificar si se pudo abrir el archivo 'guardado.txt'
$isbnList = file('guardado.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if ($isbnList === false) {
    $response = array('success' => false, 'error' => 'No se pudo abrir el archivo guardado.txt');
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Verificar si hay ISBNs en el archivo
if (empty($isbnList)) {
    $response = array('success' => false, 'error' => 'No hay ISBNs en el archivo guardado.txt');
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

$isbnCondition = implode("','", array_map('pg_escape_string', $isbnList));

// Preparar la consulta
$sql = "SELECT * FROM libros WHERE isbn IN ('$isbnCondition')";
$result = pg_query($conexion, $sql);

$response = array('success' => false, 'results' => array());

if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $response['results'][] = array(
            'isbn' => htmlspecialchars($row['isbn']),
            'titulo' => htmlspecialchars($row['titulo']),
            'autor' => htmlspecialchars($row['autor']),
            'editorial' => htmlspecialchars($row['editorial'])
        );
    }
    if (count($response['results']) > 0) {
        $response['success'] = true;
    } else {
        $response['error'] = 'No se encontraron libros para los ISBNs proporcionados.';
    }
} else {
    $response['error'] = 'Error en la consulta SQL: ' . pg_last_error($conexion);
}

header('Content-Type: application/json');
echo json_encode($response);
?>
