<?php
include("conn.php");

// Verifica si el método de solicitud es DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Verifica si se ha proporcionado el ID en los parámetros de la solicitud
    if (isset($_GET['id'])) {
        $idadministrador = $_GET['id'];

        // Prepara la consulta para eliminar un registro específico de la tabla 'administrador'
        $sql = "DELETE FROM administrador WHERE idadministrador = $1";
        $result = pg_query_params($conexion, $sql, array($idadministrador));

        // Verifica si la consulta se ejecutó exitosamente
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el administrador.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método HTTP no permitido.']);
}

// Cierra la conexión con la base de datos
pg_close($conexion);
?>
