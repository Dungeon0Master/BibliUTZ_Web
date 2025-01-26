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
      }, 500); // Ajusta el tiempo según sea necesario
  });
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el ID del administrador
    fetch('idssss.txt')
        .then(response => response.text())
        .then(data => {
            const adminId = data.trim();
            document.getElementById('admin-id').value = adminId;
        })
        .catch(error => console.error('Error al cargar el ID del administrador:', error));

    // Cargar alumnos
    fetch('cargar_alumnos.php')
        .then(response => response.json())
        .then(data => {
            const alumnoSelect = document.getElementById('alumno');
            if (data.success) {
                data.results.forEach(alumno => {
                    const option = document.createElement('option');
                    option.value = alumno.idalumno;
                    option.textContent = alumno.nombre;
                    alumnoSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar alumnos:', error));

    // Cargar libros
fetch('cargar_libro.php')
.then(response => response.json())
.then(data => {
    const tbody = document.querySelector('#tabla-libros tbody');
    if (data.success) {
        data.results.forEach(libro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${libro.isbn}</td>
                <td>${libro.titulo}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="2">No se encontraron libros.</td></tr>';
    }
})
.catch(error => console.error('Error al cargar libros:', error));


    // Confirmar préstamo
    document.getElementById('confirmar-prestamo').addEventListener('click', function() {
        const alumnoId = document.getElementById('alumno').value;
        const adminId = document.getElementById('admin-id').value;
        const fechaInicio = new Date().toISOString().split('T')[0];

        if (!alumnoId) {
            alert('Por favor, selecciona un alumno.');
            return;
        }

        // Crear array de libros desde la tablas
        const libros = [];
        document.querySelectorAll('#tabla-libros tbody tr').forEach(row => {
            const isbn = row.querySelector('td').textContent;
            libros.push({ isbn });
        });

        const data = {
            alumno_id: alumnoId,
            admin_id: adminId,
            fecha_inicio: fechaInicio,
            libros: libros
        };

        console.log('Datos a enviar:', data); // Mostrar los datos que se envían

        fetch('inseretar_prestamo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            console.log('Respuesta del servidor:', result); // Imprimir la respuesta para depurar
            try {
                const jsonResult = JSON.parse(result);
                if (jsonResult.success) {
                    alert('Préstamo confirmado exitosamente.');
                    console.log('Datos insertados en prestalib:', jsonResult.insertedData);
                } else {
                    alert('Error al confirmar el préstamo: ' + jsonResult.message);
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                alert('La respuesta del servidor no es un JSON válido.');
            }
        })
        .catch(error => console.error('Error al confirmar préstamo:', error));
    });
});// Confirmar préstamo
document.getElementById('confirmar-prestamo').addEventListener('click', function() {
    const alumnoId = document.getElementById('alumno').value;
    const adminId = document.getElementById('admin-id').value;
    const fechaInicio = new Date().toISOString().split('T')[0];

    if (!alumnoId) {
        alert('Por favor, selecciona un alumno.');
        return;
    }

    // Crear array de libros desde la tabla
    const libros = [];
    document.querySelectorAll('#tabla-libros tbody tr').forEach(row => {
        const isbn = row.querySelector('td').textContent;
        libros.push({ isbn });
    });

    const data = {
        alumno_id: alumnoId,
        admin_id: adminId,
        fecha_inicio: fechaInicio,
        libros: libros
    };

    console.log('Datos a enviar:', data); // Mostrar los datos que se envían

    fetch('inseretar_prestamo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        console.log('Respuesta del servidor:', result); // Imprimir la respuesta para depurar
        try {
            const jsonResult = JSON.parse(result);
            if (jsonResult.success) {
                // Limpiar el archivo guardado.txt
                fetch('limpiar_guardado.php')
                    .then(response => response.json())
                    .then(cleanResult => {
                        if (cleanResult.success) {
                            alert('Préstamo confirmado exitosamente.');
                            window.location.href = 'index.html'; // Redirigir al index.html
                        } else {
                            alert('Error al limpiar el archivo guardado.');
                        }
                    })
                    .catch(error => console.error('Error al limpiar el archivo:', error));
            } else {
                alert('Error al confirmar el préstamo: ' + jsonResult.message);
            }
        } catch (e) {
            console.error('Error al parsear JSON:', e);
            alert('La respuesta del servidor no es un JSON válido.');
        }
    })
    .catch(error => console.error('Error al confirmar préstamo:', error));
});
