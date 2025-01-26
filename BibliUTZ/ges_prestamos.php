<?php
include("conn.php");

if (!$conexion) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Error al conectar a la base de datos: ' . pg_last_error()
    ));
    exit;
}

// Consulta para obtener los préstamos y los datos del alumno
$sql = "
    SELECT p.idprest AS prestamo_id, p.fechainicio, a.matricula, a.nombre, a.apellidop
    FROM prestamos p
    JOIN alumnos a ON p.idalumno = a.idalumno
";

$result = pg_query($conexion, $sql);

$response = array(
    'success' => false,
    'results' => array()
);

if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $response['results'][] = array(
            'prestamo_id' => htmlspecialchars($row['prestamo_id']),
            'matricula' => htmlspecialchars($row['matricula']),
            'nombre' => htmlspecialchars($row['nombre']),
            'apellido' => htmlspecialchars($row['apellidop']),
            'fecha_inicio' => htmlspecialchars($row['fechainicio'])
        );
    }
    $response['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
