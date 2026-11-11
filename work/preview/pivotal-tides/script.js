/* ================================================================
   PIVOTAL TIDES: shared site script
   - Mobile nav toggle
   - FAQ accordion (works on any page with .faq-item elements)
   ================================================================ */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    const closeNav = () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('header') && !e.target.closest('.mobile-nav-menu')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;

    // ARIA wiring
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const wasOpen = item.classList.contains('active');
      // Close all others (optional, keeps accordion behavior)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-question');
          const otherToggleEl = other.querySelector('.faq-toggle');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherToggleEl) otherToggleEl.textContent = '+';
        }
      });
      item.classList.toggle('active', !wasOpen);
      trigger.setAttribute('aria-expanded', String(!wasOpen));
      const toggleEl = item.querySelector('.faq-toggle');
      if (toggleEl) toggleEl.textContent = !wasOpen ? '−' : '+';
    };

    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
