<?php
include("conn.php");

header('Content-Type: application/json');

$response = array('success' => false);

if (!$conexion) {
    $response['error'] = 'Error al conectar a la base de datos: ' . pg_last_error();
    echo json_encode($response);
    exit;
}

$idprestamo = $_GET['id'];

// Consulta para obtener los detalles del préstamo y del alumno
$sql = "
    SELECT p.fechainicio, p.idalumno, p.idadminis, a.nombre AS nombre_alumno, a.apellidop, a.correo, 
           a.carrera, a.grupo, ad.nombre AS nombre_admin, ad.apellido AS apellido_admin
    FROM prestamos p
    JOIN alumnos a ON p.idalumno = a.idalumno
    JOIN administrador ad ON p.idadminis = ad.idadministrador
    WHERE p.idprest = $idprestamo
";

$result = pg_query($conexion, $sql);

if ($result) {
    if (pg_num_rows($result) > 0) {
        $prestamo = pg_fetch_assoc($result);
        $response['success'] = true;
        $response['fecha_inicio'] = $prestamo['fechainicio'];
        $response['alumno'] = array(
            'nombre' => htmlspecialchars($prestamo['nombre_alumno']),
            'apellido' => htmlspecialchars($prestamo['apellidop']),
            'correo' => htmlspecialchars($prestamo['correo']),
            'carrera' => htmlspecialchars($prestamo['carrera']),
            'grupo' => htmlspecialchars($prestamo['grupo']),
        );
        $response['admin'] = array(
            'nombre' => htmlspecialchars($prestamo['nombre_admin']),
            'apellido' => htmlspecialchars($prestamo['apellido_admin']),
        );

        // Consulta para obtener los libros prestados, incluyendo fechafin
        $sql_libros = "
            SELECT l.idlibro, l.titulo, l.isbn, pl.fechafin AS fecha_fin, pl.estadoprestamo AS estado, 
                   pl.renovaciones
            FROM prestlib pl
            JOIN libros l ON pl.idLibro = l.idlibro
            WHERE pl.idprestamo = $idprestamo
        ";

        $result_libros = pg_query($conexion, $sql_libros);
        if ($result_libros) {
            while ($libro = pg_fetch_assoc($result_libros)) {
                $response['libros'][] = array(
                    'idlibro' => htmlspecialchars($libro['idlibro']),
                    'titulo' => htmlspecialchars($libro['titulo']),
                    'isbn' => htmlspecialchars($libro['isbn']),
                    'fecha_fin' => htmlspecialchars($libro['fecha_fin']),
                    'renovaciones' => htmlspecialchars($libro['renovaciones']),
                    'estado' => htmlspecialchars($libro['estado']),
                );
            }
        } else {
            $response['error'] = 'Error al obtener los libros: ' . pg_last_error($conexion);
        }
    } else {
        $response['error'] = 'No se encontraron detalles del préstamo.';
    }
} else {
    $response['error'] = 'Error en la consulta: ' . pg_last_error($conexion);
}

echo json_encode($response);
?>

