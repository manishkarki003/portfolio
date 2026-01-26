/*
==========================================================================
SCRIPT.JS - Manish Karki Portfolio
==========================================================================

This file contains all JavaScript functionality:
1. Mobile Navigation (Hamburger Menu)
2. Smooth Scrolling for Anchor Links
3. Active Nav Link Highlighting
4. Scroll Reveal Animations (IntersectionObserver)
5. Project Filtering
6. Contact Form Validation
7. EmailJS Integration (placeholder - configure with your keys)

EMAILJS SETUP INSTRUCTIONS:
1. Go to https://www.emailjs.com/ and create a free account
2. Create an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
4. Get your Public Key from Account > API Keys
5. Replace the placeholder values below:
   - EMAILJS_PUBLIC_KEY: Your public key
   - EMAILJS_SERVICE_ID: Your email service ID
   - EMAILJS_TEMPLATE_ID: Your email template ID

==========================================================================
*/

// ==========================================================================
// CONFIGURATION - Update these values for EmailJS
// ==========================================================================
const CONFIG = {
    // EmailJS Configuration - Replace with your actual values
    EMAILJS_PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // Get from EmailJS Dashboard > Account > API Keys
    EMAILJS_SERVICE_ID: 'YOUR_SERVICE_ID',          // Get from EmailJS Dashboard > Email Services
    EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID',        // Get from EmailJS Dashboard > Email Templates
    
    // Animation settings
    REVEAL_THRESHOLD: 0.1,  // How much of element must be visible to trigger (0-1)
    REVEAL_ROOT_MARGIN: '0px 0px -50px 0px',  // Margin around viewport
    
    // Scroll settings
    HEADER_SCROLL_THRESHOLD: 50,  // Pixels scrolled before header style changes
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const DOM = {
    header: document.querySelector('.header'),
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    revealElements: document.querySelectorAll('.reveal-on-scroll'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    projectCards: document.querySelectorAll('.project-card'),
    contactForm: document.getElementById('contact-form'),
    formStatus: document.querySelector('.form-status'),
    currentYearEl: document.getElementById('current-year'),
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ==========================================================================
// MOBILE NAVIGATION
// ==========================================================================

/**
 * Initialize mobile navigation functionality
 * Handles hamburger menu toggle and closing on link click
 */
function initMobileNav() {
    if (!DOM.navToggle || !DOM.navMenu) return;
    
    // Toggle menu on hamburger click
    DOM.navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking a nav link
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

/**
 * Toggle mobile menu open/closed state
 */
function toggleMobileMenu() {
    const isExpanded = DOM.navToggle.getAttribute('aria-expanded') === 'true';
    
    DOM.navToggle.setAttribute('aria-expanded', !isExpanded);
    DOM.navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    DOM.navToggle.setAttribute('aria-expanded', 'false');
    DOM.navMenu.classList.remove('active');
    document.body.classList.remove('nav-open');
}

// ==========================================================================
// SMOOTH SCROLLING
// ==========================================================================

/**
 * Initialize smooth scrolling for all anchor links
 * Uses native smooth scroll with fallback
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Handle scroll to top for "#" or "#home"
            if (targetId === '#' || targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed header
                const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// ACTIVE NAV LINK HIGHLIGHTING
// ==========================================================================

/**
 * Initialize active nav link highlighting based on scroll position
 * Uses IntersectionObserver for better performance
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    
    if (!sections.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveNavLink(currentId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Update which nav link is marked as active
 * @param {string} currentSectionId - ID of the currently visible section
 */
function updateActiveNavLink(currentSectionId) {
    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// ==========================================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================================

/**
 * Initialize scroll reveal animations using IntersectionObserver
 * Elements with class 'reveal-on-scroll' will fade in when entering viewport
 */
function initScrollReveal() {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion()) {
        DOM.revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: CONFIG.REVEAL_ROOT_MARGIN,
        threshold: CONFIG.REVEAL_THRESHOLD
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing (one-time animation)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    DOM.revealElements.forEach(el => revealObserver.observe(el));
}

// ==========================================================================
// HEADER SCROLL EFFECT
// ==========================================================================

/**
 * Initialize header scroll effect
 * Adds 'scrolled' class when page is scrolled past threshold
 */
function initHeaderScroll() {
    if (!DOM.header) return;
    
    const handleScroll = debounce(() => {
        if (window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
}

// ==========================================================================
// PROJECT FILTERING
// ==========================================================================

/**
 * Initialize project filtering functionality
 * Allows filtering projects by category (All, Frontend, Backend, Full-Stack)
 */
function initProjectFilter() {
    if (!DOM.filterButtons.length || !DOM.projectCards.length) return;
    
    DOM.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button state
            DOM.filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Filter projects
            filterProjects(filter);
        });
    });
}

/**
 * Filter project cards based on category
 * @param {string} filter - Category to filter by ('all', 'frontend', 'backend', 'fullstack')
 */
function filterProjects(filter) {
    DOM.projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            // Re-trigger reveal animation if not already revealed
            if (!prefersReducedMotion()) {
                card.classList.remove('revealed');
                setTimeout(() => card.classList.add('revealed'), 50);
            }
        } else {
            card.classList.add('hidden');
        }
    });
}

// ==========================================================================
// CONTACT FORM VALIDATION
// ==========================================================================

/**
 * Initialize contact form with validation and submission handling
 */
function initContactForm() {
    if (!DOM.contactForm) return;
    
    // Real-time validation on blur
    const inputs = DOM.contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - Form field to validate
 * @returns {boolean} Whether the field is valid
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorEl = formGroup.querySelector('.form-error');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous state
    field.classList.remove('error', 'success');
    formGroup.classList.remove('has-error');
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Minimum length check (for message)
    else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
    }
    
    // Update UI
    if (!isValid) {
        field.classList.add('error');
        formGroup.classList.add('has-error');
        if (errorEl) errorEl.textContent = errorMessage;
    } else if (value) {
        field.classList.add('success');
    }
    
    return isValid;
}

/**
 * Clear error state from a field
 * @param {HTMLElement} field - Form field to clear
 */
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    field.classList.remove('error');
    formGroup.classList.remove('has-error');
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = DOM.contactForm.querySelectorAll('.form-input');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Focus first invalid field
        const firstError = DOM.contactForm.querySelector('.form-input.error');
        if (firstError) firstError.focus();
        return;
    }
    
    // Show loading state
    const submitBtn = DOM.contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Clear previous status
    DOM.formStatus.classList.remove('show-success', 'show-error');
    
    try {
        // Attempt to send email via EmailJS
        await sendEmail();
        
        // Show success message
        DOM.formStatus.classList.add('show-success');
        DOM.contactForm.reset();
        
        // Clear success states from fields
        inputs.forEach(input => input.classList.remove('success'));
        
    } catch (error) {
        console.error('Form submission error:', error);
        // Show error message
        DOM.formStatus.classList.add('show-error');
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Auto-hide status message after 5 seconds
        setTimeout(() => {
            DOM.formStatus.classList.remove('show-success', 'show-error');
        }, 5000);
    }
}

// ==========================================================================
// EMAILJS INTEGRATION
// ==========================================================================

/**
 * Send email using EmailJS
 * NOTE: This requires EmailJS to be configured with valid credentials
 * 
 * To enable email sending:
 * 1. Include EmailJS SDK in your HTML: 
 *    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
 * 2. Update CONFIG values at the top of this file with your EmailJS credentials
 * 3. Uncomment the emailjs.send() code below
 * 
 * @returns {Promise} Resolves on success, rejects on failure
 */
async function sendEmail() {
    // Get form data
    const formData = {
        from_name: document.getElementById('contact-name').value,
        from_email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value,
    };
    
    /*
    =======================================================================
    EMAILJS IMPLEMENTATION - UNCOMMENT WHEN READY TO USE
    =======================================================================
    
    To enable EmailJS:
    
    1. Add this script tag to your index.html, before your script.js:
       <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    
    2. Initialize EmailJS by adding this after the script loads:
       emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
    
    3. Uncomment the code below and remove the simulation code:
    
    try {
        // Initialize EmailJS (if not done globally)
        emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
        
        // Send the email
        const response = await emailjs.send(
            CONFIG.EMAILJS_SERVICE_ID,
            CONFIG.EMAILJS_TEMPLATE_ID,
            formData
        );
        
        console.log('Email sent successfully:', response);
        return response;
        
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
    
    =======================================================================
    */
    
    // SIMULATION MODE - Remove this when EmailJS is configured
    // This simulates a successful form submission for demo purposes
    return new Promise((resolve, reject) => {
        console.log('Form submission simulated (EmailJS not configured)');
        console.log('Form data:', formData);
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (change to reject() to test error handling)
            resolve({ status: 200, text: 'OK' });
        }, 1500);
    });
}

// ==========================================================================
// FOOTER - CURRENT YEAR
// ==========================================================================

/**
 * Update the copyright year in the footer
 */
function updateFooterYear() {
    if (DOM.currentYearEl) {
        DOM.currentYearEl.textContent = new Date().getFullYear();
    }
}

// ==========================================================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ==========================================================================

/**
 * Initialize keyboard navigation enhancements
 * Improves accessibility for keyboard users
 */
function initKeyboardNav() {
    // Allow Enter key to activate filter buttons
    DOM.filterButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Skip to main content link (add if needed)
    // This helps screen reader users skip the navigation
}

// ==========================================================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================================================

/**
 * Lazy load images that aren't handled by native lazy loading
 * This is a fallback for browsers that don't support loading="lazy"
 */
function initLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        console.log('Native lazy loading supported');
        return;
    }
    
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================================================
// TYPING EFFECT (OPTIONAL ENHANCEMENT)
// ==========================================================================

/**
 * Create a typing effect for text
 * Uncomment the call in init() to enable this effect on the hero name
 * @param {HTMLElement} element - Element to apply typing effect
 * @param {number} speed - Typing speed in milliseconds
 */
function typeWriter(element, speed = 100) {
    if (!element || prefersReducedMotion()) return;
    
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    console.log('Initializing Manish Karki Portfolio...');
    
    // Core functionality
    initMobileNav();
    initSmoothScroll();
    initActiveNavHighlight();
    initScrollReveal();
    initHeaderScroll();
    initProjectFilter();
    initContactForm();
    initKeyboardNav();
    initLazyLoading();
    
    // Update footer year
    updateFooterYear();
    
    // Optional: Uncomment to enable typing effect on hero name
    // const heroName = document.querySelector('.hero-name');
    // if (heroName) typeWriter(heroName, 80);
    
    console.log('Portfolio initialized successfully!');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

// ==========================================================================
// EXPORTS (for potential module usage)
// ==========================================================================
// If you want to use ES modules in the future:
// export { init, sendEmail, CONFIG };
