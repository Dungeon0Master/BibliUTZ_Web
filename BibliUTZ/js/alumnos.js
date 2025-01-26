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
    // Inicializa la tabla de alumnos al cargar la página
    actualizarTablaAlumnos();
});

// Función para mostrar el formulario de alumno
function mostrarFormulario() {
    document.getElementById('formulario-alumno').style.display = 'block';
    document.getElementById('titulo-formulario').innerText = 'Agregar Alumno';
    document.getElementById('idalumno').value = '';
    limpiarFormulario();
}

// Función para ocultar el formulario
function ocultarFormulario() {
    document.getElementById('formulario-alumno').style.display = 'none';
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('matricula').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('nombredos').value = '';
    document.getElementById('apellidop').value = '';
    document.getElementById('apellidom').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('carrera').value = '';
    document.getElementById('grupo').value = '';
}

// Función para actualizar la tabla de alumnos
function actualizarTablaAlumnos() {
    const contenedor = document.getElementById('contenedor');
    fetch('listar_alumos.php')
        .then(response => response.json())
        .then(data => {
            let tableContent = `
                <table>
                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Correo</th>
                            <th>Carrera</th>
                            <th>Grupo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.results.forEach(alumno => {
                tableContent += `
                    <tr>
                        <td>${alumno.matricula}</td>
                        <td>${alumno.nombre} ${alumno.nombredos}</td>
                        <td>${alumno.apellidop}</td>
                        <td>${alumno.apeliidom}</td>
                        <td>${alumno.correo}</td>
                        <td>${alumno.carrera}</td>
                        <td>${alumno.grupo}</td>
                        <td>
                         
                            <button onclick="eliminarAlumno(${alumno.idalumno})">Eliminar</button>
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
        .catch(error => console.error('Error al cargar los alumnos:', error));
}

// Función para editar un alumno
function editarAlumno(idalumno) {
    fetch(`obtener_alumno.php?id=${idalumno}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('idalumno').value = data.alumno.idalumno;
                document.getElementById('matricula').value = data.alumno.matricula;
                document.getElementById('nombre').value = data.alumno.nombre;
                document.getElementById('nombredos').value = data.alumno.nombredos;
                document.getElementById('apellidop').value = data.alumno.apellidop;
                document.getElementById('apellidom').value = data.alumno.apellidom;
                document.getElementById('correo').value = data.alumno.correo;
                document.getElementById('carrera').value = data.alumno.carrera;
                document.getElementById('grupo').value = data.alumno.grupo;
                mostrarFormulario();
            } else {
                alert('Error al obtener el alumno: ' + data.message);
            }
        })
        .catch(error => console.error('Error al obtener el alumno:', error));
}

// Función para eliminar un alumno
function eliminarAlumno(idalumno) {
    if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
        fetch(`eliminar_alumno.php?id=${idalumno}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Alumno eliminado correctamente.');
                    actualizarTablaAlumnos();
                } else {
                    alert('Error al eliminar el alumno: ' + data.message);
                }
            })
            .catch(error => console.error('Error al eliminar el alumno:', error));
    }
}
