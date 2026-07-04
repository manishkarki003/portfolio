// ==========================================
// Smooth scrolling for in-page anchors
// ==========================================
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

// ==========================================
// Mobile Navigation
// ==========================================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ==========================================
// Scroll Reveal Animation
// ==========================================
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
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

// ==========================================
// Contact Form (Resend)
// ==========================================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector("button");
  const formMessage = document.getElementById("form-message");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formMessage.textContent = "";
    formMessage.style.color = "";

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      project: document.getElementById("project").value.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        formMessage.style.color = "#22c55e";
        formMessage.textContent =
          "✅ Thank you! Your message has been sent successfully. I'll get back to you soon.";

        contactForm.reset();
      } else {
        formMessage.style.color = "#ef4444";
        formMessage.textContent =
          result.error || "❌ Failed to send your message.";
      }
    } catch (error) {
      console.error(error);

      formMessage.style.color = "#ef4444";
      formMessage.textContent =
        "❌ Something went wrong. Please try again later.";
    }

    submitButton.disabled = false;
    submitButton.textContent = "Send project details";
  });
}