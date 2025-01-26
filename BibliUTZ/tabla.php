<?php
include("conn.php");

// Obtiene el término de búsqueda desde la URL
$query = isset($_GET['query']) ? $_GET['query'] : '';

// Prepara la consulta utilizando LIKE para la búsqueda por título y autor
$sql = "SELECT * FROM libros WHERE titulo ILIKE '$query%' OR autor ILIKE '$query%'";
$result = pg_query($conexion, $sql);

$response = array(
    'success' => false,
    'results' => array()
);

// Verifica si la primera consulta tuvo resultados
if ($result && pg_num_rows($result) > 0) {
    while ($row = pg_fetch_assoc($result)) {
        $response['results'][] = array(
            'portada' => htmlspecialchars($row['portada']),
            'isbn' => htmlspecialchars($row['isbn']),
            'titulo' => htmlspecialchars($row['titulo']),
            'editorial' => htmlspecialchars($row['editorial']),
            'autor' => htmlspecialchars($row['autor'])
        );
    }
    $response['success'] = true;
} else {
 
    if (is_numeric($query)) {
        $sql_isbn = "SELECT * FROM libros WHERE isbn = $query";
        $result_isbn = pg_query($conexion, $sql_isbn);

        if ($result_isbn && pg_num_rows($result_isbn) > 0) {
            while ($row = pg_fetch_assoc($result_isbn)) {
                $response['results'][] = array(
                    'portada' => htmlspecialchars($row['portada']),
                    'isbn' => htmlspecialchars($row['isbn']),
                    'titulo' => htmlspecialchars($row['titulo']),
                    'editorial' => htmlspecialchars($row['editorial']),
                    'autor' => htmlspecialchars($row['autor'])
                );
            }
            $response['success'] = true;
        }
    }
}

// Si no se encontraron resultados en ninguna consulta
if (count($response['results']) === 0) {
    $response['message'] = 'No se encontraron resultados.';
}

header('Content-Type: application/json');
echo json_encode($response);
?>
