<?php
include("conn.php");

// Lee el ID del archivo de texto
$idFile = 'idssss.txt';

if (file_exists($idFile)) {
    $idadministrador = trim(file_get_contents($idFile));
    
    // Verifica si el ID es válido
    if (is_numeric($idadministrador)) {
        $sql = "SELECT * FROM administrador WHERE idadministrador = $1";
        $result = pg_query_params($conexion, $sql, array($idadministrador));

        if ($result) {
            $admin = pg_fetch_assoc($result);
            if ($admin) {
                echo json_encode([
                    'success' => true,
                    'nombre' => htmlspecialchars($admin['nombre']),
                    'matricula' => htmlspecialchars($admin['matricula'])
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Administrador no encontrado.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al consultar la base de datos.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Archivo de ID no encontrado.']);
}

pg_close($conexion);
?>
