<?php
// Incluir el archivo de conexión
include 'conn.php';

if ($conexion) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener datos del formulario y validarlos
        $matricula = trim(pg_escape_string($conexion, $_POST['matricula']));
        $correo = trim(pg_escape_string($conexion, $_POST['correo']));
        $nombre = trim(pg_escape_string($conexion, $_POST['nombre']));
        $apellido = trim(pg_escape_string($conexion, $_POST['apellido']));
        $secnom = trim(pg_escape_string($conexion, $_POST['secnom']));
        $apeliidom = trim(pg_escape_string($conexion, $_POST['apeliidom']));
        $password = trim(pg_escape_string($conexion, $_POST['password']));

        if (empty($matricula) || empty($correo) || empty($nombre) || empty($apellido) || empty($password)) {
            echo "<script>alert('Todos los campos son requeridos, excepto los opcionales.'); window.location.href = 'register.html';</script>";
        } else {
            // Hashear la contraseña
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Llamar a la función para insertar el administrador
            $query = "SELECT insertar_admin($1, $2, $3, $4, $5, $6, $7)";
            $result = pg_query_params($conexion, $query, array($matricula, $correo, $nombre, $apellido, $hashed_password, $secnom, $apeliidom));

            if ($result) {
                echo "<script>alert('Registro exitoso.'); window.location.href = 'login.html';</script>";
            } else {
                echo "<script>alert('Error en el registro: " . pg_last_error($conexion) . "'); window.location.href = 'register.html';</script>";
            }
        }
    } else {
        echo "<script>alert('Método de solicitud no permitido.'); window.location.href = 'register.html';</script>";
    }
} else {
    echo "<script>alert('¡Ha ocurrido un error al conectar a la base de datos!'); window.location.href = 'register.html';</script>";
}
?>
