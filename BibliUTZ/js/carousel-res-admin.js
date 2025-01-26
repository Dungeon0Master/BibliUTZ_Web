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
// Espera a que el contenido del DOM se haya cargado completamente antes de ejecutar el script
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

    // Obtener y usar parámetros de la URL
    const params = getQueryParams();
    // Si hay un parámetro de consulta
    if (params.query) {
        console.log('Query param found:', params.query); // Debug
        updateContent(null, params.query);
    // Si hay un parámetro de categoría
    } else if (params.category) {
        console.log('Category param found:', params.category); // Debug
        updateContent(params.category, null);
    }

    // Manejar el envío del formulario de búsqueda
    document.getElementById('search-form').addEventListener('submit', function(event) {
        // Previene la acción predeterminada del formulario
        event.preventDefault();
        // Obtiene el valor de la consulta de búsqueda
        const query = document.getElementById('search-query').value;
        console.log('Search form submitted with query:', query); // Debug
        updateContent(null, query);
    });

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

// Función para obtener los parámetros de la URL
function getQueryParams() {
    // Crea un objeto URLSearchParams a partir de la cadena de consulta
    const params = new URLSearchParams(window.location.search);
    return {
        // Obtiene los valores de los parámetros de consulta y categoría
        query: params.get('query'),
        category: params.get('category')
    };
}

// Función para actualizar el contenido según el término de búsqueda o categoría
function updateContent(category, query) {
    // Obtén la referencia al contenedor donde se mostrarán los resultados
    const contenedor = document.getElementById('contenedor');
    // Si hay un término de búsqueda
    if (query) {
        // Hace una petición fetch al servidor con el término de búsqueda
        fetch(`../BibliUTZ/tabla.php?query=${encodeURIComponent(query)}`)
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
                                   <th> </th>
                                   <th> ISBN</th>
                                    <th>Título</th>
                                    <th>Editorial</th>
                                    <th>Autor</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    // Itera sobre los resultados y crea filas de tabla
                    data.results.forEach(row => {
                        tableContent += `
                            <tr onclick="window.location='libroinfo-admin.html?isbn=${row.isbn}'">
                                <td><img src="${row.portada}" alt="Portada"></td>
                                <td>${row.isbn}</td>
                                <td>${row.titulo}</td>
                                <td>${row.editorial}</td>
                                <td>${row.autor}</td>
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
                            <h1><br></h1>
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
                        <h1><br></h1>
                        <h1>Error al realizar la búsqueda</h1>
                        <p>Ocurrió un error al intentar realizar la búsqueda. Por favor, inténtalo de nuevo más tarde.</p>
                        <img src="../BibliUTZ/img/ash.jpg" alt="No hay resultados">
                    </div>
                `;
            });
    // Si hay una categoría
    } else if (category) {
        // Hace una petición fetch al servidor con la categoría
        fetch(`../BibliUTZ/tablacategoria.php?category=${encodeURIComponent(category)}`)
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
                        
                        <div class="category-header">
                        <h1>${data.categoryName}</h1>
                        </div>
                        <table id="data-table">
                            <thead>
                                <tr>
                                   <th> </th>
                                   <th> ISBN</th>
                                    <th>Título</th>
                                    <th>Editorial</th>
                                    <th>Autor</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    // Itera sobre los resultados y crea filas de tabla
                    data.results.forEach(row => {
                        tableContent += `
                          <tr onclick="window.location='libroinfo-admin.html?isbn=${row.isbn}'">
                                <td><img src="${row.portada}" alt="Portada"></td>
                                <td>${row.isbn}</td>
                                <td>${row.titulo}</td>
                                <td>${row.editorial}</td>
                                <td>${row.autor}</td>
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
                            <h1><br></h1>
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
                        <p>Ocurrió un error al intentar realizar la búsqueda. Por favor, inténtalo de nuevo más tarde.</p>
                        <img src="../BibliUTZ/img/ash.jpg" alt="No hay resultados">
                    </div>
                `;
            });
    }
}
