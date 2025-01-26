<?php
$connect = pg_connect("host=localhost port=5432 user=postgres password=123 dbname=utshop_db");

echo "Formulario enviado.";

if (!$connect) {
    die("Error de conexión a la base de datos: " . pg_last_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $categoria = $_POST['categoria'];
    $existencias = $_POST['existencias'];
    $precio = $_POST['precio'];
    
    // consulta a la base de datos para insertar el producto
    $query = "SELECT insertar_producto($categoria, '$nombre', '$descripcion', $existencias, $precio)";
    $result = pg_query($connect, $query);

    if ($result) {
        echo "Producto insertado con éxito";
    } else {
        echo "Error al insertar el producto: " . pg_last_error();
    }
}
?>






   



