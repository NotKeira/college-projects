// Screen Reader Announcements
function announceToScreenReader(message, priority = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus Management
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Focus first element
  firstFocusable.focus();
}

// Mobile menu toggle functionality with accessibility
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");

mobileMenuToggle.addEventListener("click", () => {
  const isExpanded = navMenu.classList.contains("active");

  if (isExpanded) {
    navMenu.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    announceToScreenReader("Navigation menu closed");
  } else {
    navMenu.classList.add("active");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    announceToScreenReader("Navigation menu opened");
  }

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
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");

    // Update aria-current for navigation
    navLinks.forEach((l) => l.removeAttribute("aria-current"));
    link.setAttribute("aria-current", "page");

    // Close mobile menu
    navMenu.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");

    // Announce navigation
    announceToScreenReader(`Navigating to ${link.textContent} section`);
  });
});

// Enhanced smooth scrolling for navigation links with announcements
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

      // Focus the target section for screen readers
      target.setAttribute("tabindex", "-1");
      target.focus();

      // Remove tabindex after focus
      setTimeout(() => {
        target.removeAttribute("tabindex");
      }, 1000);
    }
  });
});

// Header background opacity on scroll with reduced motion check
window.addEventListener("scroll", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    const header = document.querySelector(".header");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
      header.style.background = "rgba(10, 10, 10, 0.95)";
    } else {
      header.style.background = "rgba(10, 10, 10, 0.85)";
    }
  }
});

// Modal functionality with full accessibility
let lastFocusedElement = null;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    // Store the currently focused element
    lastFocusedElement = document.activeElement;

    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Add a slight delay for animation
    setTimeout(() => {
      modal.classList.add("show");

      // Trap focus in modal
      trapFocus(modal);

      // Announce modal opening
      const modalTitle = modal.querySelector("h2").textContent;
      announceToScreenReader(`Opened dialog: ${modalTitle}`, "assertive");
    }, 10);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";

    // Wait for animation to complete before hiding
    setTimeout(() => {
      modal.style.display = "none";

      // Return focus to the element that opened the modal
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }

      announceToScreenReader("Dialog closed", "assertive");
    }, 300);
  }
}

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    const modalId = event.target.id;
    closeModal(modalId);
  }
});

// Enhanced keyboard navigation for modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    // Close mobile menu if open
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      const icon = mobileMenuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
      mobileMenuToggle.focus();
      announceToScreenReader("Navigation menu closed");
    }

    // Close any open modals
    const openModals = document.querySelectorAll(".modal[style*='block']");
    openModals.forEach((modal) => {
      closeModal(modal.id);
    });
  }
});

// Enhanced contact form handling with accessibility
const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("form-status");

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const field = document.getElementById(fieldName);

  if (errorElement && field) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", `${fieldName}-error`);
  }
}

function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const field = document.getElementById(fieldName);

  if (errorElement && field) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    field.setAttribute("aria-invalid", "false");
    field.removeAttribute("aria-describedby");
  }
}

function clearAllErrors() {
  ["name", "email", "subject", "message"].forEach(clearFieldError);
}

// Real-time form validation
["name", "email", "subject", "message"].forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  if (field) {
    field.addEventListener("blur", () => {
      if (field.value.trim() === "") {
        showFieldError(
          fieldName,
          `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`
        );
      } else {
        clearFieldError(fieldName);
      }
    });

    field.addEventListener("input", () => {
      if (field.value.trim() !== "") {
        clearFieldError(fieldName);
      }
    });
  }
});

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  clearAllErrors();

  // Get form data
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  let hasErrors = false;

  // Validate fields
  if (!name || name.trim() === "") {
    showFieldError("name", "Name is required");
    hasErrors = true;
  }

  if (!email || email.trim() === "") {
    showFieldError("email", "Email is required");
    hasErrors = true;
  } else {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError("email", "Please enter a valid email address");
      hasErrors = true;
    }
  }

  if (!subject || subject.trim() === "") {
    showFieldError("subject", "Subject is required");
    hasErrors = true;
  }

  if (!message || message.trim() === "") {
    showFieldError("message", "Message is required");
    hasErrors = true;
  }

  if (hasErrors) {
    // Focus first error field
    const firstError = document.querySelector(".error-message.show");
    if (firstError) {
      const fieldId = firstError.id.replace("-error", "");
      const field = document.getElementById(fieldId);
      if (field) {
        field.focus();
        announceToScreenReader(
          "Please correct the errors in the form",
          "assertive"
        );
      }
    }
    return;
  }

  // Simulate form submission
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
  submitButton.disabled = true;
  submitButton.setAttribute("aria-describedby", "form-status");

  formStatus.textContent = "Sending your message...";
  announceToScreenReader("Sending your message", "assertive");

  // Simulate API delay
  setTimeout(() => {
    formStatus.textContent =
      "Thank you for your message! I'll get back to you soon.";
    announceToScreenReader(
      "Message sent successfully! Thank you for contacting James Marriott",
      "assertive"
    );

    contactForm.reset();
    clearAllErrors();

    submitButton.textContent = originalText;
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-describedby");

    // Clear status after 5 seconds
    setTimeout(() => {
      formStatus.textContent = "";
    }, 5000);
  }, 2000);
});

// Enhanced notification system with screen reader support
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "assertive");
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
  `;

  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${
      type === "success"
        ? "linear-gradient(135deg, #10b981, #059669)"
        : type === "error"
        ? "linear-gradient(135deg, #ef4444, #dc2626)"
        : "linear-gradient(135deg, #3b82f6, #2563eb)"
    };
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 3000;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  // Add to document
  document.body.appendChild(notification);

  // Announce to screen reader
  announceToScreenReader(message, "assertive");

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Fade in animation on scroll with intersection observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");

      // Announce section entry for screen readers
      const sectionTitle = entry.target.querySelector("h2, h3, .section-title");
      if (sectionTitle) {
        announceToScreenReader(`Entered ${sectionTitle.textContent} section`);
      }
    }
  });
}, observerOptions);

// Enhanced parallax effect with reduced motion check
window.addEventListener("scroll", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    const scrolled = window.pageYOffset;
    const heroGradient = document.querySelector(".hero-gradient");

    if (heroGradient) {
      heroGradient.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }
});

// Preload critical resources with error handling
function preloadResources() {
  // Preload Font Awesome icons
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "preload";
  fontAwesome.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  fontAwesome.as = "style";
  fontAwesome.onload = function () {
    this.rel = "stylesheet";
    announceToScreenReader("Icons loaded", "polite");
  };
  fontAwesome.onerror = function () {
    console.warn("Failed to load Font Awesome icons");
  };
  document.head.appendChild(fontAwesome);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  preloadResources();

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".album-card, .merch-item, .news-item"
  );
  animateElements.forEach((el) => observer.observe(el));

  // Add loading animation
  document.body.classList.add("loaded");

  // Announce page load completion
  announceToScreenReader(
    "James Marriott website loaded. Use the navigation menu to explore different sections.",
    "polite"
  );

  // Initialize any other features
  console.log(
    "James Marriott website loaded successfully with full accessibility support!"
  );
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav") && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    announceToScreenReader("Navigation menu closed");
  }
});

// Performance optimisations with accessibility considerations
function optimizePerformance() {
  // Lazy load images when they're implemented
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);

        // Announce image load for screen readers if it has alt text
        if (img.alt) {
          announceToScreenReader(`Image loaded: ${img.alt}`, "polite");
        }
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Scroll event handling here
    }, 10);
  });
}

// Initialize performance optimisations
document.addEventListener("DOMContentLoaded", optimizePerformance);

// Add loading state management with accessibility
const loadingStyles = document.createElement("style");
loadingStyles.textContent = `
  body:not(.loaded) * {
    animation-play-state: paused !important;
  }
  
  .loaded {
    animation: fadeInPage 0.5s ease-in;
  }
  
  @keyframes fadeInPage {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  
  .notification-close:hover,
  .notification-close:focus {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
document.head.appendChild(loadingStyles);
