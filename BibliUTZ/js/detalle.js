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
  
  
  /*perfil dropdown fin*/
  
  // Simula la carga de la página y elimina el spinner después de 2 segundos
  document.addEventListener("DOMContentLoaded", function() {
      setTimeout(function() {
          const spinnerOverlay = document.querySelector(".spinner-overlay");
          if (spinnerOverlay) {
              spinnerOverlay.style.display = "none";
          }
      }, 2000); // Ajusta el tiempo según sea necesario
  });
const urlParams = new URLSearchParams(window.location.search);
const prestamoId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', function() {
    loadPrestamoDetails(prestamoId);
});

function loadPrestamoDetails(id) {
    fetch(`detalles_prestamo.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Llenar información del solicitante
                document.getElementById('nombre').innerText = `${data.alumno.nombre} ${data.alumno.apellido}`;
                document.getElementById('correo').innerText = data.alumno.correo;
                document.getElementById('carrera').innerText = data.alumno.carrera;
                document.getElementById('grupo').innerText = data.alumno.grupo || 'No definido';
                document.getElementById('admin').innerText = `${data.admin.nombre} ${data.admin.apellido}`;

                // Llenar la tabla de libros
                const tbody = document.querySelector('#tabla-libros tbody');
                tbody.innerHTML = ''; // Limpiar tabla existente

                // Verificar si hay libros y llenarlos
                if (data.libros && data.libros.length > 0) {
                    data.libros.forEach(libro => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${libro.idlibro}</td>
                            <td>${libro.titulo}</td>
                            <td>${libro.isbn}</td>
                            <td>${data.fecha_inicio}</td>
                            <td>${libro.fecha_fin}</td>
                            <td>${libro.renovaciones}</td>
                            <td>${libro.estado}</td>
                            <td>
                                <button onclick="extenderPrestamo(${libro.idlibro}, ${prestamoId}, ${libro.renovaciones})">Extender</button>
                                <button onclick="finalizarPrestamo(${libro.idlibro}, ${prestamoId})">Finalizar</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="8">No hay libros disponibles</td>`;
                    tbody.appendChild(row);
                }

                // Llenar fechas
                document.getElementById('fecha_inicio').innerText = data.fecha_inicio;
                document.getElementById('fecha_fin').innerText = data.libros.length > 0 ? data.libros[0].fecha_fin : 'No definido';
                document.getElementById('estado-prestamo').innerText = data.estado || 'No definido';
            } else {
                alert('Error al cargar los detalles del préstamo.');
            }
        })
        .catch(error => console.error('Error al cargar los detalles:', error));
}

function finalizarPrestamo(idLibro, idPrestamo) {
    console.log('ID Libro a finalizar:', idLibro);
    console.log('ID Préstamo a finalizar:', idPrestamo);

    if (confirm("¿Estás seguro de que quiere finalizar este préstamo?")) {
        fetch(`finalizar_prestamo.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idLibro, idPrestamo })
        })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.success) {
                alert("El préstamo ha sido finalizado correctamente.");
                loadPrestamoDetails(idPrestamo); // Recargar detalles del préstamo
            } else {
                alert("Error al finalizar el préstamo: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error al finalizar el préstamo:', error);
        });
    }
}


function extenderPrestamo(idLibro, idPrestamo, renovaciones) {
    if (renovaciones > 0) {
        fetch(`extender_prestamo.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idLibro, idPrestamo })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Se ha gastado una renovación con éxito.");
                loadPrestamoDetails(idPrestamo); // Recargar detalles del préstamo
            } else {
                alert("Error al extender el préstamo: " + data.message);
            }
        })
        .catch(error => console.error('Error al extender el préstamo:', error));
    } else {
        alert("El libro no se puede renovar más.");
    }
}
