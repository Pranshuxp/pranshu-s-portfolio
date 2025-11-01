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

  // Dynamic enhancements
  // Parallax background effect
  let parallaxBg = document.querySelector('.bg-visuals');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      parallaxBg.style.transform = `translateZ(0) translateY(${rate}px)`;
    });
  }

  // Create floating particles
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'floating-particles';
  document.body.appendChild(particlesContainer);

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
    particlesContainer.appendChild(particle);
  }

  // Card click expansion effect
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(110, 231, 183, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.marginLeft = '-10px';
      ripple.style.marginTop = '-10px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Typing effect for hero titles
  const heroTitles = document.querySelectorAll('.hero h1');
  heroTitles.forEach(title => {
    const text = title.textContent;
    title.textContent = '';
    title.classList.add('typing');
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        title.classList.remove('typing');
      }
    };
    setTimeout(typeWriter, 500);
  });

  // Mouse follow effect for interactive elements
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    document.querySelectorAll('.card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardX = (rect.left + rect.width / 2) / window.innerWidth;
      const cardY = (rect.top + rect.height / 2) / window.innerHeight;

      const deltaX = mouseX - cardX;
      const deltaY = mouseY - cardY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 0.3;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        card.style.transform = `translateY(${strength * -10}px) scale(${1 + strength * 0.05})`;
      } else {
        card.style.transform = '';
      }
    });
  });

  // Matrix rain effect (coder effect)
  const matrixRain = document.createElement('div');
  matrixRain.className = 'matrix-rain';
  document.body.appendChild(matrixRain);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  const columnCount = Math.floor(window.innerWidth / 20);

  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = i * 20 + 'px';
    column.style.animationDuration = Math.random() * 3 + 2 + 's';
    column.style.animationDelay = Math.random() * 2 + 's';

    let columnText = '';
    for (let j = 0; j < Math.floor(Math.random() * 30) + 10; j++) {
      columnText += characters.charAt(Math.floor(Math.random() * characters.length));
      columnText += '<br>';
    }
    column.innerHTML = columnText;
    matrixRain.appendChild(column);
  }

  // Advanced button animations
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.classList.add('btn-hover');
    });
    btn.addEventListener('mouseleave', function() {
      this.classList.remove('btn-hover');
    });
    btn.addEventListener('click', function() {
      this.classList.add('btn-click');
      setTimeout(() => this.classList.remove('btn-click'), 300);
    });
  });

  // Page transition animations
  const sections = document.querySelectorAll('.section, .hero');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.2}s`;
    section.classList.add('fade-in-up');
  });

  // Content sliders (carousel for cards)
  const cardContainers = document.querySelectorAll('.cards');
  cardContainers.forEach(container => {
    const cards = container.querySelectorAll('.card');
    // Skip slider for achievements page to show all cards in grid
    if (cards.length > 3 && !document.title.includes('Achievements')) {
      container.classList.add('slider-container');
      let currentIndex = 0;

      const prevBtn = document.createElement('button');
      prevBtn.className = 'slider-btn prev';
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.addEventListener('click', () => slide(-1));

      const nextBtn = document.createElement('button');
      nextBtn.className = 'slider-btn next';
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextBtn.addEventListener('click', () => slide(1));

      container.appendChild(prevBtn);
      container.appendChild(nextBtn);

      function slide(direction) {
        currentIndex = (currentIndex + direction + cards.length) % cards.length;
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    }
  });

  // Enhanced parallax and interactive backgrounds
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    if (parallaxBg) {
      parallaxBg.style.transform = `translateZ(0) translateY(${rate}px)`;
    }

    // Dynamic matrix rain speed based on scroll
    const matrixColumns = document.querySelectorAll('.matrix-column');
    matrixColumns.forEach(column => {
      const speed = 2 + (scrolled / 1000);
      column.style.animationDuration = `${speed}s`;
    });
  });

  // Staggered reveal for elements
  const observerOptions = { threshold: 0.1 };
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('stagger-reveal');
        }, index * 100);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .tag, .skill').forEach(el => staggerObserver.observe(el));

});
