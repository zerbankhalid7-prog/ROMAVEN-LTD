// DOM Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Navigation Link
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // Mobile Menu Toggle
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(menuToggle);

    const nav = document.querySelector('nav');
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // ── Toast Notification System ──────────────────────────────────────────────
    function showToast(type, title, message) {
        // Remove existing toasts
        document.querySelectorAll('.romaven-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'romaven-toast romaven-toast--' + type;
        toast.innerHTML = `
            <div class="romaven-toast__icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="romaven-toast__body">
                <strong class="romaven-toast__title">${title}</strong>
                <p class="romaven-toast__msg">${message}</p>
            </div>
            <button class="romaven-toast__close"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(toast);

        // Slide in
        requestAnimationFrame(() => toast.classList.add('romaven-toast--visible'));

        // Auto dismiss after 6s
        const timer = setTimeout(() => dismissToast(toast), 6000);

        toast.querySelector('.romaven-toast__close').addEventListener('click', () => {
            clearTimeout(timer);
            dismissToast(toast);
        });
    }

    function dismissToast(toast) {
        toast.classList.remove('romaven-toast--visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }

    // ── Contact Form Submission via Formspree ─────────────────────────────────
    // FORMSPREE_ENDPOINT: replace 'xkoadpkw' with your own Formspree form ID
    // Get your free form ID at https://formspree.io
    const FORMSPREE_URL = 'https://formspree.io/f/xkoadpkw';

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nameInput    = this.querySelector('input[name="name"]');
            const emailInput   = this.querySelector('input[name="email"]');
            const subjectInput = this.querySelector('input[name="subject"]');
            const msgInput     = this.querySelector('textarea[name="message"]');
            const submitBtn    = this.querySelector('button[type="submit"]');

            const name    = nameInput.value.trim();
            const email   = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = msgInput.value.trim();

            // Client-side validation
            if (!name || !email || !subject || !message) {
                showToast('error', 'Missing Fields', 'Please fill in all fields before sending.');
                return;
            }

            // Loading state
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            submitBtn.disabled = true;

            try {
                // Build JSON payload for Formspree
                // _replyto  → Formspree sends auto-reply to the visitor
                // _subject  → subject line in your inbox
                const payload = {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _replyto: email,          // auto-reply goes to visitor
                    _subject: 'ROMAVEN Contact: ' + subject
                };

                const response = await fetch(FORMSPREE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.ok) {
                    // Success!
                    showToast(
                        'success',
                        'Message Sent Successfully! ✓',
                        `Thank you, ${name}! We have received your message and will reply to ${email} as soon as possible.`
                    );
                    this.reset();
                } else {
                    // Formspree returned an error
                    const errMsg = (data.errors && data.errors.map(err => err.message).join(', '))
                        || 'Something went wrong. Please try again.';
                    showToast('error', 'Failed to Send', errMsg);
                }

            } catch (err) {
                console.error('Form submission error:', err);
                showToast('error', 'Network Error', 'Could not reach the server. Please check your connection and try again.');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }

    // Smooth Scroll for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight + 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active navigation link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Close mobile menu if open
                nav.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .about-content, .contact-content');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;

            if (elementPosition < screenPosition - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize elements for animation
    const initAnimatedElements = () => {
        const elements = document.querySelectorAll('.service-card, .about-content, .contact-content');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Trigger animation for elements in view
        animateOnScroll();
    };

    initAnimatedElements();
    window.addEventListener('scroll', animateOnScroll);
});