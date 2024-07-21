// script.js
document.addEventListener('DOMContentLoaded', function() {
    const slideBox = document.getElementById('slide-box');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.slide-dot');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideWidth = slides[0].clientWidth;

    // Update the active dot
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Move to a specific slide
    function goToSlide(index) {
        slideBox.style.transform = `translateX(-${index * slideWidth}px)`;
        currentSlide = index;
        updateDots();
    }

    // Go to the next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0); // Loop back to the first slide
        }
    }

    // Go to the previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(totalSlides - 1); // Loop back to the last slide
        }
    }

    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Initialize the slider
    goToSlide(0);
});

// imgHover.js
document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.slide');

    imageContainers.forEach(container => {
        const anchor = container.querySelector('a');
        const img = container.querySelector('a>img');
        const defaultSrc = img.src;
        const hoverSrc = container.getAttribute('data-hover');
        const clickSrc = container.getAttribute('data-click');

        if(anchor.classList.contains('ready')) {
            container.addEventListener('mouseenter', () => {
                img.src = hoverSrc || clickSrc; // hoverSrc가 없을 경우 clickSrc 사용
            });
    
            container.addEventListener('mouseleave', () => {
                img.src = defaultSrc;
            });
    
            container.addEventListener('mousedown', () => {
                img.src = clickSrc;
                img.style.position = 'relative';
                img.style.top = '2px';
            });

            container.addEventListener('mouseup', () => {
                img.src = clickSrc;
                img.style.position = 'relative';
                img.style.top = '0';
            });
        } else if (anchor.classList.contains('not-ready')) {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                alert("준비중입니다. 다른 컨텐츠를 이용해주세요.");
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const notReadyAnchors = document.querySelectorAll('.slide a.not-ready');

    notReadyAnchors.forEach(anchor => {
        const img = anchor.querySelector('img');
        if (img) {
            img.style.filter = 'grayscale(100%)';
        }
    });
});