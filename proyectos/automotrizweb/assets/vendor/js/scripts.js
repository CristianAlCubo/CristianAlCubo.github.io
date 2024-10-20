/*!
 * Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
 */
//
// Scripts
//

var SOCIAL_MEDIA_FIRST_APPEARING = true;

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    const pasgloLogo = document.body.querySelector("#pasgloLogo");
    const pasgloLogoAlt = document.body.querySelector("#pasgloLogoAlt");
    const socialSidebar = document.body.querySelector("#socialSidebar");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
      pasgloLogo.classList.remove("d-none");
      pasgloLogoAlt.classList.add("d-none");

      if (window.innerWidth >= 576) {
        if (SOCIAL_MEDIA_FIRST_APPEARING) {
          socialSidebar.classList.add("d-none");
        } else {
          socialSidebar.classList.remove("animate__fadeInLeft", "d-none");
          socialSidebar.classList.add(
            "animate__animated",
            "animate__fadeOutLeft",
            "animate__faster"
          );
        }
      }
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
      pasgloLogo.classList.add("d-none");
      pasgloLogoAlt.classList.remove("d-none");

      // Animation of social media sidebar
      SOCIAL_MEDIA_FIRST_APPEARING = false;
      if (window.innerWidth >= 576) {
        socialSidebar.classList.remove("d-none", "animate__fadeOutLeft");
        socialSidebar.classList.add(
          "animate__animated",
          "animate__fadeInLeft",
          "animate__faster"
        );
      }
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Activate SimpleLightbox plugin for portfolio items
  new SimpleLightbox({
    elements: "#portfolio a.portfolio-box",
  });
});
