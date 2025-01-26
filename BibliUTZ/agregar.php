<?php
// Incluir la conexión a la base de datos
include 'conn.php';

// Establecer el tipo de contenido a JSON
header('Content-Type: application/json');

// Decodificar los datos JSON enviados desde el cliente
$data = $_POST; // Obtener datos del formulario
$uploadDir = 'img/'; // Directorio donde se guardarán las imágenes

// Inicializar $imagePath como cadena vacía
$imagePath = '';

// Verificar si se ha subido un archivo de imagen
if (!empty($_FILES['portada']['name'])) {
    $fileName = basename($_FILES['portada']['name']); // Obtener el nombre del archivo
    $targetFilePath = $uploadDir . $fileName; // Ruta completa donde se guardará la imagen

    // Verificar si el archivo ya existe
    if (file_exists($targetFilePath)) {
        $imagePath = $targetFilePath; // Usar la imagen existente
    } else {
        // Mover el archivo a la carpeta de destino
        if (move_uploaded_file($_FILES['portada']['tmp_name'], $targetFilePath)) {
            $imagePath = $targetFilePath; // Ruta de la nueva imagen
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen.']);
            exit; // Salir si hay un error en la carga
        }
    }
}

// Preparar la consulta SQL para llamar a la función incertar_libro
$query = "
    SELECT incertar_libro(
        $1, $2, $3, $4, $5, 
        $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15
    )
";

// Añadir el parámetro faltante "duracion_prestamo" a la lista de parámetros
$params = [
    
        $data['titulo'], 
        $data['autor'], 
        $data['editorial'], 
        $data['no_edicion'], 
        $data['isbn'], 
        $data['ejemplares'], 
        $data['clasificacion'], 
        $imagePath,                
        $data['codigo_barra'], 
        $data['num_paginas'], 
        $data['fecha_publicacion'], 
        $data['catalogacion_congreso'],
        $data['catalogacion_dewin'], 
        $data['duracion_prestamo'], 
        $data['estatus'], 

    
];

// Ejecutar la consulta y manejar el resultado
$result = pg_query_params($conexion, $query, $params);

if ($result) {
    $row = pg_fetch_row($result);
    echo json_encode(['success' => true, 'id_libro' => $row[0]]);
} else {
    $error = pg_last_error($conexion);
    echo json_encode(['success' => false, 'message' => 'Error al agregar el libro: ' . $error]);
}
?>
