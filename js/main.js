/**
 * main.js — general site behaviour
 * - Mobile nav toggle
 * - Nav active state on scroll
 * - Smooth appear-on-scroll for sections
 */
(function () {
  'use strict';

  /* ── Mobile nav ── */
  var burger = document.getElementById('nav-burger');
  burger && burger.addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });

  /* Close mobile nav when a link is clicked */
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  });

  /* ── Nav shadow on scroll ── */
  var navEl = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navEl.style.boxShadow = '0 2px 24px rgba(0,0,0,0.35)';
    } else {
      navEl.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ── Scroll-reveal ── */
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = [
      '.reveal { opacity: 0; transform: translateY(18px); transition: opacity .55s ease, transform .55s ease; }',
      '.reveal.visible { opacity: 1; transform: none; }'
    ].join('');
    document.head.appendChild(style);

    var targets = document.querySelectorAll(
      '.wc, .hc, .pc, .ec, .odm-item, .stat'
    );
    targets.forEach(function (el) { el.classList.add('reveal'); });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { obs.observe(el); });
  }

})();
