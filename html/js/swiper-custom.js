/* ================= BAYONE SWIPER SLIDERS ================= */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof Swiper === "undefined") {
        console.warn("Swiper.js is not loaded.");
        return;
    }

    /* ========== SERVICES SLIDER ============ */

    const serviceSlider = document.querySelector(".services-slider");

    if (serviceSlider) {
        new Swiper(serviceSlider, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 700,
            grabCursor: true,
            watchOverflow: true,

            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },

            navigation: {
                nextEl: ".services-slider-next",
                prevEl: ".services-slider-prev"
            },

            pagination: {
                el: serviceSlider.querySelector(".swiper-pagination"),
                clickable: true
            },

            breakpoints: {
                576: {
                    slidesPerView: 1.5,
                    spaceBetween: 20
                },

                768: {
                    slidesPerView: 2,
                    spaceBetween: 24
                },

                992: {
                    slidesPerView: 3,
                    spaceBetween: 24
                },

                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }


/* ================= SERVICES SLIDER END HERE ================= */

/* ================= CASE STUDY SLIDER ================= */

    const caseStudySlider =
        document.querySelector(".case-study-slider");

    if (caseStudySlider) {
        new Swiper(caseStudySlider, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 700,
            grabCursor: true,
            watchOverflow: true,

            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },

            navigation: {
                nextEl: ".case-study-slider-next",
                prevEl: ".case-study-slider-prev"
            },

            pagination: {
                el: caseStudySlider.querySelector(
                    ".swiper-pagination"
                ),
                clickable: true
            },

            breakpoints: {
                576: {
                    slidesPerView: 1.5,
                    spaceBetween: 20
                },

                768: {
                    slidesPerView: 2,
                    spaceBetween: 24
                },

                992: {
                    slidesPerView: 3,
                    spaceBetween: 24
                },

                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }
/* ================= CASE STUDY SLIDER END HERE ================= */
}); /* ===== Script Main Function END HERE ====== */