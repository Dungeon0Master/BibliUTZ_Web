<?php
include 'conn.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos

$query = "SELECT isbn, titulo FROM libros WHERE estatus='Disponible'";
$result = pg_query($conexion, $query); // Cambia a pg_query

$response = array();
if ($result) {
    $response['success'] = true;
    $response['results'] = array();
    
    while ($row = pg_fetch_assoc($result)) { // Cambia a pg_fetch_assoc
        $response['results'][] = $row;
    }
} else {
    $response['success'] = false;
}

echo json_encode($response);
?>
