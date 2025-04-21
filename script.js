

let searchForm = document.querySelector('.search-form');
let searchInput = document.querySelector('#search-btn');
let navbar = document.querySelector('.navbar');


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.notify-btn').forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();

            const productCode = this.dataset.code;
            if (!productCode) {
                alert("Product code not found.");
                return;
            }

            const phoneNumber = "919442947264"; 
            const message = encodeURIComponent(Set Price Alert for Product Code: ${productCode});
            const whatsappURL = "https://wa.me/${919442947264}?text=${message}";

            window.open(whatsappURL, '_blank');
        });
    });
});

// Toggle search form on click
document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active');
  navbar.classList.remove('active');
}

// Toggle navbar on click
document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
  searchForm.classList.remove('active');
}

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("search-input");
    const button = document.getElementById("search-btn");

    if (input && button) {
        button.addEventListener("click", function () {
            console.log(input.value);
        });
    } else {
        console.error("Search input or button not found.");
    }
});

// Scroll spy functionality
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.header .navbar a');

window.onscroll = () => {
  searchForm.classList.remove('active');
  navbar.classList.remove('active');

  if (window.scrollY > 0) {
    document.querySelector('.header').classList.add('active');
  } else {
    document.querySelector('.header').classList.remove('active');
  }

  sections.forEach(section => {
    let top = window.scrollY;
    let offset = section.offsetTop - 200;
    let height = section.offsetHeight;
    let id = section.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        document.querySelector(`.header .navbar a[href*="${id}"]`).classList.add('active');
      });
    }
  });
}

        
// Ensure header is active on page load if scrolled
window.onload = () => {
  if (window.scrollY > 0) {
    document.querySelector('.header').classList.add('active');
  } else {
    document.querySelector('.header').classList.remove('active');
  }
}

// Swiper for home slider
var swiperHome = new Swiper(".home-slider", {
  spaceBetween: 20,
  effect: "fade",
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
});

// Swiper for gadgets slider
var swiperspotlight = new Swiper(".spotlight-slider", {
  spaceBetween: 20,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  grabCursor: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    991: {
      slidesPerView: 3,
    },
  },
});
