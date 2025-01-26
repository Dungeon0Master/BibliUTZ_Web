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

document.addEventListener('DOMContentLoaded', function() {
    loadPrestamos();
});

// Función para cargar los préstamos junto con los datos de los alumnos
function loadPrestamos() {
    fetch('ges_prestamos.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tabla-prestamos tbody');
            tbody.innerHTML = ''; // Limpiar tabla existente

            if (data.success) {
                data.results.forEach(prestamo => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${prestamo.prestamo_id}</td>
                        <td>${prestamo.matricula}</td>
                        <td>${prestamo.nombre} ${prestamo.apellido}</td>
                        <td>${prestamo.fecha_inicio}</td>
                        <td>
                            <button onclick="verDetalle(${prestamo.prestamo_id})">Ver Detalle</button>
                            <button onclick="eliminarPrestamo(${prestamo.prestamo_id})">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5">No se encontraron préstamos.</td></tr>';
            }
        })
        .catch(error => console.error('Error al cargar préstamos:', error));
}

// Función para ver detalles del préstamo
function verDetalle(prestamoId) {
    window.location.href = `detalle.html?id=${prestamoId}`;
}

// Función para eliminar un préstamo
function eliminarPrestamo(prestamoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
        fetch(`eliminar_prestamo.php?id=${prestamoId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Préstamo eliminado correctamente.');
                    loadPrestamos(); // Actualiza la tabla después de eliminar
                } else {
                    alert('Error al eliminar el préstamo.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar préstamo:', error);
                alert('Error al eliminar el préstamo.');
            });
    }
}
