<?php
$connect = pg_connect("host=localhost port=5432 user=postgres password=123 dbname=utshop_db");

// verificar la conexión
if (!$connect) {
    // muestra un mensaje de error si la conexión falla
    die("Error de conexión a la base de datos:( " . pg_last_error());
} else {
    // muestra un mensaje de éxito si la conexión es exitosa
    echo "Conexión exitosa a la base de datos de utshop.";
}
?>

