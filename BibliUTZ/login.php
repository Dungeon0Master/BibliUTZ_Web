<?php
// Incluir el archivo de conexión a la base de datos
include 'conn.php';

// Verifica si la conexión a la base de datos es exitosa
if ($conexion) {
    // Verifica si la solicitud HTTP es de tipo POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener y limpiar los datos del formulario
        $username = trim(pg_escape_string($conexion, $_POST['username']));
        $password = trim(pg_escape_string($conexion, $_POST['password']));

        // Verifica si el usuario o la contraseña están vacíos
        if (empty($username) || empty($password)) {
            echo "<script>alert('Matricula y contraseña son requeridos.'); window.location.href = 'login.html';</script>";
        } else {
            // Preparar una consulta SQL para buscar la contraseña del usuario en la base de datos
            $query = "SELECT pass FROM administrador WHERE matricula = $1";
            // Ejecutar la consulta SQL de manera segura con pg_query_params
            $result = pg_query_params($conexion, $query, array($username));
            
            // Obtener la fila de resultados de la consulta
            if ($result) {
                $row = pg_fetch_assoc($result);

                // Verifica si la contraseña ingresada coincide con la almacenada en la base de datos
                if ($row && password_verify($password, $row['pass'])) {
                    // Obtener el ID del administrador
                    $idQuery = "SELECT idadministrador FROM administrador WHERE matricula = $1";
                    $idResult = pg_query_params($conexion, $idQuery, array($username));
                    $idRow = pg_fetch_assoc($idResult);

                    if ($idRow) {
                        // Guardar el ID en el archivo de texto
                        file_put_contents('idssss.txt', $idRow['idadministrador']);
                    }

                    echo "<script>alert('Inicio de sesión exitoso.'); window.location.href = 'admindex.html';</script>";
                } else {
                    echo "<script>alert('Matricula o contraseña incorrectos.'); window.location.href = 'login.html';</script>";
                }
            } else {
                echo "<script>alert('Error en la consulta: " . pg_last_error($conexion) . "'); window.location.href = 'login.html';</script>";
            }
        }
    } else {
        echo "<script>alert('Método de solicitud no permitido.'); window.location.href = 'login.html';</script>";
    }
} else {
    echo "<script>alert('¡Ha ocurrido un error al conectar a la base de datos!'); window.location.href = 'login.html';</script>";
}
?>
