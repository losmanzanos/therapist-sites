/* Lovett Counseling & Consulting — site behavior */

(function () {
  'use strict';

  // ---- Mobile menu toggle ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  let mobileMenuScrollY = 0;

  // iOS Safari mis-positions `position: fixed` elements once the page has
  // been scrolled (a long-standing WebKit quirk, worse with `overflow-x:
  // hidden` on <body>). Just locking body overflow isn't enough - freeze
  // body at its current scroll offset with position:fixed while the menu
  // is open, then restore the real scroll position on close.
  function openMobileMenu() {
    mobileMenuScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${mobileMenuScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function closeMobileMenu() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // Jump back instantly - a smooth-scroll animation here reads as the
    // page lurching after closing the menu, since <html> has
    // scroll-behavior: smooth for normal anchor links.
    const prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, mobileMenuScrollY);
    document.documentElement.style.scrollBehavior = prevBehavior;
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      if (open) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        closeMobileMenu();
      });
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen);
    });
  });

  // ---- Contact form gentle validation ----
  const form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#B16548';
          ok = false;
        }
      });
      if (!ok) {
        e.preventDefault();
        const note = form.querySelector('.form-status');
        if (note) {
          note.textContent = 'Please fill in the required fields.';
          note.style.color = '#9A5238';
        }
      }
    });

    // clear error border on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  // ---- Topnav scroll state (transparent over hero → solid when scrolled) ----
  const topnav = document.querySelector('.topnav');
  if (topnav) {
    const onScrollNav = () => {
      const scrolled = (window.scrollY || window.pageYOffset) > 60;
      topnav.classList.toggle('is-scrolled', scrolled);
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();
  }

  // ---- Subtle scroll parallax on .ornament elements ----
  // Each ornament has data-parallax (a speed factor, e.g. 0.12).
  // Elements drift slowly as the page scrolls. Reduced-motion users skip it.
  // Disabled on mobile (viewport < 768px)
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  if (!reducedMotion && !isMobile) {
    const ornaments = Array.from(document.querySelectorAll('.ornament[data-parallax]'));
    if (ornaments.length) {
      // Cache each ornament's anchor point (its position in document on load)
      const anchors = ornaments.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          anchor: rect.top + (window.scrollY || window.pageYOffset) + rect.height / 2,
          speed: parseFloat(el.dataset.parallax) || 0.12,
          baseRotate: parseFloat(el.dataset.rotate || '0'),
        };
      });

      let ticking = false;
      const update = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const vh = window.innerHeight;
        anchors.forEach(({ el, anchor, speed, baseRotate }) => {
          // Distance between viewport center and the ornament's anchor
          const viewportCenter = scrollY + vh / 2;
          const distance = viewportCenter - anchor;
          const offset = distance * speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) rotate(${baseRotate}deg)`;
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        // Recompute anchors on resize
        anchors.forEach(a => {
          const rect = a.el.getBoundingClientRect();
          a.anchor = rect.top + (window.scrollY || window.pageYOffset) + rect.height / 2 - parseFloat(a.el.style.transform?.match(/translate3d\(0,\s*(-?\d+\.?\d*)/)?.[1] || 0);
        });
        update();
      }, { passive: true });
      update();
    }
  }

  // ---- Smooth hero zoom on scroll (desktop only) ----
  // Disabled on mobile/short viewports and for reduced-motion users.
  const heroBg = document.querySelector('.hero-bg');
  const allowHeroZoom = !reducedMotion &&
    window.matchMedia('(min-width: 769px) and (min-height: 561px) and (hover: hover)').matches;

  if (heroBg && !allowHeroZoom) {
    heroBg.style.transform = '';
    heroBg.style.willChange = 'auto';
  }

  if (heroBg && allowHeroZoom) {
    let ticking = false;
    const updateHeroZoom = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroElement = document.querySelector('.hero');
      if (heroElement) {
        const heroHeight = heroElement.offsetHeight;
        // Calculate zoom: 1.0 at top (no zoom), up to 1.15 at bottom of hero
        const zoomFactor = 1 + (scrollY / heroHeight) * 0.15;
        // Clamp to reasonable values
        const clampedZoom = Math.min(zoomFactor, 1.15);
        heroBg.style.transform = `scale(${clampedZoom})`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroZoom);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeroZoom(); // Initialize
  }

  // ---- Image error fallback ----
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('img-failed');
      if (img.parentElement) img.parentElement.classList.add('has-failed-img');
    });
  });

  // ---- Subtle fade-in on scroll ----
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }
  // ---- Testimonial carousel ----
  (function(){
    var slides=document.querySelectorAll('#lovettTesti .testi-slide');
    var dots=document.querySelectorAll('#lovettDots .testi-dot');
    if(slides.length<2)return;
    var i=0,timer=null;
    function go(n){
      slides[i].classList.remove('active');dots[i].classList.remove('active');
      i=(n+slides.length)%slides.length;
      slides[i].classList.add('active');dots[i].classList.add('active');
    }
    function start(){stop();timer=setInterval(function(){go(i+1);},6500);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    dots.forEach(function(d,idx){d.addEventListener('click',function(){go(idx);start();});});
    var wrap=document.getElementById('lovettTesti');
    if(wrap){wrap.addEventListener('mouseenter',stop);wrap.addEventListener('mouseleave',start);}
    start();
  })();

})();
