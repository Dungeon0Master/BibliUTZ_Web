<?php
// Incluir el archivo de conexión
include 'conn.php';

// Verificar el método HTTP
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el ISBN desde la URL
    if (isset($_GET['isbn'])) {
        $isbn = $_GET['isbn'];

        // Preparar la consulta para eliminar el libro
        $sql = "DELETE FROM libros WHERE isbn = $1";
        $result = pg_query_params($conexion, $sql, array($isbn));

        // Verificar si la consulta fue exitosa
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el libro.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ISBN no proporcionado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método HTTP no permitido.']);
}

// Cerrar la conexión a la base de datos
pg_close($conexion);
?>