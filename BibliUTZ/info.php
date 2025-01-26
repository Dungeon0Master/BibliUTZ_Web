<?php
// Incluimos el archivo de conexión a la base de datos
include("conn.php");

// Obtenemos el ISBN de los parámetros de la URL
$isbn = $_GET['isbn'];

// Definimos la consulta SQL para obtener la información del libro basado en el ISBN
$consulta = "SELECT * FROM libros WHERE isbn = $1";
$resultado = pg_query_params($conexion, $consulta, array($isbn));

// Verificamos si la consulta se ejecutó correctamente
if ($resultado) {
    // Recuperamos la primera fila del resultado como un array asociativo
    $libro = pg_fetch_assoc($resultado);

    // Verificamos si se recuperó un libro
    if ($libro) {
        // Mostramos la información del libro en formato JSON
        echo json_encode($libro);
    } else {
        // Si no se encontró el libro, mostramos un mensaje adecuado
        echo json_encode(["error" => "No se encontró ningún libro con ese ISBN."]);
    }

    // Liberamos el recurso del resultado
    pg_free_result($resultado);
} else {
    // Si hubo un error al ejecutar la consulta, mostramos un mensaje de error
    echo json_encode(["error" => "Error al ejecutar la consulta."]);
}

// Cerramos la conexión a la base de datos
pg_close($conexion);
?>
