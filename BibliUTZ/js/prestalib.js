document.addEventListener('DOMContentLoaded', function() {
    // Cargar alumnos
    fetch('cargar_alumnos.php')
        .then(response => response.json())
        .then(data => {
            const alumnoSelect = document.getElementById('alumno');
            if (data.success) {
                data.results.forEach(alumno => {
                    const option = document.createElement('option');
                    option.value = alumno.id; // Asumiendo que el ID del alumno está disponible
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
        alert('Funcionalidad de confirmar préstamo aún no implementada.');
        // Aquí puedes agregar la lógica para confirmar el préstamo
    });
});
