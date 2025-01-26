// Evento para manejar la selección de la imagen
document.getElementById('portada-input').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    if (file) {
        const reader = new FileReader(); // Crear un objeto FileReader
        reader.onload = function(e) {
            // Establecer la fuente de la imagen de vista previa
            document.getElementById('portada-preview').src = e.target.result;
            document.getElementById('portada-preview').style.display = 'block'; // Mostrar la imagen
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
});

// Función para guardar el libro
function guardarLibro() {
    const libroData = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        editorial: document.getElementById('editorial').value,
        fecha_publicacion: document.getElementById('fecha_publicacion').value,
        isbn: document.getElementById('isbn').value,
        num_paginas: document.getElementById('num_paginas').value,
        ejemplares: document.getElementById('ejemplares').value,
        clasificacion: document.getElementById('clasificacion').value,
        catalogacion_dewin: document.getElementById('catalogacion_dewin').value,
        catalogacion_congreso: document.getElementById('catalogacion_congreso').value,
        estatus: document.getElementById('estatus').value,
        codigo_barra: document.getElementById('codigo_barra').value,
        duracion_prestamo: document.getElementById('duracion_prestamo').value  // Nuevo campo
    };

    const formData = new FormData(); // Crear un objeto FormData
    const portadaFile = document.getElementById('portada-input').files[0]; // Obtener el archivo de la portada

    // Verificar si se ha seleccionado un archivo de portada
    if (portadaFile) {
        formData.append('portada', portadaFile); // Agregar la imagen al FormData
    }

    // Agregar otros datos del libro al FormData
    Object.keys(libroData).forEach(key => formData.append(key, libroData[key]));

    // Realizar la petición para guardar el libro
    fetch('agregar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // Cambiar a .text() para ver la respuesta completa
    .then(data => {
        console.log('Respuesta completa del servidor:', data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.success) {
                alert('Libro agregado exitosamente.');
                location.reload();  // Recargar la página después del éxito
            } else {
                alert('Error al agregar el libro: ' + jsonData.message);
            }
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            alert('Respuesta no válida del servidor.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en la conexión.');
    });
}
