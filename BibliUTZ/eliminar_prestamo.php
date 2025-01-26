<?php
include("conn.php");

// Verificar el método HTTP
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el ID del préstamo desde la URL
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Preparar la consulta para eliminar el préstamo
        $sql = "DELETE FROM prestamos WHERE idprest = $1";
        $result = pg_query_params($conexion, $sql, array($id));

        // Verificar si la consulta fue exitosa
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el préstamo.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método HTTP no permitido.']);
}

// Cerrar la conexión a la base de datos
pg_close($conexion);
?>
