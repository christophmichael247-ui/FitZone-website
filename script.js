/* ============================================================
   FITZONE GYM — script.js
   Navbar | Hamburger | Scroll Reveal | Active Links | Form
   ============================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. NAVBAR — scroll behaviour + active link highlighting
  ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for background
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Back-to-top button
    const btt = document.getElementById('back-to-top');
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------------------------------------------------------
     2. HAMBURGER MENU
  ------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('nav-links');

  function toggleMenu(forceClose = false) {
    const isOpen = !forceClose && !navList.classList.contains('open');
    navList.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);

    // Trap scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  // Close menu when a nav link is clicked
  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('open') &&
      !navList.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggleMenu(true);
    }
  });

  /* -------------------------------------------------------
     3. SMOOTH SCROLL — all anchor links
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -------------------------------------------------------
     4. SCROLL REVEAL — Intersection Observer
  ------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling elements in a grid
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.children].filter((el) =>
                el.classList.contains('reveal')
              )
            : [];
          const index = siblings.indexOf(entry.target);
          const delay = index >= 0 ? index * 100 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* -------------------------------------------------------
     5. CONTACT FORM — client-side validation & feedback
  ------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      let valid = true;

      // Reset states
      [name, email].forEach((field) => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      });

      // Simple validation
      if (!name.value.trim()) {
        highlightError(name);
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        highlightError(email);
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        formSuccess.textContent =
          '✓ Message sent! We\'ll get back to you shortly.';
        setTimeout(() => (formSuccess.textContent = ''), 5000);
      }, 1800);
    });
  }

  function highlightError(field) {
    field.style.borderColor = '#FF5733';
    field.style.boxShadow = '0 0 0 3px rgba(255,87,51,0.2)';
    field.focus();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* -------------------------------------------------------
     6. TICKER — pause on hover (UX improvement)
  ------------------------------------------------------- */
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  /* -------------------------------------------------------
     7. HERO PARALLAX — subtle depth effect
  ------------------------------------------------------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
        }
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------
     8. PRICING CARD — highlight on hover
  ------------------------------------------------------- */
  document.querySelectorAll('.pricing-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.pricing-card').forEach((c) => {
        if (c !== card) c.style.opacity = '0.65';
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.pricing-card').forEach((c) => {
        c.style.opacity = '';
      });
    });
  });

  /* -------------------------------------------------------
     9. SERVICE CARDS — stagger on load
  ------------------------------------------------------- */
  // Already handled by Intersection Observer above

  /* -------------------------------------------------------
     10. INIT
  ------------------------------------------------------- */
  // Run once on load to set initial active state
  onScroll();
})();