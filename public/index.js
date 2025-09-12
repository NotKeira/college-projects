// Mobile menu toggle functionality
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");

mobileMenuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Toggle hamburger icon
  const icon = mobileMenuToggle.querySelector("i");
  if (navMenu.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Header background opacity on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    header.style.background = "rgba(0, 0, 0, 0.95)";
  } else {
    header.style.background = "rgba(0, 0, 0, 0.9)";
  }
});

// Contact form handling
const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields.");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Simulate form submission (replace with actual API call later)
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  // Simulate API delay
  setTimeout(() => {
    alert("Thank you for your message! I'll get back to you soon.");
    contactForm.reset();
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 1500);
});

// Fade in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".album-card, .merch-item, .news-item"
  );
  animateElements.forEach((el) => observer.observe(el));
});

// Preload critical images (placeholder for future image implementation)
function preloadImages() {
  // This will be useful when actual images are added
  const imageUrls = [
    // Add actual image URLs here when implemented
  ];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Add any initialization code here
  preloadImages();
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav") && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});
