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

// Scroll-reveal: fade/slide elements in as they enter the viewport.
// Lightweight (one shared observer, no layout thrashing) and respects
// prefers-reduced-motion via the CSS transition-duration override.
const revealTargets = document.querySelectorAll(".reveal");

if (revealTargets.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // No IntersectionObserver support (or nothing to reveal): show everything immediately.
  revealTargets.forEach((el) => el.classList.add("in-view"));
}
