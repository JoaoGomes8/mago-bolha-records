const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
});


const carousel = document.getElementById('carousel-inner');

function startAutoScroll() {
    setInterval(() => {
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            const cardWidth = carousel.querySelector('article').offsetWidth + 24; 
            carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    }, 5000); 
}

startAutoScroll();