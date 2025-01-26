<?php
$host = 'localhost';
$port = '5432';
$dbname = 'utshop_db';
$user = 'postgres';
$password = '123';

$connect = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$connect) {
    die("Error de conexión: " . pg_last_error());
}
echo "Conexión exitosa";
?>
