// Reveal cards and animate skill bars when they come into view
document.addEventListener('DOMContentLoaded', function () {
  const observerOpts = {root: null, rootMargin: '0px', threshold: 0.12};

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        // if it's a card, also add reveal-up to inner elements
        entry.target.querySelectorAll && entry.target.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));

        // animate skill fills inside the revealed element
        entry.target.querySelectorAll && entry.target.querySelectorAll('.skill .fill').forEach(fill => {
          const target = fill.getAttribute('data-fill') || fill.getAttribute('data-percent') || '';
          if (target) {
            // ensure numeric value
            const n = parseFloat(target.replace('%','')) || 0;
            requestAnimationFrame(() => { fill.style.width = n + '%'; });
          }
        });

        // unobserve to prevent re-triggering
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  // observe cards and larger sections
  document.querySelectorAll('.card, .hero-inner, .section').forEach(el => revealObserver.observe(el));

  // also animate skill bars that might be outside cards
  document.querySelectorAll('.skill').forEach(skill => revealObserver.observe(skill));
  
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function (ev) {
      const isOpen = siteNav.classList.toggle('show');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close nav when a link is clicked
    siteNav.querySelectorAll && siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      siteNav.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }));

    // close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('show')) {
        siteNav.classList.remove('show');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });

    // close when clicking outside the nav (for mobile)
    document.addEventListener('click', (e) => {
      if (!siteNav.classList.contains('show')) return;
      // if click is inside nav or on the toggle, ignore
      if (siteNav.contains(e.target) || navToggle.contains(e.target)) return;
      siteNav.classList.remove('show');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  }
});
