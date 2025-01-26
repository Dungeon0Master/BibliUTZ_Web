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
document.getElementById('alumnoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const nombre = document.getElementById('nombre').value;
    const segundoNombre = document.getElementById('segundoNombre').value || '(Si aplica)';
    const apellidoPaterno = document.getElementById('apellidoPaterno').value;
    const apellidoMaterno = document.getElementById('apellidoMaterno').value;
    const matricula = document.getElementById('matricula').value;
    const correo = document.getElementById('correo').value + '@utzmg.edu.mx'; // Agregar el dominio aquí
    const carrera = document.getElementById('carrera').value;
    const grupo = document.getElementById('grupo').value;

    const data = {
        nombre,
        segundoNombre,
        apellidoPaterno,
        apellidoMaterno,
        matricula,
        correo,
        carrera,
        grupo
    };

    fetch('agr_alumno.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text()) // Cambiar a .text() para ver la respuesta completa
    .then(data => {
        console.log('Respuesta completa del servidor:', data);
        try {
            const jsonData = JSON.parse(data);
            const mensajeDiv = document.getElementById('mensaje');
            if (jsonData.success) {
                mensajeDiv.innerHTML = '<p>Alumno registrado exitosamente.</p>';
                document.getElementById('alumnoForm').reset(); // Limpiar el formulario
            } else {
                mensajeDiv.innerHTML = `<p>Error al registrar: ${jsonData.message}</p>`;
            }
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            const mensajeDiv = document.getElementById('mensaje');
            mensajeDiv.innerHTML = '<p>Respuesta no válida del servidor.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.innerHTML = '<p>Error en la conexión.</p>';
    });
});

