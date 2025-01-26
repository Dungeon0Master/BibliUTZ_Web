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
document.addEventListener('DOMContentLoaded', function() {
    // Obtén las referencias a los elementos del perfil de imagen y el contenido del dropdown
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

    // Inicializa el contenido de la página
    updateContent('');

    // Ocultar el spinner después de un tiempo
    setTimeout(function() {
        // Obtén la referencia al overlay del spinner
        const spinnerOverlay = document.querySelector(".spinner-overlay");
        // Si el overlay existe, lo oculta
        if (spinnerOverlay) {
            spinnerOverlay.style.display = "none";
        }
    }, 500); // Ajusta el tiempo según sea necesario
});

// Función para actualizar el contenido según el término de búsqueda o categoría
function updateContent(query) {
    // Obtén la referencia al contenedor donde se mostrarán los resultados
    const contenedor = document.getElementById('contenedor');
    // Hace una petición fetch al servidor con el término de búsqueda
    fetch(`listalib.php`)
        .then(response => {
            // Verifica si la respuesta es correcta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Convierte la respuesta a JSON
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Debug
            // Si la respuesta contiene resultados
            if (data.success && data.results.length > 0) {
                let tableContent = `
                
                    <table id="data-table">
                        <thead>
                            <tr>
                                <th>Portada</th>
                                <th>ISBN</th>
                                <th>Título</th>
                                <th>Editorial</th>
                                <th>Autor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                // Itera sobre los resultados y crea filas de tabla
                data.results.forEach(row => {
                    tableContent += `
                        <tr>
                            <td><img src="${row.portada}" alt="Portada"></td>
                            <td>${row.isbn}</td>
                            <td>${row.titulo}</td>
                            <td>${row.editorial}</td>
                            <td>${row.autor}</td>
                            <td>
                                <button class="table-buttons edit" onclick="window.location='editarlibro.html?isbn=${row.isbn}'">Editar</button>
                                <button class="table-buttons delete" onclick="eliminarLibro('${row.isbn}')">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tableContent += `
                        </tbody>
                    </table>
                `;
                // Actualiza el contenido del contenedor con la tabla
                contenedor.innerHTML = tableContent;
            } else {
                // Si no hay resultados, muestra un mensaje de no resultados
                contenedor.innerHTML = `
                    <div class="no-results">
                        <h1>No se encontraron resultados para tu búsqueda.</h1>
                        <img src="../BibliUTZ/img/libroaburrido.png" alt="No hay resultados">
                    </div>
                `;
            }
        })
        .catch(error => {
            // Maneja errores en la petición fetch
            console.error('Error en la búsqueda:', error);
            contenedor.innerHTML = `
                <div class="no-results">
                    <h1>Error al realizar la búsqueda</h1>
                    <p>Ocurrió un error  Por favor, inténtalo de nuevo más tarde.</p>
                    <img src="../BibliUTZ/img/ash.jpg" alt="No hay resultados">
                </div>
            `;
        });
}

// Función para eliminar un libro
function eliminarLibro(isbn) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        fetch(`../BibliUTZ/eliminar.php?isbn=${isbn}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Libro eliminado correctamente.');
                    updateContent(''); // Actualiza la tabla después de eliminar
                } else {
                    alert('Error al eliminar el libro.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar el libro:', error);
                alert('Error al eliminar el libro.');
            });
    }
}