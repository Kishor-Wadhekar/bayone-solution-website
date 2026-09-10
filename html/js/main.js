/* ================= BAYONE WEBSITE MAIN JAVASCRIPT ================= */

document.addEventListener("DOMContentLoaded", function () {
    console.log("BayOne website initialized.");

    /* 1. Current Year */
    const currentYear = document.querySelector("[data-current-year]");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 2. Header Scroll State */
    const header = document.querySelector(".site-header");

    if (header) {
        const handleHeaderScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 20);
        };

        window.addEventListener("scroll", handleHeaderScroll, {
            passive: true
        });

        handleHeaderScroll();
    }

    /* 3. Desktop Dropdown */
    const dropdownItems = document.querySelectorAll(
        ".navbar-nav .dropdown"
    );

    dropdownItems.forEach((dropdown) => {
        const dropdownToggle = dropdown.querySelector(
            ".nav-dropdown-toggle"
        );

        const dropdownMenu = dropdown.querySelector(
            ".dropdown-menu"
        );

        if (!dropdownToggle || !dropdownMenu) return;

        let closeTimer;

        /* Open Dropdown */
        const openDropdown = () => {
            clearTimeout(closeTimer);

            dropdown.classList.add("show");
            dropdownMenu.classList.add("show");

            dropdownToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        };

        /* Close Dropdown */
        const closeDropdown = () => {
            clearTimeout(closeTimer);

            closeTimer = setTimeout(() => {
                dropdown.classList.remove("show");
                dropdownMenu.classList.remove("show");

                dropdownToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }, 150);
        };

        /* Desktop - Mouse Enter */
        dropdown.addEventListener("mouseenter", () => {
            if (window.innerWidth >= 992) {
                openDropdown();
            }
        });

        /* Desktop - Mouse Leave */
        dropdown.addEventListener("mouseleave", () => {
            if (window.innerWidth >= 992) {
                closeDropdown();
            }
        });

        /* Desktop - Arrow Click */
        dropdownToggle.addEventListener("click", (event) => {
            if (window.innerWidth < 992) return;

            event.preventDefault();
            event.stopPropagation();

            if (dropdown.classList.contains("show")) {
                closeDropdown();
            } else {
                /* Close Other Dropdowns */
                dropdownItems.forEach((otherDropdown) => {
                    if (otherDropdown === dropdown) return;

                    otherDropdown.classList.remove("show");

                    const otherToggle =
                        otherDropdown.querySelector(
                            ".nav-dropdown-toggle"
                        );

                    const otherMenu =
                        otherDropdown.querySelector(
                            ".dropdown-menu"
                        );

                    if (otherToggle) {
                        otherToggle.classList.remove("show");

                        otherToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }

                    if (otherMenu) {
                        otherMenu.classList.remove("show");
                    }
                });

                openDropdown();
            }
        });
    });

    /* 4. Active Navigation */
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const mainNavLinks = document.querySelectorAll(
        "#mainNavigation .navbar-nav > .nav-item > .nav-link"
    );

    mainNavLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        link.classList.remove("active");

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.classList.add("active");
        }
    });

    /* 5. Mobile Navigation */
    const navigationMenu =
        document.querySelector("#mainNavigation");

    if (navigationMenu) {
        const navigationLinks =
            navigationMenu.querySelectorAll(
                ".nav-link:not(.dropdown-toggle)"
            );

        navigationLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (
                    window.innerWidth < 992 &&
                    navigationMenu.classList.contains("show") &&
                    typeof bootstrap !== "undefined"
                ) {
                    const bootstrapCollapse =
                        bootstrap.Collapse.getInstance(
                            navigationMenu
                        );

                    if (bootstrapCollapse) {
                        bootstrapCollapse.hide();
                    }
                }
            });
        });
    }

    /* 6. External Links */
    document
        .querySelectorAll('a[href^="http"]')
        .forEach((link) => {
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

    /* 7. Lazy Loading */
    document
        .querySelectorAll('img[data-lazy="true"]')
        .forEach((image) => {
            image.setAttribute(
                "loading",
                "lazy"
            );
        });

    /* 8. Header Search */
    const searchContainer =
        document.querySelector(".header-search");

    const searchToggle =
        document.querySelector(".search-toggle");

    const searchInput =
        document.querySelector("#searchInput");

    const searchForm =
        document.querySelector("#siteSearchForm");

    const searchType =
        document.querySelector("#searchType");

    const searchClear =
        document.querySelector(".search-clear");

    /* Search Input */
    if (
        searchInput &&
        searchClear &&
        searchForm
    ) {
        searchInput.addEventListener(
            "input",
            () => {
                searchForm.classList.toggle(
                    "has-text",
                    searchInput.value.trim().length > 0
                );
            }
        );

        searchClear.addEventListener(
            "click",
            () => {
                searchInput.value = "";

                searchForm.classList.remove(
                    "has-text"
                );

                searchInput.focus();
            }
        );
    }

    /* Open / Close Search */
    if (
        searchContainer &&
        searchToggle
    ) {
        searchToggle.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();

                const isOpen =
                    searchContainer.classList.toggle(
                        "is-open"
                    );

                searchToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );

                searchToggle.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close search"
                        : "Open search"
                );

                if (
                    isOpen &&
                    searchInput
                ) {
                    setTimeout(
                        () => searchInput.focus(),
                        100
                    );
                }
            }
        );
    }

    /* Close Search Outside */
    document.addEventListener(
        "click",
        (event) => {
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

    /* Search Form */
    if (searchForm) {
        searchForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const searchValue = searchInput
                    ? searchInput.value.trim()
                    : "";

                const selectedType = searchType
                    ? searchType.value
                    : "all";

                if (!searchValue) {
                    if (searchInput) {
                        searchInput.focus();
                    }

                    return;
                }

                const searchURL =
                    "search.html?q=" +
                    encodeURIComponent(searchValue) +
                    "&type=" +
                    encodeURIComponent(selectedType);

                window.location.href = searchURL;
            }
        );
    }

    /* 9. Website Loader */
    window.addEventListener("load", () => {
        const websiteLoader =
            document.querySelector("#websiteLoader");

        if (websiteLoader) {
            setTimeout(() => {
                websiteLoader.classList.add(
                    "is-hidden"
                );
            }, 500);
        }
    });

    /* 10. Future Works Link */
    const futureWorksLink =
        document.querySelector(
            ".future-works-link"
        );

    if (futureWorksLink) {
        const page =
            window.location.pathname
                .split("/")
                .pop() || "index.html";

        const pageLinks = {
            "index.html": "index.html",
            "services.html": "services.html",
            "industries.html": "industries.html",
            "about-us.html": "about-us.html",
            "careers.html": "careers.html",
            "insights.html": "insights.html"
        };

        futureWorksLink.href =
            pageLinks[page] || "#";
    }

    /* 11. AOS Animation */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out",
            once: false,
            offset: 100,
            mirror: true,
            anchorPlacement: "top-bottom"
        });
    }

    /* 12. Back To Top + Scroll Progress */
    const backToTop =
        document.querySelector("#backToTop");

    const progressCircle =
        document.querySelector("#progressCircle");

    const scrollPercentage =
        document.querySelector("#scrollPercentage");

    if (
        backToTop &&
        progressCircle &&
        scrollPercentage
    ) {
        const radius = 25;
        const circumference =
            2 * Math.PI * radius;

        progressCircle.style.strokeDasharray =
            circumference;

        progressCircle.style.strokeDashoffset =
            circumference;

        function updateScrollProgress() {
            const scrollTop =
                window.scrollY;

            const documentHeight =
                document.documentElement
                    .scrollHeight -
                window.innerHeight;

            const scrollProgress =
                documentHeight > 0
                    ? scrollTop / documentHeight
                    : 0;

            const percentage =
                Math.round(
                    scrollProgress * 100
                );

            scrollPercentage.textContent =
                `${percentage}%`;

            progressCircle.style.strokeDashoffset =
                circumference -
                scrollProgress *
                circumference;

            backToTop.classList.toggle(
                "is-visible",
                scrollTop > 200
            );
        }

        window.addEventListener(
            "scroll",
            updateScrollProgress,
            {
                passive: true
            }
        );

        updateScrollProgress();

        backToTop.addEventListener(
            "click",
            () => {
                if (window.bayoneLenis) {
                    window.bayoneLenis.scrollTo(0);
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            }
        );
    }

    /* 13. Smooth Scroll - Lenis */
    if (typeof Lenis !== "undefined") {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5
        });

        window.bayoneLenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
});
