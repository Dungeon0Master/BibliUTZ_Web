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

    window.addEventListener('click', function(event) {
        if (!event.target.matches('#perfil-img')) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.classList.remove('show');
                dropdownContent.classList.add('hide');
            }
        }
    });

    dropdownContent.addEventListener('animationend', function() {
        if (dropdownContent.classList.contains('hide')) {
            dropdownContent.style.display = 'none';
        }
    });

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            isbn: params.get('isbn')
        };
    }

    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });

    const params = getQueryParams();
    if (params.isbn) {
        fetch(`info.php?isbn=${encodeURIComponent(params.isbn)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.error) {
                    document.getElementById('portada').src = data.portada;
                    document.getElementById('titulo').textContent = data.titulo;
                    document.getElementById('autor').textContent = data.autor;
                    document.getElementById('editorial').textContent = data.editorial;
                    document.getElementById('fecha_publicacion').textContent = data.fechapublicacion;
                    document.getElementById('isbn').textContent = data.isbn;
                    document.getElementById('num_paginas').textContent = data.numpaginas;
                    document.getElementById('ejemplares').textContent = data.no_ejempl;
                    document.getElementById('estatus').textContent = data.estatus;
                    document.getElementById('codigo_barra').textContent = data.codigobarras;
                } else {
                    document.getElementById('libro-info').innerHTML = '<p>No se encontró información para el libro especificado.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching book info:', error);
                document.getElementById('libro-info').innerHTML = '<p>Ocurrió un error al intentar obtener la información del libro.</p>';
            });
    }

    document.getElementById('prestar-button').addEventListener('click', function() {
        const isbn = params.isbn; // Obtenemos el ISBN del libro actual
        mostrarOpciones(isbn);
    });

    function mostrarOpciones(isbn) {
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semi-transparente
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '2000'; // Asegura que el modal esté por encima de otros elementos

        const modalContent = document.createElement('div');
        modalContent.id = 'modalContent';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modalContent.innerHTML = `
            <p>¿Quieres pedir prestado este libro o añadirlo a tu lista de pedidos?</p>
            <button id="prestamo-button">Pedir Prestado</button>
            <button id="guardar-button">Añadir a Lista de Pedidos</button>
            <button id="cerrar-button">Cerrar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        document.getElementById('prestamo-button').addEventListener('click', function() {
            // Realiza la misma acción que "Añadir a Lista de Pedidos"
            fetch('guardar_libro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isbn: isbn })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Libro añadido a tu lista de pedidos.');
                    // Redirigir a la página prestalibro.html
                    window.location.href = 'prestalibro.html';
                } else {
                    alert('Hubo un error al añadir el libro a tu lista.');
                }
            })
            .catch(error => {
                console.error('Error al guardar el libro:', error);
                alert('Ocurrió un error al intentar guardar el libro.');
            });
        });

        document.getElementById('guardar-button').addEventListener('click', function() {
            fetch('guardar_libro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isbn: isbn })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Libro añadido a tu lista de pedidos.');
                } else {
                    alert('Hubo un error al añadir el libro a tu lista.');
                }
            })
            .catch(error => {
                console.error('Error al guardar el libro:', error);
                alert('Ocurrió un error al intentar guardar el libro.');
            });
        });

        document.getElementById('cerrar-button').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }
});
