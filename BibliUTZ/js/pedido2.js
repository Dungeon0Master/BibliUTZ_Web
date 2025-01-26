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

    // Simula la carga de la página y elimina el spinner después de 2 segundos
    setTimeout(function() {
        const spinnerOverlay = document.querySelector(".spinner-overlay");
        if (spinnerOverlay) {
            spinnerOverlay.style.display = "none";
        }
    }, 500); // Ajusta el tiempo según sea necesario

    // Evento para el botón de realizar pedido
    const botonRealizarPedido = document.getElementById('realizar-pedido');
    if (botonRealizarPedido) {
        botonRealizarPedido.addEventListener('click', function() {
            window.location.href = 'prestalibro.html';
        });
    }

    // Cargar libros y manejar la tabla
    fetch('cargar_libro.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('#tabla-libros tbody');
            const tablaLibros = document.getElementById('tabla-libros');
            const botonPedido = document.getElementById('realizar-pedido');
            const mensajeDiv = document.getElementById('mensaje');

            if (tbody && tablaLibros && botonPedido && mensajeDiv) {
                // Limpiar la tabla antes de llenarla
                tbody.innerHTML = '';
                mensajeDiv.innerHTML = '';
                botonPedido.style.display = 'none'; // Ocultar el botón por defecto
                tablaLibros.style.display = 'none'; // Ocultar la tabla por defecto

                if (data.success && data.results.length > 0) {
                    data.results.forEach(libro => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${libro.isbn}</td>
                            <td>${libro.titulo}</td>
                            <td>${libro.autor}</td>
                            <td>${libro.editorial}</td>
                            <td>
                                <button onclick="eliminarLibro('${libro.isbn}')">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });

                    tablaLibros.style.display = 'table'; // Mostrar la tabla si hay libros
                    botonPedido.style.display = 'block'; // Mostrar el botón si hay libros
                } else {
                    mensajeDiv.innerHTML = '<p>No se encontraron libros en el pedido.</p>'; // Asignar el mensaje al innerHTML
                }
            } else {
                console.error("Algunos elementos no se encontraron en el DOM.");
            }
        })
        .catch(error => {
            // Asignar el mensaje de error en caso de fallo en la carga
            const mensajeDiv = document.getElementById('mensaje');
            if (mensajeDiv) {
                mensajeDiv.innerHTML = '<p>No se encontraron libros en el pedido.</p>';
            }
            console.error('Error al cargar los libros:', error);
            const tbody = document.querySelector('#tabla-libros tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5">Ocurrió un error al cargar los libros.</td></tr>';
            }
        });
});

function eliminarLibro(isbn) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        fetch('eliminar_libro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Libro eliminado exitosamente.');
                location.reload(); // Recarga la página
            } else {
                alert('Error al eliminar el libro: ' + (data.message || 'Error desconocido.'));
            }
        })
        .catch(error => {
            console.error('Error al eliminar el libro:', error);
        });
    }
}

