/**
 * =========================================================
 * BAYONE WEBSITE
 * Main JavaScript
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    console.log("BayOne website initialized.");


    /* =========================================================
       01. CURRENT YEAR
    ========================================================= */

    const currentYear = document.querySelector(
        "[data-current-year]"
    );

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =========================================================
       02. HEADER SCROLL STATE
       ---------------------------------------------------------
       Adds "is-scrolled" class to the header after scrolling.
    ========================================================= */

    const header = document.querySelector(
        ".site-header"
    );

    if (header) {

        const handleHeaderScroll = function () {

            if (window.scrollY > 20) {

                header.classList.add(
                    "is-scrolled"
                );

            } else {

                header.classList.remove(
                    "is-scrolled"
                );

            }

        };

        window.addEventListener(
            "scroll",
            handleHeaderScroll,
            { passive: true }
        );

        handleHeaderScroll();

    }


   /* =========================================================
   03. DESKTOP DROPDOWN - MOUSE HOVER
   ---------------------------------------------------------
   Desktop  : Open dropdown on mouse hover
   Mobile   : Bootstrap click/tap behavior
========================================================= */

const dropdownItems =
    document.querySelectorAll(
        ".navbar-nav .dropdown"
    );

dropdownItems.forEach(function (dropdown) {

    const dropdownToggle =
        dropdown.querySelector(
            ".dropdown-toggle"
        );

    const dropdownMenu =
        dropdown.querySelector(
            ".dropdown-menu"
        );

    if (
        !dropdownToggle ||
        !dropdownMenu
    ) {
        return;
    }


    let closeTimer;


    /* ---------------------------------------------------------
       Mouse Enter
    --------------------------------------------------------- */

    dropdown.addEventListener(
        "mouseenter",
        function () {

            /* Desktop only */

            if (window.innerWidth < 992) {
                return;
            }


            /* Cancel pending close */

            clearTimeout(closeTimer);


            /* Open dropdown */

            dropdown.classList.add("show");

            dropdownToggle.classList.add("show");

            dropdownToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            dropdownMenu.classList.add("show");

        }
    );


    /* ---------------------------------------------------------
       Mouse Leave
    --------------------------------------------------------- */

    dropdown.addEventListener(
        "mouseleave",
        function () {

            /* Desktop only */

            if (window.innerWidth < 992) {
                return;
            }


            /*
             * Small delay allows the mouse to move
             * from the menu item to the dropdown.
             */

            closeTimer = setTimeout(
                function () {

                    dropdown.classList.remove(
                        "show"
                    );

                    dropdownToggle.classList.remove(
                        "show"
                    );

                    dropdownToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    dropdownMenu.classList.remove(
                        "show"
                    );

                },
                150
            );

        }
    );

});

    /* =========================================================
       04. MOBILE NAVIGATION
       ---------------------------------------------------------
       Normal menu links close the mobile navigation.

       Dropdown toggle links are excluded so Bootstrap can
       handle their click/tap behavior.
    ========================================================= */

    const navigationMenu =
        document.querySelector(
            "#mainNavigation"
        );

    if (navigationMenu) {

        const navigationLinks =
            navigationMenu.querySelectorAll(
                ".nav-link:not(.dropdown-toggle)"
            );

        navigationLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth < 992 &&
                        navigationMenu.classList.contains(
                            "show"
                        )
                    ) {

                        if (
                            typeof bootstrap !==
                            "undefined"
                        ) {

                            const bootstrapCollapse =
                                bootstrap.Collapse
                                    .getInstance(
                                        navigationMenu
                                    );

                            if (bootstrapCollapse) {

                                bootstrapCollapse.hide();

                            }

                        }

                    }

                }
            );

        });

    }


    /* =========================================================
       05. EXTERNAL LINKS
       ---------------------------------------------------------
       Opens external links in a new browser tab.
    ========================================================= */

    const links =
        document.querySelectorAll(
            'a[href^="http"]'
        );

    links.forEach(function (link) {

        if (
            link.hostname &&
            !link.hostname.includes(
                window.location.hostname
            )
        ) {

            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });


    /* =========================================================
       06. LAZY LOADING
       ---------------------------------------------------------
       Images with data-lazy="true" will use lazy loading.

       Example:
       <img src="image.jpg" data-lazy="true" alt="">
    ========================================================= */

    const lazyImages =
        document.querySelectorAll(
            'img[data-lazy="true"]'
        );

    lazyImages.forEach(function (image) {

        image.setAttribute(
            "loading",
            "lazy"
        );

    });


    /* =========================================================
       07. HEADER SEARCH
    ========================================================= */

    const searchContainer =
        document.querySelector(
            ".header-search"
        );

    const searchToggle =
        document.querySelector(
            ".search-toggle"
        );

    const searchInput =
        document.querySelector(
            "#searchInput"
        );

    const searchForm =
        document.querySelector(
            "#siteSearchForm"
        );

    const searchType =
        document.querySelector(
            "#searchType"
        );


    /* ---------------------------------------------------------
       07.1 OPEN / CLOSE SEARCH
    --------------------------------------------------------- */

    if (
        searchContainer &&
        searchToggle
    ) {

        searchToggle.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const isOpen =
                    searchContainer.classList.toggle(
                        "is-open"
                    );


                /* Accessibility */

                searchToggle.setAttribute(
                    "aria-expanded",
                    isOpen.toString()
                );

                searchToggle.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close search"
                        : "Open search"
                );


                /* Focus search input */

                if (
                    isOpen &&
                    searchInput
                ) {

                    setTimeout(
                        function () {

                            searchInput.focus();

                        },
                        100
                    );

                }

            }
        );

    }


    /* ---------------------------------------------------------
       07.2 CLOSE SEARCH WHEN CLICKING OUTSIDE
    --------------------------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            if (
                searchContainer &&
                !searchContainer.contains(
                    event.target
                )
            ) {

                searchContainer.classList.remove(
                    "is-open"
                );

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

        }
    );


    /* ---------------------------------------------------------
       07.3 SEARCH FORM
       ---------------------------------------------------------
       Temporary search behavior.

       This can later be connected to the actual search page/API.
    --------------------------------------------------------- */

    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const searchValue =
                    searchInput
                        ? searchInput.value.trim()
                        : "";

                const selectedType =
                    searchType
                        ? searchType.value
                        : "all";


                if (!searchValue) {

                    if (searchInput) {
                        searchInput.focus();
                    }

                    return;

                }


                /*
                 * Temporary search URL
                 *
                 * Example:
                 * search.html?q=artificial&type=services
                 */

                const searchURL =
                    "search.html?q=" +
                    encodeURIComponent(
                        searchValue
                    ) +
                    "&type=" +
                    encodeURIComponent(
                        selectedType
                    );


                window.location.href =
                    searchURL;

            }
        );

    }


    /* =========================================================
       08. WEBSITE LOADER
    ========================================================= */

    window.addEventListener(
        "load",
        function () {

            const websiteLoader =
                document.querySelector(
                    "#websiteLoader"
                );

            if (websiteLoader) {

                setTimeout(
                    function () {

                        websiteLoader.classList.add(
                            "is-hidden"
                        );

                    },
                    500
                );

            }

        }
    );


    /* =========================================================
       09. AOS ANIMATION
       ---------------------------------------------------------
       once: false
       -> Animation can run again.

       mirror: true
       -> Animation works while scrolling back.

       This gives the repeated animation effect you requested.
    ========================================================= */

    if (
        typeof AOS !== "undefined"
    ) {

        AOS.init({

            duration: 800,

            easing: "ease-out",

            once: false,

            offset: 100,

            mirror: true,

            anchorPlacement:
                "top-bottom"

        });

    }


    /* =========================================================
       10. BACK TO TOP + SCROLL PROGRESS
    ========================================================= */

    const backToTop =
        document.querySelector(
            "#backToTop"
        );

    const progressCircle =
        document.querySelector(
            "#progressCircle"
        );

    const scrollPercentage =
        document.querySelector(
            "#scrollPercentage"
        );


    if (
        backToTop &&
        progressCircle &&
        scrollPercentage
    ) {

        const radius = 25;

        const circumference =
            2 * Math.PI * radius;


        /* -----------------------------------------------------
           Initial Circle
        ----------------------------------------------------- */

        progressCircle.style.strokeDasharray =
            circumference;

        progressCircle.style.strokeDashoffset =
            circumference;


        /* -----------------------------------------------------
           Update Scroll Progress
        ----------------------------------------------------- */

        function updateScrollProgress() {

            const scrollTop =
                window.scrollY;


            const documentHeight =
                document.documentElement
                    .scrollHeight -
                window.innerHeight;


            const scrollProgress =
                documentHeight > 0
                    ? scrollTop /
                    documentHeight
                    : 0;


            const percentage =
                Math.round(
                    scrollProgress * 100
                );


            /* Percentage */

            scrollPercentage.textContent =
                `${percentage}%`;


            /* Circular Progress */

            const offset =
                circumference -
                (
                    scrollProgress *
                    circumference
                );

            progressCircle.style.strokeDashoffset =
                offset;


            /* Show / Hide Back To Top */

            if (scrollTop > 200) {

                backToTop.classList.add(
                    "is-visible"
                );

            } else {

                backToTop.classList.remove(
                    "is-visible"
                );

            }

        }


        /* Scroll Event */

        window.addEventListener(
            "scroll",
            updateScrollProgress,
            { passive: true }
        );


        /* Initial State */

        updateScrollProgress();


        /* -----------------------------------------------------
           Back To Top Click
        ----------------------------------------------------- */

        backToTop.addEventListener(
            "click",
            function () {

                /*
                 * Use Lenis if available.
                 * Otherwise use native smooth scroll.
                 */

                if (
                    window.bayoneLenis
                ) {

                    window.bayoneLenis.scrollTo(
                        0
                    );

                } else {

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }

            }
        );

    }


    /* =========================================================
       11. SMOOTH SCROLL - LENIS
    ========================================================= */

    if (
        typeof Lenis !== "undefined"
    ) {

        const lenis =
            new Lenis({

                duration: 1.2,

                smoothWheel: true,

                wheelMultiplier: 1,

                touchMultiplier: 1.5

            });


        /*
         * Store Lenis globally so other sections,
         * such as Back To Top, can use it.
         */

        window.bayoneLenis =
            lenis;


        /* -----------------------------------------------------
           Lenis Animation Frame
        ----------------------------------------------------- */

        function raf(time) {

            lenis.raf(time);

            requestAnimationFrame(
                raf
            );

        }


        requestAnimationFrame(
            raf
        );

    }


    /* =========================================================
       12. WINDOW RESIZE
       ---------------------------------------------------------
       If user changes from mobile to desktop or desktop to
       mobile, Bootstrap remains responsible for the actual
       navigation behavior.
    ========================================================= */

    window.addEventListener(
        "resize",
        function () {

            /*
             * No custom dropdown action required here.
             *
             * Bootstrap handles mobile navigation.
             * Our hover listeners only activate when
             * window.innerWidth >= 992.
             */

        }
    );


});