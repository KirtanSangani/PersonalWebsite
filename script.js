// Smooth scroll with header offset
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const navList = document.querySelector(".nav-links");
const navToggle = document.querySelector(".nav-toggle");

function getHeaderOffset() {
  return header ? header.offsetHeight + 8 : 0;
}

function scrollToSection(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const offset = window.pageYOffset + rect.top - getHeaderOffset();

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    e.preventDefault();
    scrollToSection(href);

    if (navList.classList.contains("open")) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Mobile nav
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Active section highlighting in nav + About text animation
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        const correspondingLink = document.querySelector(
          `.nav-links a[href="#${id}"]`
        );
        if (!correspondingLink) return;

        if (entry.isIntersecting) {
          document
            .querySelectorAll(".nav-links a.active")
            .forEach((el) => el.classList.remove("active"));
          correspondingLink.classList.add("active");
        }

        if (entry.isIntersecting && id === "about") {
          document
            .querySelectorAll("#about .about-body")
            .forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("revealed");
              }, index * 120);
            });
        }
      });
    },
    {
      rootMargin: "-55% 0px -40% 0px",
      threshold: 0.2,
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  // Fallback: show About text without scroll trigger
  document
    .querySelectorAll("#about .about-body")
    .forEach((el) => el.classList.add("revealed"));
}

// Set current year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Hero typing animation, then reveal underline + subtitle
const introTypedTarget = document.getElementById("hero-intro-typed");
const nameTypedTarget = document.getElementById("hero-typed");
const heroAfter = document.getElementById("hero-after");
const heroCursor = document.querySelector(".hero .typed-cursor");

function typeText({ target, text, delayMs = 5000, onDone }) {
  if (!target) return;
  let index = 0;

  function step() {
    if (index <= text.length) {
      target.textContent = text.slice(0, index);
      index += 1;
      setTimeout(step, delayMs);
    } else if (onDone) {
      onDone();
    }
  }

  step();
}

window.addEventListener("load", () => {
  typeText({
    target: introTypedTarget,
    text: "Hello, my name is",
    delayMs: 55,
    onDone: () => {
      if (heroCursor) {
        const nameRow = nameTypedTarget?.parentElement;
        if (nameRow && nameRow.contains(heroCursor) === false) {
          nameRow.appendChild(heroCursor);
        }
      }

      typeText({
        target: nameTypedTarget,
        text: "Kirtan Sangani",
        delayMs: 80,
        onDone: () => {
          if (heroCursor) {
            heroCursor.remove();
          }
          if (heroAfter) {
            heroAfter.classList.add("visible");
            heroAfter.setAttribute("aria-hidden", "false");
          }
        },
      });
    },
  });
});

// About section circular slideshow
const aboutSlideshowImg = document.getElementById("about-slideshow-image");
if (aboutSlideshowImg) {
  const aboutSlides = [
    "assets/slideshow/photo1.jpg",
    "assets/slideshow/photo2.JPEG",
    "assets/slideshow/photo3.jpg",
    "assets/slideshow/photo4.jpg",
    "assets/slideshow/photo5.JPEG",
    "assets/slideshow/photo6.jpg",
  ];

  let aboutIndex = 0;
  const slideIntervalMs = 4000;
  let aboutTimerId = null;

  function setAboutSlide(index) {
    const nextSrc = aboutSlides[index];

    // Start fade out
    aboutSlideshowImg.classList.add("is-fading-out");

    // After fade-out, swap src and fade back in
    setTimeout(() => {
      aboutSlideshowImg.src = nextSrc;
      aboutSlideshowImg.onload = () => {
        requestAnimationFrame(() => {
          aboutSlideshowImg.classList.remove("is-fading-out");
        });
      };
    }, 200);
  }

  function showNextAboutSlide() {
    aboutIndex = (aboutIndex + 1) % aboutSlides.length;
    setAboutSlide(aboutIndex);
  }

  function showPrevAboutSlide() {
    aboutIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
    setAboutSlide(aboutIndex);
  }

  function resetAboutTimer() {
    if (aboutTimerId) {
      clearInterval(aboutTimerId);
    }
    aboutTimerId = setInterval(showNextAboutSlide, slideIntervalMs);
  }

  const prevBtn = document.querySelector(".about-slide-arrow-left");
  const nextBtn = document.querySelector(".about-slide-arrow-right");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showPrevAboutSlide();
      resetAboutTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showNextAboutSlide();
      resetAboutTimer();
    });
  }

  aboutTimerId = setInterval(showNextAboutSlide, slideIntervalMs);
}

