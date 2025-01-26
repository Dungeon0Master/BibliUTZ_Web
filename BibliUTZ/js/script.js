
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

function nextItem() {
  if (index === items.length - 3) {
    index = 0; // Reiniciar al inicio del carrusel
  } else {
    index = Math.min(index + 1, items.length - 3);
  }
  showItems();
}

function prevItem() {
  if (index === 0) {
    index = items.length - 3; // Ir al final del carrusel
  } else {
    index = Math.max(index - 1, 0);
  }
  showItems();
}

nextButton.addEventListener('click', nextItem);
prevButton.addEventListener('click', prevItem);

// Mover automáticamente cada 3 segundos
const autoSlide = setInterval(nextItem, 5000);

window.addEventListener('resize', showItems);
showItems();

/*carrusel fin*/




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