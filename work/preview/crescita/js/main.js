/* Crescita Counseling — main.js */
(function(){
  'use strict';

  /* ----- Mobile nav toggle ----- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  /* Keep the mobile menu just below the header, whatever its height
     (the dismissible announcement bar changes it) */
  const siteHeader = document.querySelector('.site-header');
  const setHeaderH = () => {
    if(siteHeader) document.documentElement.style.setProperty('--header-h', Math.round(siteHeader.getBoundingClientRect().bottom) + 'px');
  };
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  window.addEventListener('orientationchange', setHeaderH);
  if(siteHeader && 'ResizeObserver' in window) new ResizeObserver(setHeaderH).observe(siteHeader);
  if(navToggle && mobileNav){
    navToggle.addEventListener('click', () => {
      setHeaderH();
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.setAttribute('data-open', String(!isOpen));
      mobileNav.setAttribute('aria-hidden', String(isOpen));
      mobileNav.inert = isOpen;
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('data-open', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.inert = true;
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true'){
        navToggle.click();
      }
    });
  }

  /* ----- Reveal on scroll ----- */
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ----- Footer year ----- */
  const yearEl = document.querySelector('[data-year]');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Contact form (Formspree) ----- */
  const form = document.querySelector('[data-contact-form]');
  if(form){
    const status = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      const hp = form.querySelector('[name="_gotcha"]');
      if(hp && hp.value) return;

      const data = new FormData(form);
      if(status){
        status.setAttribute('data-state', 'loading');
        status.textContent = 'Sending your message…';
      }
      if(submitBtn) submitBtn.disabled = true;

      try{
        const res = await fetch(form.action, {
          method:'POST',
          body:data,
          headers:{'Accept':'application/json'}
        });
        if(res.ok){
          if(status){
            status.setAttribute('data-state','success');
            status.textContent = 'Thank you — your message is on its way. We typically respond within one business day.';
          }
          form.reset();
        } else {
          const json = await res.json().catch(()=>({}));
          throw new Error(json.error || 'Submission failed');
        }
      } catch(err){
        if(status){
          status.setAttribute('data-state','error');
          status.textContent = 'Something went wrong. Please email info@crescitacounseling.com directly or try again.';
        }
      } finally {
        if(submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ----- Smooth-scroll for in-page anchors ----- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id && id.length > 1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
          const y = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      }
    });
  });

})();

  /* ----- Nav dropdown: robust hover with pointer intent ----- */
  /* Replace pure CSS :hover with JS so we can add a delay buffer
     that prevents the menu closing when moving diagonally to it */
  document.querySelectorAll('.nav-item').forEach(item => {
    const dropdown = item.querySelector('.nav-dropdown');
    if (!dropdown) return;

    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      dropdown.style.opacity = '1';
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.transform = 'translateX(-50%) translateY(0)';
      item.querySelector('.nav-link__caret').style.transform = 'rotate(180deg)';
    };

    const close = (delay = 120) => {
      closeTimer = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.pointerEvents = 'none';
        dropdown.style.transform = 'translateX(-50%) translateY(8px)';
        item.querySelector('.nav-link__caret').style.transform = '';
      }, delay);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', () => close(120));
    dropdown.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    dropdown.addEventListener('mouseleave', () => close(80));

    /* Keyboard / touch: toggle on button click */
    const btn = item.querySelector('button.nav-link');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = dropdown.style.opacity === '1';
        isOpen ? close(0) : open();
      });
    }

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!item.contains(e.target)) close(0);
    });
  });
// Re-settle hash links once fonts and the header height are known
window.addEventListener('load', function(){
  if(!location.hash) return;
  var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if(t) setTimeout(function(){ t.scrollIntoView({block:'start'}); }, 80);
});
