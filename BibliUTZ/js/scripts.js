/*carrusel*/
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
let index = 0;

function showItems() {
  const itemWidth = items[0].clientWidth + 10; // Ancho del item + espacio entre items (gap)
  carousel.style.transform = `translateX(${-index * itemWidth}px)`;
}

nextButton.addEventListener('click', () => {
  if (index === items.length - 3) {
    index = 0; // Reiniciar al inicio del carrusel
  } else {
    index = Math.min(index + 1, items.length - 3);
  }
  showItems();
});

prevButton.addEventListener('click', () => {
  if (index === 0) {
    index = items.length - 3; // Ir al final del carrusel
  } else {
    index = Math.max(index - 1, 0);
  }
  showItems();
});

window.addEventListener('resize', showItems);
showItems();
/*carrusel fin*/

/*perfil dropdown*/
document.addEventListener('DOMContentLoaded', function() {
    const perfilImg = document.getElementById('perfil-img');
    const dropdownContent = document.getElementById('dropdown-content');

    perfilImg.addEventListener('click', function() {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar el dropdown si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#perfil-img')) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            }
        }
    });
});
/*perfil dropdown fin*/

// Simula la carga de la página y elimina el spinner después de 3 segundos
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const spinnerOverlay = document.querySelector(".spinner-overlay");
        if (spinnerOverlay) {
            spinnerOverlay.style.display = "none";
        }
    }, 2000); // Ajusta el tiempo según sea necesario
});