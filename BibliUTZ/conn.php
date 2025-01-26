<?php
$conexion = pg_connect("host=localhost dbname=Bibliutz user=postgres password=FanOfDnD1st");
if (!$conexion) {
    die("Error en la conexión a la base de datos.");
}
?>