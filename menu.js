/* =====================================================
   TCL TRUCKERSMP CASH LEAGUE
   MENU.JS
===================================================== */

"use strict";

/* ===========================================
   ELEMENTS
=========================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const header = document.querySelector(".site-header");

/* ===========================================
   MOBILE MENU
=========================================== */

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        menuToggle.innerHTML =
            navMenu.classList.contains("active")
                ? "✖"
                : "☰";

    });

}

/* ===========================================
   CLOSE MENU AFTER CLICK
=========================================== */

document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 900) {

            navMenu.classList.remove("active");

            menuToggle.innerHTML = "☰";

        }

    });

});

/* ===========================================
   STICKY NAVIGATION
=========================================== */

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/* ===========================================
   ACTIVE PAGE
=========================================== */

const currentPage =
window.location.pathname.split("/").pop();

document.querySelectorAll("#navMenu a").forEach(link => {

    const href = link.getAttribute("href");

    if (!href) return;

    if (
        href.endsWith(currentPage) ||
        (currentPage === "" && href === "index.html")
    ) {

        link.classList.add("active");

    }

});

/* ===========================================
   ESC KEY CLOSE MENU
=========================================== */

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        if (navMenu) {

            navMenu.classList.remove("active");

        }

        if (menuToggle) {

            menuToggle.innerHTML = "☰";

        }

    }

});

/* ===========================================
   WINDOW RESIZE
=========================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {

        if (navMenu) {

            navMenu.classList.remove("active");

        }

        if (menuToggle) {

            menuToggle.innerHTML = "☰";

        }

    }

});

console.log("✅ Menu Loaded");