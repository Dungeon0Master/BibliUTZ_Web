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
    // Inicializa la tabla de administradores y el mensaje de administrador en línea al cargar la página
    mostrarAdministradorEnLinea();
    actualizarTablaAdministradores();
});

// Función para mostrar el administrador en línea
function mostrarAdministradorEnLinea() {
    fetch('obtener_administrador_en_linea.php')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('administrador-en-linea');
            if (data.success) {
                contenedor.innerHTML = `Administrador: ${data.nombre}, Matrícula: ${data.matricula}`;
            } else {
                contenedor.innerHTML = 'No se pudo determinar el administrador en línea.';
            }
        })
        .catch(error => console.error('Error al obtener el administrador en línea:', error));
}

// Función para actualizar la tabla de administradores
function actualizarTablaAdministradores() {
    const contenedor = document.getElementById('contenedor');
    fetch('listar_administrador.php')
        .then(response => response.json())
        .then(data => {
            let tableContent = `
                <table>
                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.results.forEach(administrador => {
                tableContent += `
                    <tr>
                        <td>${administrador.matricula}</td>
                        <td>${administrador.nombre}</td>
                        <td>${administrador.apellido}</td>
                        <td>${administrador.correo}</td>
                        <td>
                            <button onclick="eliminarAdministrador(${administrador.idadministrador})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            tableContent += `
                    </tbody>
                </table>
            `;
            contenedor.innerHTML = tableContent;
        })
        .catch(error => console.error('Error al cargar los administradores:', error));
}

// Función para eliminar un administrador
function eliminarAdministrador(idadministrador) {
    if (confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
        fetch(`eliminar_administrador.php?id=${idadministrador}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Administrador eliminado correctamente.');
                    actualizarTablaAdministradores();
                } else {
                    alert('Error al eliminar el administrador: ' + data.message);
                }
            })
            .catch(error => console.error('Error al eliminar el administrador:', error));
    }
}
