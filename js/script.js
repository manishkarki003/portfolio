// Smooth scrolling for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    const navMenu = document.getElementById("navMenu");
    const navToggle = document.getElementById("navToggle");
    if (navMenu && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Typing effect in the hero terminal
const typedOutEl = document.getElementById("typedOut");

function typeText(el, text, speed = 45) {
  if (!el) return;
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    }
  }
  step();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typedOutEl) {
  const message = "Manish Karki — Python/Django backend developer";
  if (prefersReducedMotion) {
    typedOutEl.textContent = message;
  } else {
    setTimeout(() => typeText(typedOutEl, message), 400);
  }
}
