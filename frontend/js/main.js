'use strict';

/* ============================================================
   Theme Toggle — dark / light with localStorage persistence
   ============================================================ */
(function initTheme() {
  const stored = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', function () {
  /* ---- Apply persisted theme icon ---- */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function updateThemeIcon() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
  }

  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon();
    });
  }

  /* ============================================================
     Hamburger / Mobile Menu
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     Scroll-reveal — IntersectionObserver
     Adds .visible to [data-animate] elements at threshold 0.15
     ============================================================ */
  const animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show all immediately if IO not supported */
    animatedEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================================
     Skill bar animation — trigger on .visible
     ============================================================ */
  const skillItems = document.querySelectorAll('.skill-item');
  if ('IntersectionObserver' in window && skillItems.length) {
    const skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    skillItems.forEach(function (el) {
      skillObserver.observe(el);
    });
  }

  /* ============================================================
     Active nav link on scroll
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }
});
