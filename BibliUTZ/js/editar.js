function togglePerfil() {
    const perfil = document.getElementById('perfil');
    perfil.style.display = perfil.style.display === 'flex' ? 'none' : 'flex';
  }
  
  function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-content');
    const isShowing = dropdown.classList.contains('show');
  
    // Toggle the dropdown
    if (isShowing) {
        dropdown.classList.remove('show');
        dropdown.classList.add('hide');
    } else {
        dropdown.classList.remove('hide');
        dropdown.classList.add('show');
    }
  }
/*perfil dropdown*/
document.addEventListener('DOMContentLoaded', function() {
    const perfilImg = document.getElementById('perfil-img');
    const dropdownContent = document.getElementById('dropdown-content');
  
    perfilImg.addEventListener('click', function() {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.classList.remove('show');
            dropdownContent.classList.add('hide');
        } else {
            dropdownContent.style.display = 'block'; // Mostrar antes de animar
            dropdownContent.classList.remove('hide');
            dropdownContent.classList.add('show');
        }
    });
  
    // Cerrar el dropdown si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#perfil-img')) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.classList.remove('show');
                dropdownContent.classList.add('hide');
            }
        }
    });
  
    // Ocultar el dropdown después de que la animación de colapso haya terminado
    dropdownContent.addEventListener('animationend', function() {
        if (dropdownContent.classList.contains('hide')) {
            dropdownContent.style.display = 'none';
        }
    });
  });
  
document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            isbn: params.get('isbn')
        };
    }

    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });

    // Convertir la imagen de portada en un botón
    document.getElementById('portada').addEventListener('click', function() {
        document.getElementById('portada-input').click();
    });

    // Manejar la selección de la imagen
    document.getElementById('portada-input').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Obtener el primer archivo seleccionado
        if (file) {
            const reader = new FileReader(); // Crear un objeto FileReader
            reader.onload = function(e) {
                // Establecer la fuente de la imagen de vista previa
                document.getElementById('portada').src = e.target.result;
            };
            reader.readAsDataURL(file); // Leer el archivo como una URL de datos
        }
    });

    const params = getQueryParams();
    if (params.isbn) {
        fetch(`info.php?isbn=${encodeURIComponent(params.isbn)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.error) {
                    document.getElementById('portada').src = data.portada;
                    document.getElementById('titulo').value = data.titulo;
                    document.getElementById('autor').value = data.autor;
                    document.getElementById('editorial').value = data.editorial;
                    document.getElementById('no_edicion').value = data.no_edicion;
                    document.getElementById('isbn').value = data.isbn;
                    document.getElementById('num_paginas').value = data.numpaginas;
                    document.getElementById('ejemplares').value = data.no_ejempl;
                    document.getElementById('clasificacion').value = data.clasificacion;
                    document.getElementById('catalogacion_dewin').value = data.catalogaciondewin;
                    document.getElementById('catalogacion_congreso').value = data.catalogaciondelcongreso;
                    document.getElementById('estatus').value = data.estatus;
                    document.getElementById('codigo_barra').value = data.codigobarras;
                    document.getElementById('duracion_prestamo').value = data.duracion_prestamo;
                     // Formatear y asignar la fecha
        const fechaPublicacion = new Date(data.fechapublicacion);
        const formattedDate = fechaPublicacion.toISOString().split('T')[0];
        document.getElementById('fecha_publicacion').value = formattedDate;
                    document.getElementById('idlibro').value = data.idlibro; // Asigna el id del libro aquí
                } else {
                    document.querySelector('.text-info').innerHTML = '<p>No se encontró información para el libro especificado.</p>';
                }
            })
            
            .catch(error => {
                console.error('Error fetching book info:', error);
                document.querySelector('.text-info').innerHTML = '<p>Ocurrió un error al intentar obtener la información del libro.</p>';
            });
    }
    
    document.getElementById('save-button').addEventListener('click', function() {
        const form = document.getElementById('libro-form'); // Asegúrate de seleccionar el formulario
        const formData = new FormData(form); // Crear FormData con el formulario

        fetch('editar.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Cambiar a .text() para ver la respuesta completa
        .then(data => {
            console.log('Respuesta completa del servidor:', data); // Mostrar la respuesta en la consola
            try {
                const jsonData = JSON.parse(data); // Intentar parsear la respuesta como JSON
                if (jsonData.success) {
                    alert('Libro actualizado exitosamente.');
                    location.reload();  // Recargar la página después del éxito
                } else {
                    alert('Error al actualizar el libro: ' + jsonData.message);
                }
            } catch (error) {
                console.error('Error al parsear JSON:', error); // Manejar errores de parseo
                alert('Respuesta no válida del servidor.');
            }
        })
        .catch(error => {
            console.error('Error:', error); // Manejar errores de la solicitud
            alert('Error en la conexión.');
        });
    });
});
