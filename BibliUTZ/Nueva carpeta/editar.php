<?php
// Incluir la conexión a la base de datos
include 'conn.php';

// Establecer el tipo de contenido a JSON
header('Content-Type: application/json');

// Decodificar los datos JSON enviados desde el cliente
$data = $_POST;

// Verificación de datos recibidos
if (!isset($data['titulo']) || !isset($data['autor']) || !isset($data['editorial'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Verificar si se ha subido un archivo de imagen
$uploadDir = 'img/';
$imagePath = '';

if (!empty($_FILES['portada']['name'])) {
    $fileName = basename($_FILES['portada']['name']);
    $targetFilePath = $uploadDir . $fileName;

    if (file_exists($targetFilePath)) {
        $imagePath = $targetFilePath; // Usar la imagen existente
    } else {
        // Mover el archivo subido a la carpeta de destino
        if (move_uploaded_file($_FILES['portada']['tmp_name'], $targetFilePath)) {
            $imagePath = $targetFilePath; // Ruta de la nueva imagen
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen.']);
            exit;
        }
    }
}

// Preparar la consulta SQL para actualizar la información del libro
$query = "
    UPDATE libros
    SET titulo = $1,
        autor = $2,
        editorial = $3,
        no_edicion = $4,
        isbn = $5,
        no_ejempl = $6,
        clasificacion = $7,
        portada = $8,
        codigobarras = $9,
        numpaginas = $10,
        fechapublicacion = $11,
        catalogaciondelcongreso = $12,
        catalogaciondewin = $13,
        duracion_prestamo = $14,
        estatus = $15
    WHERE idlibro = $16
";

// Crear el array de parámetros para la consulta
$params = [
    $data['titulo'], 
    $data['autor'], 
    $data['editorial'], 
    $data['no_edicion'], 
    $data['isbn'], 
    $data['no_ejempl'], 
    $data['clasificacion'], 
    $imagePath,                // Este campo puede estar vacío si no se sube una nueva imagen
    $data['codigobarras'], 
    $data['numpaginas'], 
    $data['fechapublicacion'], 
    $data['catalogaciondelcongreso'], 
    $data['catalogaciondewin'], 
    $data['duracion_prestamo'], 
    $data['estatus'], 
    $data['idlibro']          // Usar idlibro para identificar el registro a actualizar
];

// Ejecutar la consulta y manejar el resultado
$result = pg_query_params($conexion, $query, $params);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Libro actualizado exitosamente.']);
} else {
    $error = pg_last_error($conexion);
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el libro: ' . $error]);
}
?>
