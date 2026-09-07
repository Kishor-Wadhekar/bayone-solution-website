/**
 * =========================================================
 * BAYONE WEBSITE
 * Main JavaScript
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    console.log("BayOne website initialized.");


    const currentYear = document.querySelector("[data-current-year]");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /*
     * ---------------------------------------------------------
     * Header Scroll State
     * ---------------------------------------------------------
     *
     * Adds "is-scrolled" to the header after scrolling.
     * You can style this later when the final Figma design
     * is available.
     */

    const header = document.querySelector(".site-header");

    if (header) {

        const handleHeaderScroll = function () {

            if (window.scrollY > 20) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }

        };

        window.addEventListener("scroll", handleHeaderScroll);

        handleHeaderScroll();
    }


    /*
     * ---------------------------------------------------------
     * External Links
     * ---------------------------------------------------------
     *
     * Opens external links in a new tab.
     */

    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(function (link) {

        if (!link.hostname.includes(window.location.hostname)) {

            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");

        }

    });


    /*
     * ---------------------------------------------------------
     * Lazy Loading
     * ---------------------------------------------------------
     *
     * Add loading="lazy" to images that are below the fold.
     *
     * Hero images should normally NOT be lazy-loaded because
     * they are important for initial page rendering.
     */

    const lazyImages = document.querySelectorAll(
        'img[data-lazy="true"]'
    );

    lazyImages.forEach(function (image) {
        image.setAttribute("loading", "lazy");
    });


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const navigationMenu = document.querySelector("#mainNavigation");

if (navigationMenu) {

    const navigationLinks = navigationMenu.querySelectorAll(
        ".nav-link:not(.dropdown-toggle)"
    );

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth < 992 &&
                navigationMenu.classList.contains("show")
            ) {

                const bootstrapCollapse =
                    bootstrap.Collapse.getInstance(navigationMenu);

                if (bootstrapCollapse) {
                    bootstrapCollapse.hide();
                }

            }

        });

    });

}

/* =========================================================
   SEARCH
========================================================= */

const searchContainer = document.querySelector(".header-search");
const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#siteSearchForm");
const searchType = document.querySelector("#searchType");


/*
 * Open / Close Search
 */

if (searchContainer && searchToggle) {

    searchToggle.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen =
            searchContainer.classList.toggle("is-open");


        /* Update accessibility */

        searchToggle.setAttribute(
            "aria-expanded",
            isOpen.toString()
        );

        searchToggle.setAttribute(
            "aria-label",
            isOpen ? "Close search" : "Open search"
        );


        /* Focus search input */

        if (isOpen && searchInput) {

            setTimeout(function () {
                searchInput.focus();
            }, 100);

        }

    });

}


/*
 * Close Search When Clicking Outside
 */

document.addEventListener("click", function (event) {

    if (
        searchContainer &&
        !searchContainer.contains(event.target)
    ) {

        searchContainer.classList.remove("is-open");

        if (searchToggle) {

            searchToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            searchToggle.setAttribute(
                "aria-label",
                "Open search"
            );

        }

    }

});


/* =========================================================
   WEBSITE LOADER
========================================================= */

window.addEventListener("load", function () {

    const websiteLoader =
        document.querySelector("#websiteLoader");


    if (websiteLoader) {

        setTimeout(function () {

            websiteLoader.classList.add("is-hidden");

        }, 500);

    }

});

AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
    offset: 100,
    mirror: true
});


/* =========================================
   Back To Top + Scroll Progress
========================================= */

const backToTop = document.querySelector("#backToTop");
const progressCircle = document.querySelector("#progressCircle");
const scrollPercentage = document.querySelector("#scrollPercentage");

if (backToTop && progressCircle && scrollPercentage) {

    const radius = 25;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    function updateScrollProgress() {

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const scrollProgress =
            documentHeight > 0
                ? scrollTop / documentHeight
                : 0;

        const percentage = Math.round(scrollProgress * 100);

        // Update percentage
        scrollPercentage.textContent = `${percentage}%`;

        // Update circular progress
        const offset =
            circumference - (scrollProgress * circumference);

        progressCircle.style.strokeDashoffset = offset;

        // Show button after scrolling
        if (scrollTop > 200) {
            backToTop.classList.add("is-visible");
        } else {
            backToTop.classList.remove("is-visible");
        }
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();

    // Back to top
    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
}

/* =========================================================
   SMOOTH SCROLL - LENIS
========================================================= */

const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5
});


function raf(time) {

    lenis.raf(time);

    requestAnimationFrame(raf);

}


requestAnimationFrame(raf);

});


