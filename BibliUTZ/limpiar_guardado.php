<?php
// Limpiar el archivo guardado.txt
file_put_contents('guardado.txt', ''); // Esto vacía el contenido del archivo
echo json_encode(['success' => true]);
?>
